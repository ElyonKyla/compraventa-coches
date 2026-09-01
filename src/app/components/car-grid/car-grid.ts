import { Component, input } from '@angular/core';

import { Car } from '../../models/car.model';
import { CarCard } from '../car-card/car-card';

@Component({
  selector: 'app-car-grid',
  imports: [CarCard],
  templateUrl: './car-grid.html',
  styleUrl: './car-grid.scss',
})
export class CarGrid {
  readonly cars = input.required<Car[]>();
}
