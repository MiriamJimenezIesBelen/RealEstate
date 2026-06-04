import { Routes } from '@angular/router';

import { HomeComponent }
  from './components/home/home';

import { DetailsComponent }
  from './components/details/details';

export const routes: Routes = [

  {
    path: '',
    component: HomeComponent
  },

  {
    path: 'details/:id',
    component: DetailsComponent
  }

];
