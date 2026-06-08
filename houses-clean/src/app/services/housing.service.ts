import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable} from 'rxjs';
import { HousingLocation } from '../housing-location.model';

@Injectable({
  providedIn: 'root'
})
export class HousingService {
  private http = inject(HttpClient);
  private url = 'http://localhost:3000/locations';
  // Reemplaza con tu clave real de WeatherAPI.com
  private weatherKey = 'd6541f92ba4c4983a00130000260406';

  getAllHousingLocations(): Observable<HousingLocation[]> {
    return this.http.get<HousingLocation[]>(this.url);
  }

  getHousingLocationById(id: number): Observable<HousingLocation> {
    return this.http.get<HousingLocation[]>(`${this.url}?id=${id}`).pipe(
      map(locations => locations[0])
    );
  }

  addHouse(house: HousingLocation): Observable<HousingLocation> {
    return this.http.post<HousingLocation>(this.url, house);
  }

  getWeather(lat: number, lon: number): Observable<any> {
    const key = 'a10bab28df4c38e7058409346bf95df9';
    return this.http.get<any>(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric&lang=es`
    );
  }



  submitApplication(firstName: string, lastName: string, email: string): void {
    console.log(`Solicitud recibida: ${firstName} ${lastName} (${email})`);
  }
}
