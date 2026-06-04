import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app'; // Apunta a app.ts
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient() // Necesario para el HousingService
  ]
}).catch(err => console.error(err));
