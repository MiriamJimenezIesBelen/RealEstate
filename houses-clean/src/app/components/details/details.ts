// Importa herramientas básicas de Angular
import { Component, inject, OnInit } from '@angular/core';

// Importa directivas comunes como *ngIf, *ngFor, pipes, etc.
import { CommonModule } from '@angular/common';

// Permite leer parámetros de la URL (por ejemplo :id)
import {ActivatedRoute, RouterLink} from '@angular/router';

// Servicio que maneja casas, clima y solicitudes
import { HousingService } from '../../housing.service';

import { HousingLocationModel }
  from '../../models/housing-location.model';

// Formularios reactivos y validadores
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// Librería Leaflet para mapas
import * as L from 'leaflet';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './details.html',
  styleUrl: './details.css'
})

export class DetailsComponent implements OnInit {

  // Lee la ruta actual
  route: ActivatedRoute = inject(ActivatedRoute);

  // Inyecta el servicio de viviendas
  housingService = inject(HousingService);

  housingLocation:
    HousingLocationModel | undefined;

  // Datos del clima
  weatherData: any;

  // Instancia del mapa Leaflet
  private map: any;

  // Definición del formulario reactivo
  applyForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ])
  });

  // Se ejecuta al iniciar el componente
  ngOnInit() {

    // Cargar datos guardados en LocalStorage
    const savedData = localStorage.getItem('applicationData');
    if (savedData) {
      this.applyForm.patchValue(JSON.parse(savedData));
    }

    //  Obtener el ID desde la URL
    const housingLocationId =
      parseInt(this.route.snapshot.params['id'], 10);

    //  Obtener la casa por ID
    this.housingService
      .getHousingLocationById(housingLocationId)
      .then(location => {
        this.housingLocation = location;
        if (location) {
          this.loadExtras();
        }
      });
  }

  // Carga clima y mapa
  private loadExtras() {

    // Obtener clima usando coordenadas
    this.housingService.getWeather(
      this.housingLocation!.coordinate.latitude,
      this.housingLocation!.coordinate.longitude
    ).then(data => this.weatherData = data);

    // Esperar a que exista el div del mapa
    setTimeout(() => this.initMap(), 100);
  }

  // Inicializa el mapa Leaflet
  private initMap(): void {
    const mapDiv = document.getElementById('map');

    if (this.housingLocation?.coordinate && mapDiv && !this.map) {

      const { latitude, longitude } = this.housingLocation.coordinate;

      // Crear mapa
      this.map = L.map('map').setView([latitude, longitude], 13);

      // Capa de OpenStreetMap
      L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        { attribution: '© OpenStreetMap' }
      ).addTo(this.map);

      // Marcador
      L.marker([latitude, longitude])
        .addTo(this.map)
        .bindPopup(this.housingLocation.name)
        .openPopup();

      // Forzar recalculo del tamaño
      setTimeout(() => this.map.invalidateSize(), 200);
    }
  }

  // Envío del formulario
  submitApplication() {
    if (this.applyForm.valid) {

      // Guardar en LocalStorage
      localStorage.setItem(
        'applicationData',
        JSON.stringify(this.applyForm.value)
      );

      // Enviar datos al servicio
      this.housingService.submitApplication(
        this.applyForm.value.firstName ?? '',
        this.applyForm.value.lastName ?? '',
        this.applyForm.value.email ?? ''
      );

      // Mensaje al usuario
      alert('¡Solicitud enviada!');
    }
  }
}
