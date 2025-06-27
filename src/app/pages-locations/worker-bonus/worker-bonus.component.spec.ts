import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkerBonusComponent } from './worker-bonus.component';

describe('WorkerBonusComponent', () => {
  let component: WorkerBonusComponent;
  let fixture: ComponentFixture<WorkerBonusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkerBonusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkerBonusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
