import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
    title: 'Taller & Cars Listanco',
  },
  {
    path: 'stock',
    loadComponent: () => import('./pages/stock/stock').then((m) => m.Stock),
    title: 'Stock | Taller & Cars Listanco',
  },
  {
    path: 'coches/:slug',
    loadComponent: () => import('./pages/car-detail/car-detail').then((m) => m.CarDetail),
    title: 'Ficha de coche | Taller & Cars Listanco',
  },
  {
    path: 'contacto',
    loadComponent: () => import('./pages/contact/contact').then((m) => m.Contact),
    title: 'Contacto | Taller & Cars Listanco',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
