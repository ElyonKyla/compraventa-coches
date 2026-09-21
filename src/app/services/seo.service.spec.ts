import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { SeoService } from './seo.service';

describe('SeoService', () => {
  let document: Document;
  let service: SeoService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    document = TestBed.inject(DOCUMENT);
    service = TestBed.inject(SeoService);
    document.head
      .querySelectorAll('link[rel="canonical"], #structured-data')
      .forEach((element) => element.remove());
  });

  it('replaces route metadata without duplicating canonical or JSON-LD elements', () => {
    service.update({
      title: 'Primera página',
      description: 'Primera descripción',
      path: '/primera',
      structuredData: {
        '@type': 'WebPage',
        name: 'Primera página',
      },
    });
    service.update({
      title: 'Segunda página',
      description: 'Segunda descripción',
      path: '/segunda?utm_source=ignored#fragment',
      structuredData: {
        '@type': 'WebPage',
        name: 'Segunda página',
      },
    });

    expect(TestBed.inject(Title).getTitle()).toBe('Segunda página');
    expect(document.head.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
    expect(document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href).toBe(
      'https://tallercarslistanco.es/segunda',
    );
    expect(document.head.querySelectorAll('#structured-data')).toHaveLength(1);
    expect(JSON.parse(document.getElementById('structured-data')?.textContent ?? '')).toMatchObject(
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Segunda página',
      },
    );
  });

  it('uses one top-level context for a JSON-LD graph', () => {
    service.update({
      title: 'Página con grafo',
      description: 'Descripción del grafo',
      path: '/grafo',
      structuredData: [
        { '@id': 'https://tallercarslistanco.es/#business', '@type': ['AutoRepair', 'AutoDealer'] },
        { '@type': 'Service', name: 'Importación de coches desde Alemania' },
      ],
    });

    const data = JSON.parse(document.getElementById('structured-data')?.textContent ?? '');
    expect(data['@context']).toBe('https://schema.org');
    expect(data['@graph']).toHaveLength(2);
    expect(data['@graph'].some((node: Record<string, unknown>) => '@context' in node)).toBe(false);
  });
});
