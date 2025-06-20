import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LocationIndexComponent } from './location-index.component';

describe('LocationIndexomponent', () => {
  let component: LocationIndexComponent;
  let fixture: ComponentFixture<LocationIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocationIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
