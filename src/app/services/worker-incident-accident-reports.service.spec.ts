import { TestBed } from '@angular/core/testing';

import { WorkerIncidentAccidentReportsService } from './worker-incident-accident-reports.service';

describe('WorkerIncidentAccidentReportsService', () => {
  let service: WorkerIncidentAccidentReportsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkerIncidentAccidentReportsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
