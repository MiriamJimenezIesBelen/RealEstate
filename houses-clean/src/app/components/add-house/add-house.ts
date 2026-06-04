import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HousingService } from '../../services/housing.service';
import { HousingLocation } from '../../housing-location.model';

@Component({
  selector: 'app-add-house',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './add-house.html',
  styleUrl: './add-house.css'
})
export class AddHouseComponent {
  private fb = inject(FormBuilder);
  private housingService = inject(HousingService);
  private router = inject(Router);

  successMsg = '';
  errorMsg = '';
  submitting = false;

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]], // Requerido, mín 3 [cite: 20, 55]
    city: ['', Validators.required],                           // Requerido [cite: 21]
    state: ['', Validators.required],                          // Requerido [cite: 22]
    availableUnits: [1, [Validators.required, Validators.min(1)]], // Requerido, número >= 1 [cite: 23]
    price: [10000, [Validators.required, Validators.min(10000)]],  // Requerido, número >= 10000 [cite: 26]
    wifi: [false],
    laundry: [false],
    available: [true] // Por defecto activo [cite: 29]
  });

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.successMsg = '';
    this.errorMsg = '';

    // Estructurar el objeto adaptándolo a las coordenadas por defecto obligatorias [cite: 30, 31, 76]
    const newHouse: HousingLocation = {
      name: this.form.value.name ?? '',
      city: this.form.value.city ?? '',
      state: this.form.value.state ?? '',
      availableUnits: Number(this.form.value.availableUnits),
      price: Number(this.form.value.price),
      wifi: !!this.form.value.wifi,
      laundry: !!this.form.value.laundry,
      available: !!this.form.value.available,
      photo: '', // Se manda vacío según documento [cite: 30]
      coordinate: { latitude: 40.4167, longitude: -3.7037 } // Coordenadas por defecto (Ej: Madrid) [cite: 31]
    };

    this.housingService.addHouse(newHouse).subscribe({
      next: (created) => {
        this.successMsg = `Vivienda "${created.name}" creada con éxito (ID: ${created.id})`; // [cite: 86, 87]
        this.form.reset({ availableUnits: 1, price: 10000, wifi: false, laundry: false, available: true });
        this.submitting = false;

        // Redirigir a inicio automáticamente a los 3 segundos [cite: 91]
        setTimeout(() => this.router.navigate(['/']), 3000);
      },
      error: () => {
        this.errorMsg = 'Error al guardar. ¿Está json-server corriendo?'; // [cite: 94, 95]
        this.submitting = false;
      }
    });
  }

  cancel() {
    this.router.navigate(['/']); // [cite: 101]
  }
}
