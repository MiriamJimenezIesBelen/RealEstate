import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HousingLocationModel } from '../../models/housing-location.model';

@Component({
  selector: 'app-housing-location',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './housing-location.html',
  styleUrl: './housing-location.css'
})
export class HousingLocationComponent {

  @Input({ required: true })
  housingLocation!: HousingLocationModel;

}
