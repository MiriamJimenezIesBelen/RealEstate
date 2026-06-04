import { Component, inject, signal } from '@angular/core';

import { HousingLocationModel }
  from '../../models/housing-location.model';

import { HousingService }
  from '../../housing.service';

import { HousingLocationComponent }
  from '../housing-location/housing-location';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HousingLocationComponent],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {

  housingService =
    inject(HousingService);

  housingLocationList =
    signal<HousingLocationModel[]>([]);

  filteredLocationList =
    signal<HousingLocationModel[]>([]);

  constructor() {

    this.housingService
      .getAllHousingLocations()
      .then(locations => {

        this.housingLocationList.set(locations);

        this.filteredLocationList.set(locations);

      });

  }

  filterResults(text: string): void {

    if (!text) {

      this.filteredLocationList.set(
        this.housingLocationList()
      );

      return;
    }

    this.filteredLocationList.set(

      this.housingLocationList().filter(

        location =>
          location.city
            .toLowerCase()
            .includes(text.toLowerCase())

      )

    );
  }
}
