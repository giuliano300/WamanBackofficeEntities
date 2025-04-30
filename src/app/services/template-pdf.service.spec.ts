import { TestBed } from '@angular/core/testing';

import { TemplatePdfService } from './template-pdf.service';

describe('TemplatePdfService', () => {
  let service: TemplatePdfService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TemplatePdfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
