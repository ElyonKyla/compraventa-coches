import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-contact-cta',
  imports: [RouterLink],
  templateUrl: './contact-cta.html',
  styleUrl: './contact-cta.scss',
})
export class ContactCta {
  readonly title = input('Consulta disponibilidad por teléfono');
}
