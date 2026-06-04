import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HousingLocation } from '../housing-location.model';

@Injectable({
  providedIn: 'root'
})
export class HousingService {
  private http = inject(HttpClient);
  private url = 'http://localhost:3000/locations';
  private weatherKey = 'd6541f92ba4c4983a00130000260406'; // WeatherAPI

  getAllHousingLocations(): Observable<HousingLocation[]> {
    return this.http.get<HousingLocation[]>(this.url);
  }

  getHousingLocationById(id: number): Observable<HousingLocation> {
    return this.http.get<HousingLocation>(`${this.url}/${id}`);
  }

  addHouse(house: HousingLocation): Observable<HousingLocation> {
    return this.http.post<HousingLocation>(this.url, house); // [cite: 33, 83]
  }

  getWeather(lat: number, lon: number): Observable<any> {
    return this.http.get(`https://api.weatherapi.com/v1/current.json?key=${this.weatherKey}&q=${lat},${lon}`); // [cite: 17]
  }

  submitApplication(firstName: string, lastName: string, email: string) {
    console.log(`Solicitud: ${firstName} ${lastName} (${email})`);
  }
}
