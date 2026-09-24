import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  DestroyRef,
  PLATFORM_ID,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { Car } from '../../models/car.model';

@Component({
  selector: 'app-hero',
  imports: [RouterLink],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {
  readonly cars = input<Car[]>([]);

  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly destroyRef = inject(DestroyRef);
  private readonly currentIndex = signal(0);
  private readonly pointerInside = signal(false);
  private readonly focusInside = signal(false);
  private readonly manuallyPaused = signal(false);
  private readonly reducedMotion = signal(false);
  private touchStartX: number | null = null;

  protected readonly activeIndex = computed(() => {
    const count = this.cars().length;
    return count ? this.currentIndex() % count : 0;
  });
  protected readonly activeCar = computed(() => this.cars()[this.activeIndex()]);
  protected readonly hasMultipleCars = computed(() => this.cars().length > 1);

  constructor() {
    if (this.isBrowser) {
      const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
      const updateMotionPreference = (event: MediaQueryListEvent) =>
        this.reducedMotion.set(event.matches);
      this.reducedMotion.set(motionPreference.matches);
      motionPreference.addEventListener('change', updateMotionPreference);
      this.destroyRef.onDestroy(() =>
        motionPreference.removeEventListener('change', updateMotionPreference),
      );
    }

    effect((onCleanup) => {
      const shouldAdvance =
        this.isBrowser &&
        this.hasMultipleCars() &&
        !this.pointerInside() &&
        !this.focusInside() &&
        !this.manuallyPaused() &&
        !this.reducedMotion();

      if (!shouldAdvance) {
        return;
      }

      const intervalId = window.setInterval(() => this.changeSlide(1, false), 6500);
      onCleanup(() => window.clearInterval(intervalId));
    });
  }

  protected setPointerInside(inside: boolean): void {
    this.pointerInside.set(inside);
  }

  protected setFocusInside(inside: boolean): void {
    this.focusInside.set(inside);
  }

  protected showPrevious(): void {
    this.changeSlide(-1);
  }

  protected showNext(): void {
    this.changeSlide(1);
  }

  protected showSlide(index: number): void {
    this.manuallyPaused.set(true);
    this.currentIndex.set(index);
  }

  protected handleKeydown(event: KeyboardEvent): void {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
      return;
    }

    event.preventDefault();
    this.changeSlide(event.key === 'ArrowLeft' ? -1 : 1);
  }

  protected handleTouchStart(event: TouchEvent): void {
    this.touchStartX = event.changedTouches[0]?.clientX ?? null;
  }

  protected handleTouchEnd(event: TouchEvent): void {
    const endX = event.changedTouches[0]?.clientX;
    if (this.touchStartX === null || endX === undefined) {
      return;
    }

    const distance = endX - this.touchStartX;
    this.touchStartX = null;

    if (Math.abs(distance) >= 50) {
      this.changeSlide(distance > 0 ? -1 : 1);
    }
  }

  private changeSlide(direction: -1 | 1, manual = true): void {
    const count = this.cars().length;
    if (count <= 1) {
      return;
    }

    if (manual) {
      this.manuallyPaused.set(true);
    }

    this.currentIndex.update((index) => (index + direction + count) % count);
  }
}
