import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInComponent } from './addIn.component';

describe('AddComponent', () => {
  let component: AddInComponent;
  let fixture: ComponentFixture<AddInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddInComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
