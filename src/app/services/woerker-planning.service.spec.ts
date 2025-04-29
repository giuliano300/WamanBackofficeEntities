import { TestBed } from '@angular/core/testing';

import { WoerkerPlanningService } from './woerker-planning.service';

describe('WoerkerPlanningService', () => {
  let service: WoerkerPlanningService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WoerkerPlanningService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
