import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { DIRECTUS_CONFIG } from '../config/directus.config';
import { CarsService } from './cars.service';

describe('CarsService', () => {
  const baseUrl = 'https://directus.example.test';
  let http: HttpTestingController;
  let service: CarsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: DIRECTUS_CONFIG,
          useValue: { baseUrl, useMocksOnError: false },
        },
      ],
    });

    http = TestBed.inject(HttpTestingController);
    service = TestBed.inject(CarsService);
  });

  afterEach(() => {
    http.verify();
  });

  it('requests public cars and maps images in a stable sort order', () => {
    const images = [
      { sort: null, directus_files_id: { id: 'missing-sort-a' } },
      { sort: 2, directus_files_id: 'second' },
      { sort: 1, directus_files_id: { id: 'primary' } },
      { directus_files_id: 'missing-sort-b' },
    ];
    const request = http.expectOne((candidate) => candidate.url === `${baseUrl}/items/cars`);

    expect(request.request.params.get('filter')).toBe(
      JSON.stringify({ status: { _in: ['available', 'reserved'] } }),
    );
    expect(request.request.params.get('deep[imagenes][_sort]')).toBe('sort');
    expect(request.request.params.get('fields')).toContain('imagenes.sort');
    expect(request.request.params.get('fields')).toContain('imagenes.directus_files_id.id');

    request.flush({
      data: [
        {
          id: 1,
          status: 'available',
          slug: 'volkswagen-golf-vi-match-2013',
          Titulo: 'Volkswagen Golf VI Match',
          Marca: 'Volkswagen',
          Modelo: 'Golf',
          Version: 'Match',
          Anio: 2013,
          Kilometraje: 100000,
          Precio: 10000,
          Combustible: 'Diesel',
          Cambio: 'Manual',
          Potencia: '105 CV',
          Motor: '1.6 TDI',
          Descripcion: 'Golf real',
          Equipamiento: 'Climatizador\nControl de crucero',
          destacado: true,
          imagenes: images,
        },
      ],
    });

    const [car] = service.getPublicCars();

    expect(car.slug).toBe('volkswagen-golf-vi-match-2013');
    expect(car.images).toEqual([
      `${baseUrl}/assets/primary`,
      `${baseUrl}/assets/second`,
      `${baseUrl}/assets/missing-sort-a`,
      `${baseUrl}/assets/missing-sort-b`,
    ]);
    expect(car.equipment).toEqual(['Climatizador', 'Control de crucero']);
    expect(images.map((image) => image.directus_files_id)).toEqual([
      { id: 'missing-sort-a' },
      'second',
      { id: 'primary' },
      'missing-sort-b',
    ]);
  });

  it('keeps the online inventory empty when Directus returns no cars', () => {
    const request = http.expectOne((candidate) => candidate.url === `${baseUrl}/items/cars`);

    request.flush({ data: [] });

    expect(service.getPublicCars()).toEqual([]);
  });

  it('does not expose mock cars when the online request fails', () => {
    const request = http.expectOne((candidate) => candidate.url === `${baseUrl}/items/cars`);

    request.flush('Directus unavailable', { status: 503, statusText: 'Service Unavailable' });

    expect(service.getPublicCars()).toEqual([]);
  });
});
