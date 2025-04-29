import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkerPlanningComponent } from './worker-planning.component';

describe('WorkersComponent', () => {
  let component: WorkerPlanningComponent;
  let fixture: ComponentFixture<WorkerPlanningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkerPlanningComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkerPlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
