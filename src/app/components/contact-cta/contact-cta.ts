import { Component, input } from '@angular/core';

@Component({
  selector: 'app-contact-cta',
  templateUrl: './contact-cta.html',
  styleUrl: './contact-cta.scss',
})
export class ContactCta {
  readonly title = input('Consulta disponibilidad por teléfono');
}
