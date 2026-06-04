import { Injectable } from '@angular/core';
import { HousingLocationModel } from './models/housing-location.model';

@Injectable({
  providedIn: 'root'
})
export class HousingService {

  private readonly apiUrl = 'http://localhost:3000/locations';
  private readonly localUrl = '/assets/db.json';
  private readonly weatherApiKey = '3fb0b08a688a4a9d96c115901260801';

  async getAllHousingLocations(): Promise<HousingLocationModel[]> {
    try {
      const response = await fetch(this.apiUrl);
      if (!response.ok) throw new Error('Servidor fuera de servicio');
      return await response.json();
    } catch {
      console.warn('API caída. Cargando datos locales...');
      try {
        const fallback = await fetch(this.localUrl);
        const data = await fallback.json();
        return data.locations ?? data;
      } catch {
        console.error('Error total');
        return [];
      }
    }
  }

  async getHousingLocationById(id: number): Promise<HousingLocationModel | undefined> {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`);
      return await response.json();
    } catch {
      const all = await this.getAllHousingLocations();
      return all.find(loc => loc.id === id);
    }
  }

  async getWeather(lat: number, lon: number): Promise<any> {
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${this.weatherApiKey}&q=${lat},${lon}&lang=es`
    );
    return await response.json();
  }

  submitApplication(firstName: string, lastName: string, email: string): void {
    console.log(`Solicitud guardada localmente: ${firstName} ${lastName}`);
    console.log(`Email: ${email}`);
  }
}
