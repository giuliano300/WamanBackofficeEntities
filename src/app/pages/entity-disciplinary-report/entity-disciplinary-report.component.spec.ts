import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityDisciplinaryReportComponent } from './entity-disciplinary-report.component';

describe('EntityDisciplinaryReportComponent', () => {
  let component: EntityDisciplinaryReportComponent;
  let fixture: ComponentFixture<EntityDisciplinaryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntityDisciplinaryReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntityDisciplinaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
