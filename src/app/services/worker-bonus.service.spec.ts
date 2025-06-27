import { TestBed } from '@angular/core/testing';

import { WorkerBonusService } from './worker-bonus.service';

describe('WorkerBonusService', () => {
  let service: WorkerBonusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkerBonusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
