import { Component, inject, OnInit } from '@angular/core';
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
  housingLocationList: HousingLocation[] = [];
  filteredLocationList: HousingLocation[] = [];
  private housingService = inject(HousingService);

  ngOnInit(): void {
    this.housingService.getAllHousingLocations().subscribe({
      next: (locations) => {
        this.housingLocationList = locations;
        this.filteredLocationList = locations;
      }
    });
  }

  filterResults(text: string) {
    if (!text) {
      this.filteredLocationList = this.housingLocationList;
      return;
    }
    this.filteredLocationList = this.housingLocationList.filter(
      location => location?.city.toLowerCase().includes(text.toLowerCase())
    );
  }
}
