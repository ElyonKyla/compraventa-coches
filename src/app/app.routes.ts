import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
    title: 'Nombre Pendiente Motor',
  },
  {
    path: 'stock',
    loadComponent: () => import('./pages/stock/stock').then((m) => m.Stock),
    title: 'Stock | Nombre Pendiente Motor',
  },
  {
    path: 'coches/:slug',
    loadComponent: () => import('./pages/car-detail/car-detail').then((m) => m.CarDetail),
    title: 'Ficha de coche | Nombre Pendiente Motor',
  },
  {
    path: 'contacto',
    loadComponent: () => import('./pages/contact/contact').then((m) => m.Contact),
    title: 'Contacto | Nombre Pendiente Motor',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
