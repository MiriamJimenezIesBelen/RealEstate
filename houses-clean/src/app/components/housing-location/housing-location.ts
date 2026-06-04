import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HousingLocation } from '../../housing-location.model';

@Component({
  selector: 'app-housing-location',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './housing-location.html',
  styleUrl: './housing-location.css'
})
export class HousingLocationComponent {
  @Input() housingLocation!: HousingLocation;
}
