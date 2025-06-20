import { TestBed } from '@angular/core/testing';

import { JobTypesService } from './jobTypes.service';

describe('WorkersService', () => {
  let service: JobTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
