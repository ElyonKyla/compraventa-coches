import { Component, computed, inject, signal } from '@angular/core';

import { CarFilterValue, CarFilters } from '../../components/car-filters/car-filters';
import { CarGrid } from '../../components/car-grid/car-grid';
import { CarsService } from '../../services/cars.service';

@Component({
  selector: 'app-stock',
  imports: [CarFilters, CarGrid],
  templateUrl: './stock.html',
  styleUrl: './stock.scss',
})
export class Stock {
  private readonly carsService = inject(CarsService);
  protected readonly brands = this.carsService.getBrands();
  protected readonly fuels = this.carsService.getFuels();
  protected readonly transmissions = this.carsService.getTransmissions();
  protected readonly filters = signal<CarFilterValue>({ brand: '', fuel: '', transmission: '', maxPrice: null });

  protected readonly filteredCars = computed(() => {
    const filters = this.filters();
    return this.carsService.getPublicCars().filter((car) => {
      return (
        (!filters.brand || car.brand === filters.brand) &&
        (!filters.fuel || car.fuel === filters.fuel) &&
        (!filters.transmission || car.transmission === filters.transmission) &&
        (!filters.maxPrice || car.price <= filters.maxPrice)
      );
    });
  });
}
