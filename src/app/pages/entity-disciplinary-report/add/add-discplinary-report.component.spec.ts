import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDiscplinaryReportComponent } from './add-discplinary-report.component';

describe('AddComponent', () => {
  let component: AddDiscplinaryReportComponent;
  let fixture: ComponentFixture<AddDiscplinaryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddDiscplinaryReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDiscplinaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
