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
    name:           ['', [Validators.required, Validators.minLength(3)]],
    city:           ['', Validators.required],
    state:          ['', Validators.required],
    availableUnits: [1,  [Validators.required, Validators.min(1)]],
    price:          [10000, [Validators.required, Validators.min(10000)]],
    wifi:           [false],
    laundry:        [false],
    available:      [true]
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.successMsg = '';
    this.errorMsg = '';

    const newHouse: HousingLocation = {
      name:           this.form.value.name ?? '',
      city:           this.form.value.city ?? '',
      state:          this.form.value.state ?? '',
      availableUnits: Number(this.form.value.availableUnits),
      price:          Number(this.form.value.price),
      wifi:           !!this.form.value.wifi,
      laundry:        !!this.form.value.laundry,
      available:      !!this.form.value.available,
      photo:          '',
      coordinate:     { latitude: 0, longitude: 0 }
    };

    this.housingService.addHouse(newHouse).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigate(['/']);
      },
      error: () => {
        this.errorMsg = '❌ Error al guardar. ¿Está json-server corriendo?';
        this.submitting = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/']);
  }
}
