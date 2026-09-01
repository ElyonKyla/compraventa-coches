import { Injectable } from '@angular/core';

import { MOCK_CARS } from '../data/mock-cars';
import { Car } from '../models/car.model';

@Injectable({ providedIn: 'root' })
export class CarsService {
  private readonly cars = MOCK_CARS;

  getPublicCars(): Car[] {
    return this.cars.filter((car) => car.status === 'available' || car.status === 'reserved');
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

  private getUniqueValues(field: 'brand' | 'fuel' | 'transmission'): string[] {
    return [...new Set(this.getPublicCars().map((car) => car[field]))].sort();
  }
}
