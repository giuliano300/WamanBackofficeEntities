import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityIncidentAccidentReportComponent } from './entity-incident-accident-report.component';

describe('EntityIncidentAccidentReportComponent', () => {
  let component: EntityIncidentAccidentReportComponent;
  let fixture: ComponentFixture<EntityIncidentAccidentReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntityIncidentAccidentReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntityIncidentAccidentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
