import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CarGrid } from '../../components/car-grid/car-grid';
import { ContactCta } from '../../components/contact-cta/contact-cta';
import { Hero } from '../../components/hero/hero';
import { CarsService } from '../../services/cars.service';

@Component({
  selector: 'app-home',
  imports: [CarGrid, ContactCta, Hero, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private readonly carsService = inject(CarsService);
  protected readonly featuredCars = computed(() => this.carsService.getFeaturedCars());
}
