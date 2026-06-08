import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HousingLocationComponent } from '../housing-location/housing-location';
import { HousingLocation } from '../../housing-location.model';
import { HousingService } from '../../services/housing.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HousingLocationComponent],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit {
  private housingService = inject(HousingService);

  housingLocationList = signal<HousingLocation[]>([]);
  filteredLocationList = signal<HousingLocation[]>([]);

  ngOnInit(): void {
    this.housingService.getAllHousingLocations().subscribe({
      next: (locations) => {
        this.housingLocationList.set(locations);
        this.filteredLocationList.set(locations);
      },
      error: (err) => console.error('Error cargando viviendas:', err)
    });
  }

  filterResults(text: string): void {
    if (!text) {
      this.filteredLocationList.set(this.housingLocationList());
      return;
    }
    this.filteredLocationList.set(
      this.housingLocationList().filter(
        location => location?.city.toLowerCase().includes(text.toLowerCase())
      )
    );
  }
}
