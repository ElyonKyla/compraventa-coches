import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';

import { DIRECTUS_CONFIG } from '../config/directus.config';
import { MOCK_CARS } from '../data/mock-cars';
import { Car, CarStatus } from '../models/car.model';

interface DirectusCarsResponse {
  data: DirectusCar[];
}

type DirectusFileRelation = string | { id?: string | null };

interface DirectusCarImage {
  directus_files_id?: DirectusFileRelation | null;
  sort?: number | null;
}

interface DirectusCar {
  id: number | string;
  status: CarStatus;
  slug: string;
  Titulo: string;
  Marca: string;
  Modelo: string;
  Version?: string | null;
  Anio: number;
  Kilometraje: number;
  Precio?: number | null;
  Combustible: string;
  Cambio: string;
  Potencia?: string | null;
  Motor?: string | null;
  Descripcion: string;
  Equipamiento?: string | null;
  destacado?: boolean | null;
  imagenes?: DirectusCarImage[] | null;
}

@Injectable({ providedIn: 'root' })
export class CarsService {
  private readonly http = inject(HttpClient);
  private readonly directus = inject(DIRECTUS_CONFIG);
  private readonly directusUrl = `${this.directus.baseUrl}/items/cars`;
  private readonly requestParams = new HttpParams()
    .set(
      'fields',
      'id,status,slug,Titulo,Marca,Modelo,Version,Anio,Kilometraje,Precio,Combustible,Cambio,Potencia,Motor,Descripcion,destacado,Equipamiento,imagenes.id,imagenes.sort,imagenes.directus_files_id.id',
    )
    .set('filter', JSON.stringify({ status: { _in: ['available', 'reserved'] } }))
    .set('deep[imagenes][_sort]', 'sort');

  private parseEquipment(equipment?: string | null): string[] {
    if (!equipment) {
      return [];
    }

    return equipment
      .split(/\r?\n/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  private mapDirectusImages(images?: DirectusCarImage[] | null): string[] {
    const directusImages = [...(images ?? [])]
      .sort(
        (left, right) =>
          (left.sort ?? Number.MAX_SAFE_INTEGER) - (right.sort ?? Number.MAX_SAFE_INTEGER),
      )
      .map((image) => image.directus_files_id)
      .map((file) => (typeof file === 'string' ? file : file?.id))
      .filter((id): id is string => Boolean(id))
      .map((id) => `${this.directus.baseUrl}/assets/${id}`);

    return directusImages.length ? directusImages : ['/images/car-mock-1.svg'];
  }

  private readonly cars = signal<Car[]>(this.directus.useMocksOnError ? MOCK_CARS : []);
  readonly loading = signal(true);

  constructor() {
    this.loadCarsFromDirectus();
  }

  getPublicCars(): Car[] {
    return this.cars().filter((car) => car.status === 'available' || car.status === 'reserved');
  }

  getFeaturedCars(): Car[] {
    return this.getPublicCars().filter((car) => car.featured);
  }

  getCarBySlug(slug: string): Car | undefined {
    return this.getPublicCars().find((car) => car.slug === slug);
  }

  getBrands(): string[] {
    return this.getUniqueValues('brand');
  }

  getFuels(): string[] {
    return this.getUniqueValues('fuel');
  }

  getTransmissions(): string[] {
    return this.getUniqueValues('transmission');
  }

  private loadCarsFromDirectus(): void {
    this.http
      .get<DirectusCarsResponse>(this.directusUrl, { params: this.requestParams })
      .subscribe({
        next: (response) => {
          this.cars.set(response.data.map((car) => this.mapDirectusCar(car)));
          this.loading.set(false);
        },
        error: () => {
          this.cars.set(this.directus.useMocksOnError ? MOCK_CARS : []);
          this.loading.set(false);
        },
      });
  }

  private mapDirectusCar(car: DirectusCar): Car {
    return {
      id: String(car.id),
      slug: car.slug,
      title: car.Titulo,
      brand: car.Marca,
      model: car.Modelo,
      version: car.Version ?? undefined,
      year: car.Anio,
      mileage: car.Kilometraje,
      price: car.Precio ?? 0,
      fuel: car.Combustible,
      transmission: car.Cambio,
      power: car.Potencia ?? undefined,
      engine: car.Motor ?? undefined,
      description: car.Descripcion,
      equipment: this.parseEquipment(car.Equipamiento),
      status: car.status,
      featured: Boolean(car.destacado),
      images: this.mapDirectusImages(car.imagenes),
    };
  }

  private getUniqueValues(field: 'brand' | 'fuel' | 'transmission'): string[] {
    return [...new Set(this.getPublicCars().map((car) => car[field]))].sort();
  }
}
