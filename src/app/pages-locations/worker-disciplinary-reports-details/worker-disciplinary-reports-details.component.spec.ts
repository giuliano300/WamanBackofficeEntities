import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkerDisciplinaryReportsDetailsComponent } from './worker-disciplinary-reports-details.component';

describe('WorkerDisciplinaryReportsDetailsComponent', () => {
  let component: WorkerDisciplinaryReportsDetailsComponent;
  let fixture: ComponentFixture<WorkerDisciplinaryReportsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkerDisciplinaryReportsDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkerDisciplinaryReportsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
