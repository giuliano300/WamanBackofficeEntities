import { Injectable } from '@angular/core';
import { API_URL, API_URL_DOC } from '../../main';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notifications } from '../interfaces/Notifications';

declare var $: any;

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private hubConnection: any;
  private connectionToken: string | null = null;

  constructor(private toastr: ToastrService, private http: HttpClient) {}

  startConnection(): void {
    const token = localStorage.getItem('authToken');
    if (!token) {
      this.stopConnection();
      return;
    }
    if (this.hubConnection && this.connectionToken === token) return;
    this.stopConnection();

    const connection = $.hubConnection(API_URL_DOC);
    this.hubConnection = connection;
    this.connectionToken = token;
    // Long polling sends the bearer in headers, never in URLs or access logs.
    connection.accessToken = token;
    const proxy = connection.createHubProxy('notificationHub');
    proxy.on('receiveNotification', (message: string) => {
      if (this.hubConnection !== connection || localStorage.getItem('authToken') !== token) return;
      this.toastr.info(message, '', {
        enableHtml: false,
        positionClass: 'toast-top-right',
        timeOut: 10000,
        closeButton: true,
        tapToDismiss: true,
        progressBar: true,
      });
    });

    const register = () => {
      if (this.hubConnection !== connection || localStorage.getItem('authToken') !== token) {
        connection.stop();
        return;
      }
      proxy.invoke('RegisterCurrentRecipient').fail(() => this.connectionFailed(connection));
    };
    connection.reconnected(register);
    connection.disconnected(() => {
      if (this.hubConnection === connection) {
        this.hubConnection = null;
        this.connectionToken = null;
      }
    });
    connection.start({ transport: 'longPolling' }).done(register)
      .fail(() => this.connectionFailed(connection));
  }

  stopConnection(): void {
    const connection = this.hubConnection;
    this.hubConnection = null;
    this.connectionToken = null;
    connection?.stop();
  }

  private connectionFailed(connection: any): void {
    if (this.hubConnection !== connection) return;
    this.stopConnection();
    // Do not log transport errors: they can contain connection identifiers.
    console.warn('Live notifications are unavailable. Refresh or sign in again.');
  }

  getUnreadNotifications(locationId: number, entityId: number): Observable<Notifications[]> {
    return this.http.get<Notifications[]>(`${API_URL}notifications/unread?locationId=${locationId}&entityId=${entityId}`);
  }

  markAsRead(id: number): Observable<any> {
    return this.http.post(`${API_URL}notifications/mark-as-read/${id}`, null);
  }
}
