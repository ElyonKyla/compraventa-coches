import { DecimalPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { input } from '@angular/core';

import { CarGallery } from '../../components/car-gallery/car-gallery';
import { CarSpecs } from '../../components/car-specs/car-specs';
import { ContactCta } from '../../components/contact-cta/contact-cta';
import { CarsService } from '../../services/cars.service';

@Component({
  selector: 'app-car-detail',
  imports: [CarGallery, CarSpecs, ContactCta, DecimalPipe, RouterLink],
  templateUrl: './car-detail.html',
  styleUrl: './car-detail.scss',
})
export class CarDetail {
  readonly slug = input.required<string>();
  private readonly carsService = inject(CarsService);
  protected readonly car = computed(() => this.carsService.getCarBySlug(this.slug()));
}
