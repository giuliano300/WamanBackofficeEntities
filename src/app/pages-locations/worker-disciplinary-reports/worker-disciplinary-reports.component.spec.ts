import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkerDisciplinaryReportsComponent } from './worker-disciplinary-reports.component';

describe('WorkerDisciplinaryReportsComponent', () => {
  let component: WorkerDisciplinaryReportsComponent;
  let fixture: ComponentFixture<WorkerDisciplinaryReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkerDisciplinaryReportsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkerDisciplinaryReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
