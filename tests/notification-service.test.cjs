// Framework-free regression tests for the real service, with transport/UI dependencies stubbed.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

const source = fs.readFileSync(path.join(__dirname, '../src/app/services/notification.service.ts'), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, experimentalDecorators: true },
}).outputText;

function setup(token = 'synthetic-token') {
  const storage = new Map(token ? [['authToken', token]] : []);
  const connections = [];
  const toasts = [];
  const requests = [];
  const module = { exports: {} };
  const sandbox = {
    exports: module.exports,
    require(name) {
      if (name === '@angular/core') return { Injectable: () => target => target };
      if (name === '../../main') return { API_URL: 'http://localhost/api/', API_URL_DOC: 'http://localhost/' };
      throw new Error('Unexpected runtime dependency: ' + name);
    },
    console: { warn() {} },
    localStorage: { getItem: name => storage.get(name) ?? null },
    $: {
      hubConnection(url) {
        const connection = {
          url, invocations: [], stopped: 0,
          createHubProxy(name) {
            assert.equal(name, 'notificationHub');
            return {
              on(event, handler) { connection.message = handler; },
              invoke(method, ...args) {
                connection.invocations.push({ method, args });
                return { fail(handler) { connection.invokeFailed = handler; } };
              },
            };
          },
          start(options) {
            connection.options = options;
            const deferred = {
              done(handler) { connection.started = handler; return deferred; },
              fail(handler) { connection.startFailed = handler; return deferred; },
            };
            return deferred;
          },
          reconnected(handler) { connection.reconnect = handler; },
          disconnected(handler) { connection.disconnect = handler; },
          stop() { connection.stopped++; connection.disconnect?.(); },
        };
        connections.push(connection);
        return connection;
      },
    },
  };
  vm.runInNewContext(compiled, sandbox);
  const service = new module.exports.NotificationService(
    { info: (...args) => toasts.push(args) },
    { get: url => requests.push(url), post: url => requests.push(url) },
  );
  return { service, connections, storage, toasts, requests };
}

test('anonymous sessions do not connect', () => {
  const state = setup(null);
  state.service.startConnection();
  assert.equal(state.connections.length, 0);
});

test('authenticated connection uses header-capable transport and server-derived recipient', () => {
  const state = setup();
  state.service.startConnection();
  const connection = state.connections[0];
  assert.equal(connection.accessToken, 'synthetic-token');
  assert.equal(connection.options.transport, 'longPolling');
  assert.equal(connection.qs, undefined);
  connection.started();
  assert.equal(connection.invocations[0].method, 'RegisterCurrentRecipient');
  assert.equal(connection.invocations[0].args.length, 0);
});

test('route changes reuse the active connection', () => {
  const state = setup();
  state.service.startConnection();
  state.service.startConnection();
  assert.equal(state.connections.length, 1);
});

test('reconnection re-registers the authenticated recipient', () => {
  const state = setup();
  state.service.startConnection();
  state.connections[0].started();
  state.connections[0].reconnect();
  assert.equal(state.connections[0].invocations.length, 2);
});

test('notification bodies are rendered as text, not HTML', () => {
  const state = setup();
  state.service.startConnection();
  state.connections[0].message('<b>Synthetic notice</b>');
  assert.equal(state.toasts[0][2].enableHtml, false);
});

test('logout stops the connection and ignores late messages', () => {
  const state = setup();
  state.service.startConnection();
  const previous = state.connections[0];
  state.service.stopConnection();
  previous.message('Late notice');
  previous.started();
  assert.ok(previous.stopped > 0);
  assert.equal(state.toasts.length, 0);
  assert.equal(previous.invocations.length, 0);
});

test('account change replaces the connection and suppresses old notifications', () => {
  const state = setup();
  state.service.startConnection();
  state.storage.set('authToken', 'second-synthetic-token');
  state.connections[0].message('Old account');
  state.service.startConnection();
  assert.equal(state.toasts.length, 0);
  assert.equal(state.connections.length, 2);
  assert.ok(state.connections[0].stopped > 0);
  assert.equal(state.connections[1].accessToken, 'second-synthetic-token');
});

test('failed registration stops transport without exposing an error payload', () => {
  const state = setup();
  state.service.startConnection();
  const connection = state.connections[0];
  connection.started();
  connection.invokeFailed({ sensitive: 'must-not-log' });
  assert.equal(connection.stopped, 1);
  state.service.startConnection();
  assert.equal(state.connections.length, 2);
});

test('failed startup can be retried without duplicate connections', () => {
  const state = setup();
  state.service.startConnection();
  state.connections[0].startFailed();
  state.service.startConnection();
  assert.equal(state.connections[0].stopped, 1);
  assert.equal(state.connections.length, 2);
});

test('REST notification operations keep their existing endpoint contract', () => {
  const state = setup();
  state.service.getUnreadNotifications(2, 0);
  state.service.markAsRead(3);
  assert.deepEqual(state.requests, [
    'http://localhost/api/notifications/unread?locationId=2&entityId=0',
    'http://localhost/api/notifications/mark-as-read/3',
  ]);
});
