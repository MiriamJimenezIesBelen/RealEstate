import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, Validators, NonNullableFormBuilder } from '@angular/forms';
import { HousingService } from '../../services/housing.service';
import { HousingLocation } from '../../housing-location.model';

declare let L: any;

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './details.html',
  styleUrl: './details.css'
})
export class DetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private housingService = inject(HousingService);
  private fb = inject(NonNullableFormBuilder);

  housingLocation = signal<HousingLocation | undefined>(undefined);
  weatherData = signal<any>(null);
  weatherError = signal(false);
  alreadyApplied = signal(false);
  private map: any;

  applyForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName:  ['', Validators.required],
    email:     ['', [Validators.required, Validators.email]]
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));

      const applied = JSON.parse(localStorage.getItem('appliedHouses') || '[]');
      this.alreadyApplied.set(applied.includes(String(id)));

      this.housingService.getHousingLocationById(id).subscribe(location => {
        this.housingLocation.set(location);
        setTimeout(() => this.initMap(), 0);
        this.housingService.getWeather(
          location.coordinate.latitude,
          location.coordinate.longitude
        ).subscribe({
          next: (data) => this.weatherData.set(data),
          error: () => this.weatherError.set(true)
        });
      });
    });

    const saved = localStorage.getItem('userApplicationProfile');
    if (saved) {
      this.applyForm.patchValue(JSON.parse(saved));
    }
  }

  private initMap(): void {
    const loc = this.housingLocation();
    if (!loc || this.map) return;

    const mapEl = document.getElementById('map');
    if (!mapEl) {
      setTimeout(() => this.initMap(), 100);
      return;
    }

    if (typeof L === 'undefined') return;

    const lat = loc.coordinate.latitude;
    const lon = loc.coordinate.longitude;

    this.map = L.map('map').setView([lat, lon], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
    L.marker([lat, lon])
      .addTo(this.map)
      .bindPopup(`<strong>${loc.name}</strong><br>${loc.city}, ${loc.state}`)
      .openPopup();
  }

  submitApplication(): void {
    if (this.applyForm.invalid) {
      this.applyForm.markAllAsTouched();
      return;
    }

    localStorage.setItem('userApplicationProfile', JSON.stringify(this.applyForm.getRawValue()));

    const id = this.housingLocation()?.id;
    const applied = JSON.parse(localStorage.getItem('appliedHouses') || '[]');
    if (!applied.includes(String(id))) {
      applied.push(String(id));
      localStorage.setItem('appliedHouses', JSON.stringify(applied));
    }

    this.housingService.submitApplication(
      this.applyForm.value.firstName ?? '',
      this.applyForm.value.lastName ?? '',
      this.applyForm.value.email ?? ''
    );

    this.applyForm.reset();
    this.alreadyApplied.set(true);
    alert('¡Solicitud enviada con éxito!');
  }
}
