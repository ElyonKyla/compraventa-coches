import { Component, computed, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface CarFilterValue {
  brand: string;
  fuel: string;
  transmission: string;
  maxPrice: number | null;
}

@Component({
  selector: 'app-car-filters',
  imports: [FormsModule],
  templateUrl: './car-filters.html',
  styleUrl: './car-filters.scss',
})
export class CarFilters {
  readonly brands = input.required<string[]>();
  readonly fuels = input.required<string[]>();
  readonly transmissions = input.required<string[]>();
  readonly value = model.required<CarFilterValue>();

  readonly hasActiveFilters = computed(() => {
    const value = this.value();
    return Boolean(value.brand || value.fuel || value.transmission || value.maxPrice);
  });

  updateFilter(key: keyof CarFilterValue, filterValue: string): void {
    const parsedValue = key === 'maxPrice' ? (filterValue ? Number(filterValue) : null) : filterValue;
    this.value.update((current) => ({ ...current, [key]: parsedValue }));
  }

  reset(): void {
    this.value.set({ brand: '', fuel: '', transmission: '', maxPrice: null });
  }
}
