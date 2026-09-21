import { Routes } from '@angular/router';

import { BUSINESS_STRUCTURED_DATA, IMPORT_SERVICE_STRUCTURED_DATA } from './config/seo.config';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
    data: {
      seo: {
        title: 'Taller mecánico y compraventa | Taller & Cars Listanco',
        description:
          'Taller mecánico, reparación y rectificado de motores, compraventa de vehículos e importación de coches desde Alemania.',
        path: '/',
        structuredData: [BUSINESS_STRUCTURED_DATA, IMPORT_SERVICE_STRUCTURED_DATA],
      },
    },
  },
  {
    path: 'taller',
    loadComponent: () => import('./pages/workshop/workshop').then((m) => m.Workshop),
    data: {
      seo: {
        title: 'Taller mecánico y rectificado de motores | Taller & Cars Listanco',
        description:
          'Taller mecánico, reparación y rectificado de motores en Taller & Cars Listanco. Contacto directo para solicitar información.',
        path: '/taller/',
        structuredData: BUSINESS_STRUCTURED_DATA,
      },
    },
  },
  {
    path: 'stock',
    loadComponent: () => import('./pages/stock/stock').then((m) => m.Stock),
    data: {
      seo: {
        title: 'Compraventa de vehículos | Taller & Cars Listanco',
        description:
          'Consulta los vehículos publicados por Taller & Cars Listanco para compraventa, con información de cada unidad.',
        path: '/stock/',
        structuredData: BUSINESS_STRUCTURED_DATA,
      },
    },
  },
  {
    path: 'coches/:slug',
    loadComponent: () => import('./pages/car-detail/car-detail').then((m) => m.CarDetail),
    data: {
      seo: {
        title: 'Ficha de vehículo | Taller & Cars Listanco',
        description: 'Consulta la información del vehículo publicado por Taller & Cars Listanco.',
        path: '/stock',
        robots: 'noindex, follow',
      },
    },
  },
  {
    path: 'importacion-coches-alemania',
    loadComponent: () => import('./pages/import-cars/import-cars').then((m) => m.ImportCars),
    data: {
      seo: {
        title: 'Importación de coches desde Alemania | Taller & Cars Listanco',
        description:
          'Información sobre la importación de coches desde Alemania de Taller & Cars Listanco y contacto directo para consultas.',
        path: '/importacion-coches-alemania/',
        structuredData: [BUSINESS_STRUCTURED_DATA, IMPORT_SERVICE_STRUCTURED_DATA],
      },
    },
  },
  {
    path: 'contacto',
    loadComponent: () => import('./pages/contact/contact').then((m) => m.Contact),
    data: {
      seo: {
        title: 'Contacto, horario y ubicación | Taller & Cars Listanco',
        description:
          'Teléfonos, horario y ubicación de Taller & Cars Listanco en Carretera General, 2, 32574 Listanco.',
        path: '/contacto/',
        structuredData: BUSINESS_STRUCTURED_DATA,
      },
    },
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
    data: {
      seo: {
        title: 'Página no encontrada | Taller & Cars Listanco',
        description: 'La página solicitada no está disponible.',
        path: '/pagina-no-encontrada',
        robots: 'noindex, follow',
      },
    },
  },
];
