import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { HousingLocationComponent } from './housing-location';

describe('HousingLocationComponent', () => {
  let component: HousingLocationComponent;
  let fixture: ComponentFixture<HousingLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HousingLocationComponent],
      providers: [provideRouter([])] // Añadimos esto porque el componente usa RouterModule
    }).compileComponents();

    fixture = TestBed.createComponent(HousingLocationComponent);
    component = fixture.componentInstance;

    component.housingLocation = {
      id: 99,
      name: 'Test Home',
      city: 'Test City',
      state: 'ST',
      photo: '',
      availableUnits: 1,
      wifi: true,
      laundry: true,
      price: 10000,
      available: true,
      coordinate: { latitude: 0, longitude: 0 }
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
