import { DecimalPipe } from '@angular/common';
import { Component, computed, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CarGallery } from '../../components/car-gallery/car-gallery';
import { CarSpecs } from '../../components/car-specs/car-specs';
import { ContactCta } from '../../components/contact-cta/contact-cta';
import { CarsService } from '../../services/cars.service';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-car-detail',
  imports: [CarGallery, CarSpecs, ContactCta, DecimalPipe, RouterLink],
  templateUrl: './car-detail.html',
  styleUrl: './car-detail.scss',
})
export class CarDetail {
  readonly slug = input('');
  private readonly carsService = inject(CarsService);
  private readonly seo = inject(SeoService);
  protected readonly car = computed(() => this.carsService.getCarBySlug(this.slug()));
  protected readonly loading = this.carsService.loading;

  constructor() {
    effect(() => {
      const slug = this.slug();
      const car = this.car();
      if (!slug || this.loading()) {
        return;
      }

      const path = `/coches/${encodeURIComponent(slug)}`;
      if (!car) {
        this.seo.update({
          title: 'Vehículo no disponible | Taller & Cars Listanco',
          description: 'El vehículo solicitado no se encuentra disponible en el stock publicado.',
          path,
          robots: 'noindex, follow',
        });
        return;
      }

      const description = `${car.title}, año ${car.year}, con ${car.mileage.toLocaleString('es-ES')} km. Consulta su ficha y disponibilidad.`;
      const image = car.images[0]?.startsWith('http') ? car.images[0] : undefined;
      this.seo.update({
        title: `${car.title} | Taller & Cars Listanco`,
        description,
        path,
        type: 'website',
        image,
        imageAlt: car.title,
        structuredData: {
          '@type': 'Vehicle',
          name: car.title,
          description: car.description,
          url: `https://tallercarslistanco.es${path}`,
          ...(image ? { image } : {}),
          brand: {
            '@type': 'Brand',
            name: car.brand,
          },
          model: car.model,
          mileageFromOdometer: {
            '@type': 'QuantitativeValue',
            value: car.mileage,
            unitCode: 'KMT',
          },
          fuelType: car.fuel,
          vehicleTransmission: car.transmission,
        },
      });
    });
  }
}
