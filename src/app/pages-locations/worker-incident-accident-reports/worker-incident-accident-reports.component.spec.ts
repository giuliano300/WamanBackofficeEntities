import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkerIncidentAccidentReportsComponent } from './worker-incident-accident-reports.component';

describe('WorkerIncidentAccidentReportsComponent', () => {
  let component: WorkerIncidentAccidentReportsComponent;
  let fixture: ComponentFixture<WorkerIncidentAccidentReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkerIncidentAccidentReportsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkerIncidentAccidentReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
