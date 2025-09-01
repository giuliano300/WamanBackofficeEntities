import { ComponentFixture, TestBed } from '@angular/core/testing';

import { addInAccRepComponent } from './addInAccRep.component';

describe('AddComponent', () => {
  let component: addInAccRepComponent;
  let fixture: ComponentFixture<addInAccRepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [addInAccRepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(addInAccRepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
