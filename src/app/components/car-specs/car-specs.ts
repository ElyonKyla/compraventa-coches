import { DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';

import { Car } from '../../models/car.model';

@Component({
  selector: 'app-car-specs',
  imports: [DecimalPipe],
  templateUrl: './car-specs.html',
  styleUrl: './car-specs.scss',
})
export class CarSpecs {
  readonly car = input.required<Car>();
}
