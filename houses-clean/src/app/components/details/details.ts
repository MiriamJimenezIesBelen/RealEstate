import { Component, inject, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HousingService } from '../../services/housing.service';
import { HousingLocation } from '../../housing-location.model';

// Declaración global segura para usar Leaflet sin instalar tipos complejos
declare let L: any;

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './details.html',
  styleUrl: './details.css'
})
export class DetailsComponent implements OnInit, AfterViewInit {
  private route = inject(ActivatedRoute);
  private housingService = inject(HousingService);

  housingLocation: HousingLocation | undefined;
  weatherData: any;
  map: any;

  applyForm = new FormGroup({
    firstName: new FormControl('', Validators.required), // Requerido [cite: 12]
    lastName: new FormControl('', Validators.required),  // Requerido [cite: 12]
    email: new FormControl('', [Validators.required, Validators.email]) // Formato email [cite: 13]
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.params['id']);

    this.housingService.getHousingLocationById(id).subscribe({
      next: (location) => {
        this.housingLocation = location;

        // Llamar a la API de Clima usando latitud y longitud
        this.getWeatherInfo(location.coordinate.latitude, location.coordinate.longitude);

        // Inicializar el mapa de Leaflet si la vista ya cargó
        this.initMap();
      }
    });

    // LocalStorage: Recuperar y autocompletar si existen datos previos [cite: 16]
    const savedUserData = localStorage.getItem('userApplicationProfile');
    if (savedUserData) {
      const parsedData = JSON.parse(savedUserData);
      this.applyForm.patchValue(parsedData);
    }
  }

  ngAfterViewInit(): void {
    if (this.housingLocation) {
      this.initMap();
    }
  }

  getWeatherInfo(lat: number, lon: number) {
    this.housingService.getWeather(lat, lon).subscribe({
      next: (data) => this.weatherData = data,
      error: (err) => console.error('Error cargando clima:', err)
    });
  }

  initMap() {
    if (!this.housingLocation || this.map) return;

    const lat = this.housingLocation.coordinate.latitude;
    const lon = this.housingLocation.coordinate.longitude;

    // Crear mapa Leaflet centrado en la ubicación
    this.map = L.map('map').setView([lat, lon], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    L.marker([lat, lon]).addTo(this.map)
      .bindPopup(this.housingLocation.name)
      .openPopup();
  }

  submitApplication() {
    if (this.applyForm.invalid) {
      this.applyForm.markAllAsTouched();
      return;
    }

    // LocalStorage: Guardar permanentemente la información en el cliente [cite: 15]
    localStorage.setItem('userApplicationProfile', JSON.stringify(this.applyForm.value));

    alert('¡Solicitud registrada con éxito! Los datos se han guardado localmente.');
    this.housingService.submitApplication(
      this.applyForm.value.firstName ?? '',
      this.applyForm.value.lastName ?? '',
      this.applyForm.value.email ?? ''
    );
  }
}
