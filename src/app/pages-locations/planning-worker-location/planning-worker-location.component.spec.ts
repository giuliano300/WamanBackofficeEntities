import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningWorkerLocationComponent } from './planning-worker-location.component';

describe('WorkersComponent', () => {
  let component: PlanningWorkerLocationComponent;
  let fixture: ComponentFixture<PlanningWorkerLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanningWorkerLocationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanningWorkerLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
