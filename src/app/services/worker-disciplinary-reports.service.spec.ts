import { TestBed } from '@angular/core/testing';

import { WorkerDisciplinaryReportsService } from './worker-disciplinary-reports.service';

describe('WorkerDisciplinaryReportsService', () => {
  let service: WorkerDisciplinaryReportsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkerDisciplinaryReportsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
