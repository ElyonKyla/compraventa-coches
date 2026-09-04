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

  previousImage(): void {
    const total = this.images().length;

    if (total < 2) {
      return;
    }

    this.selectedIndex.update((index) => (index - 1 + total) % total);
  }

  nextImage(): void {
    const total = this.images().length;

    if (total < 2) {
      return;
    }

    this.selectedIndex.update((index) => (index + 1) % total);
  }
}
