import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <section class="not-found">
      <p>Página no encontrada</p>
      <h1>Esta página no está disponible</h1>
      <a routerLink="/">Volver al inicio</a>
    </section>
  `,
  styles: `
    .not-found {
      background: #141416eb;
      border: 1px solid #ffffff17;
      padding: clamp(1.25rem, 4vw, 2rem);
    }
    .not-found p {
      color: var(--color-red-accent);
    }
    .not-found h1 {
      color: #fff;
    }
    .not-found a {
      color: var(--color-red-accent);
    }
  `,
})
export class NotFound {}
