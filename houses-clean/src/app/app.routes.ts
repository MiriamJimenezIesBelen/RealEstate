import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { DetailsComponent } from './components/details/details';
import { AddHouseComponent } from './components/add-house/add-house';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Homes - Inicio'
  },
  {
    path: 'details/:id',
    component: DetailsComponent,
    title: 'Detalles de la Vivienda'
  },
  {
    path: 'add-house',
    component: AddHouseComponent,
    title: 'Añadir Nueva Vivienda'
  }
];
