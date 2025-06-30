import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkerBonusGeneralComponent } from './worker-bonus-general.component';

describe('WorkerBonusGeneralComponent', () => {
  let component: WorkerBonusGeneralComponent;
  let fixture: ComponentFixture<WorkerBonusGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkerBonusGeneralComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkerBonusGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
