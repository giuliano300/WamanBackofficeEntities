import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWbComponent } from './addWb.component';

describe('AddWbComponent', () => {
  let component: AddWbComponent;
  let fixture: ComponentFixture<AddWbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddWbComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddWbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
