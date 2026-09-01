import { DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Car } from '../../models/car.model';

@Component({
  selector: 'app-car-card',
  imports: [DecimalPipe, RouterLink],
  templateUrl: './car-card.html',
  styleUrl: './car-card.scss',
})
export class CarCard {
  readonly car = input.required<Car>();
}
