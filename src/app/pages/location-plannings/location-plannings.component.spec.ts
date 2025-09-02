import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationPlanningsComponent } from './location-plannings.component';

describe('LocationPlanningsComponent', () => {
  let component: LocationPlanningsComponent;
  let fixture: ComponentFixture<LocationPlanningsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationPlanningsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocationPlanningsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
