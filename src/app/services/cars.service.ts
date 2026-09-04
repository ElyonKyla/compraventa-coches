import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';

import { MOCK_CARS } from '../data/mock-cars';
import { Car, CarStatus } from '../models/car.model';

interface DirectusCarsResponse {
  data: DirectusCar[];
}

type DirectusFileRelation = string | { id?: string | null };

interface DirectusCarImage {
  directus_files_id?: DirectusFileRelation | null;
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
  private readonly directusUrl = 'http://localhost:8055/items/cars?fields=*,imagenes.*';

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
    const directusImages = images
      ?.map((image) => image.directus_files_id)
      .map((file) => (typeof file === 'string' ? file : file?.id))
      .filter((id): id is string => Boolean(id))
      .map((id) => `http://localhost:8055/assets/${id}`);

    return directusImages?.length ? directusImages : ['/images/car-mock-1.svg'];
  }

  private readonly cars = signal<Car[]>(MOCK_CARS);

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
    this.http.get<DirectusCarsResponse>(this.directusUrl).subscribe({
      next: (response) => {
        this.cars.set(response.data.map((car) => this.mapDirectusCar(car)));
      },
      error: () => {
        this.cars.set(MOCK_CARS);
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
