import { TestBed } from '@angular/core/testing';

import { EntitiesService } from './Entities.service';

describe('UsersService', () => {
  let service: EntitiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntitiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
