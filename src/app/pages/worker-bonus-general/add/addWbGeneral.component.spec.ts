import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWbGeneralComponent } from './addWbGeneral.component';

describe('AddWbComponent', () => {
  let component: AddWbGeneralComponent;
  let fixture: ComponentFixture<AddWbGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddWbGeneralComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddWbGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
