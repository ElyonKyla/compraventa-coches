import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-car-gallery',
  templateUrl: './car-gallery.html',
  styleUrl: './car-gallery.scss',
})
export class CarGallery {
  readonly images = input.required<string[]>();
  readonly title = input.required<string>();
  readonly selectedIndex = signal(0);
}
