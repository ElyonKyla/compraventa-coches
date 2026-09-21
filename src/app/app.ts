import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Footer } from './components/footer/footer';
import { Header } from './components/header/header';
import { SeoService } from './services/seo.service';

@Component({
  imports: [Footer, Header, RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  private readonly seo = inject(SeoService);

  constructor() {
    this.seo.start();
  }
}
