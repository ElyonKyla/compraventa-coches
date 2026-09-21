import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

import {
  BUSINESS_STRUCTURED_DATA,
  DEFAULT_SOCIAL_IMAGE,
  SITE_NAME,
  SITE_URL,
  SeoData,
} from '../config/seo.config';

const FALLBACK_SEO: SeoData = {
  title: 'Taller mecánico y compraventa | Taller & Cars Listanco',
  description:
    'Taller mecánico, reparación y rectificado de motores, compraventa de vehículos e importación de coches desde Alemania.',
  path: '/',
  structuredData: BUSINESS_STRUCTURED_DATA,
};

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly document = inject(DOCUMENT);
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private started = false;

  start(): void {
    if (this.started) {
      return;
    }

    this.started = true;
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      let route = this.activatedRoute;
      while (route.firstChild) {
        route = route.firstChild;
      }

      this.update((route.snapshot.data['seo'] as SeoData | undefined) ?? FALLBACK_SEO);
    });
  }

  update(seo: SeoData): void {
    const requestedUrl = new URL(seo.path, `${SITE_URL}/`);
    const canonical = new URL(requestedUrl.pathname, `${SITE_URL}/`);
    const canonicalUrl = canonical.toString();
    const image = seo.image ?? DEFAULT_SOCIAL_IMAGE;

    this.title.setTitle(seo.title);
    this.meta.updateTag({ name: 'description', content: seo.description });
    this.meta.updateTag({ name: 'robots', content: seo.robots ?? 'index, follow' });
    this.meta.updateTag({ property: 'og:title', content: seo.title });
    this.meta.updateTag({ property: 'og:description', content: seo.description });
    this.meta.updateTag({ property: 'og:type', content: seo.type ?? 'website' });
    this.meta.updateTag({ property: 'og:url', content: canonicalUrl });
    this.meta.updateTag({ property: 'og:site_name', content: SITE_NAME });
    this.meta.updateTag({ property: 'og:locale', content: 'es_ES' });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:image:alt', content: seo.imageAlt ?? SITE_NAME });
    this.setCanonical(canonicalUrl);
    this.setStructuredData(seo.structuredData);
  }

  private setCanonical(url: string): void {
    let canonical = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = this.document.createElement('link');
      canonical.rel = 'canonical';
      this.document.head.appendChild(canonical);
    }
    canonical.href = url;
  }

  private setStructuredData(data?: Record<string, unknown> | Record<string, unknown>[]): void {
    this.document.getElementById('structured-data')?.remove();
    if (!data) {
      return;
    }

    const script = this.document.createElement('script');
    script.id = 'structured-data';
    script.type = 'application/ld+json';
    const structuredData = Array.isArray(data)
      ? { '@context': 'https://schema.org', '@graph': data }
      : { '@context': 'https://schema.org', ...data };
    script.textContent = JSON.stringify(structuredData).replace(/</g, '\\u003c');
    this.document.head.appendChild(script);
  }
}
