import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { JSDOM } from 'jsdom';

const siteUrl = 'https://tallercarslistanco.es';
const output = new URL('../dist/compraventa-coches/browser/', import.meta.url);
const outputPath = output.pathname;
const sitemapPath = join(outputPath, 'sitemap.xml');
const robotsPath = join(outputPath, 'robots.txt');
const staticPaths = ['/', '/taller/', '/stock/', '/importacion-coches-alemania/', '/contacto/'];

function validateStructuredData(data, url) {
  if (data['@context'] !== 'https://schema.org') {
    throw new Error(`Contexto Schema.org ausente o incorrecto en ${url}.`);
  }

  const nodes = data['@graph'] ?? [data];
  if (!Array.isArray(nodes) || nodes.length === 0) {
    throw new Error(`@graph vacío o ambiguo en ${url}.`);
  }

  for (const node of nodes) {
    if (data['@graph'] && node['@context']) {
      throw new Error(`Contexto Schema.org duplicado dentro de @graph en ${url}.`);
    }

    const types = Array.isArray(node['@type']) ? node['@type'] : [node['@type']];
    if (types.includes('AutoRepair') || types.includes('AutoDealer')) {
      if (!types.includes('AutoRepair') || !types.includes('AutoDealer')) {
        throw new Error(`Tipos de negocio incompletos en ${url}.`);
      }
      if (
        node.name !== 'Taller & Cars Listanco' ||
        node.url !== `${siteUrl}/` ||
        node.address?.['@type'] !== 'PostalAddress' ||
        !Array.isArray(node.telephone) ||
        node.telephone.length !== 2
      ) {
        throw new Error(`Datos estructurados del negocio incompletos en ${url}.`);
      }
    } else if (types.includes('Service')) {
      if (
        node.name !== 'Importación de coches desde Alemania' ||
        node.provider?.['@id'] !== `${siteUrl}/#business`
      ) {
        throw new Error(`Servicio de importación incoherente en ${url}.`);
      }
    } else if (types.includes('Vehicle')) {
      if (
        !node.name ||
        node.url !== url ||
        node.brand?.['@type'] !== 'Brand' ||
        node.mileageFromOdometer?.['@type'] !== 'QuantitativeValue' ||
        node.mileageFromOdometer?.unitCode !== 'KMT' ||
        'vehicleModelDate' in node
      ) {
        throw new Error(`Datos estructurados del vehículo incoherentes en ${url}.`);
      }
    } else {
      throw new Error(`Tipo Schema.org no previsto en ${url}: ${types.join(', ')}`);
    }
  }
}

for (const path of [sitemapPath, robotsPath, join(outputPath, '404.html')]) {
  if (!existsSync(path)) {
    throw new Error(`Archivo obligatorio ausente: ${path}`);
  }
}

const sitemapDocument = new JSDOM(readFileSync(sitemapPath, 'utf8'), {
  contentType: 'text/xml',
}).window.document;
if (sitemapDocument.querySelector('parsererror')) {
  throw new Error('El sitemap no es XML válido.');
}

const urls = [...sitemapDocument.querySelectorAll('loc')].map(
  (node) => node.textContent?.trim() ?? '',
);
if (urls.length === 0 || urls.length !== new Set(urls).size) {
  throw new Error('El sitemap está vacío o contiene URLs duplicadas.');
}

const titles = new Set();
const descriptions = new Set();
for (const url of urls) {
  const parsedUrl = new URL(url);
  if (parsedUrl.origin !== siteUrl || parsedUrl.search || parsedUrl.hash) {
    throw new Error(`URL no canónica en sitemap: ${url}`);
  }

  const routeFile =
    parsedUrl.pathname === '/' ? 'index.html' : join(parsedUrl.pathname.slice(1), 'index.html');
  const filePath = join(outputPath, routeFile);
  if (!existsSync(filePath)) {
    throw new Error(`Ruta del sitemap no prerenderizada: ${url}`);
  }

  const document = new JSDOM(readFileSync(filePath, 'utf8')).window.document;
  const requiredSelectors = [
    'title',
    'meta[name="description"]',
    'meta[name="robots"]',
    'link[rel="canonical"]',
    'meta[property="og:title"]',
    'meta[property="og:description"]',
    'meta[property="og:url"]',
    'meta[property="og:type"]',
    'meta[property="og:site_name"]',
    '#structured-data',
    'h1',
  ];
  for (const selector of requiredSelectors) {
    if (document.querySelectorAll(selector).length !== 1) {
      throw new Error(`${url} debe contener exactamente un elemento ${selector}.`);
    }
  }

  const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href');
  const openGraphUrl = document.querySelector('meta[property="og:url"]')?.getAttribute('content');
  if (canonical !== url || openGraphUrl !== url) {
    throw new Error(`Canonical u og:url incoherente en ${url}.`);
  }

  const title = document.title;
  const description =
    document.querySelector('meta[name="description"]')?.getAttribute('content') ?? '';
  const pageRobots = document.querySelector('meta[name="robots"]')?.getAttribute('content');
  const openGraphTitle = document
    .querySelector('meta[property="og:title"]')
    ?.getAttribute('content');
  const openGraphDescription = document
    .querySelector('meta[property="og:description"]')
    ?.getAttribute('content');
  if (
    pageRobots !== 'index, follow' ||
    openGraphTitle !== title ||
    openGraphDescription !== description
  ) {
    throw new Error(`Robots u Open Graph incoherentes en ${url}.`);
  }
  titles.add(title);
  descriptions.add(description);
  validateStructuredData(
    JSON.parse(document.getElementById('structured-data')?.textContent ?? ''),
    url,
  );

  if (document.querySelector('img:not([alt])')) {
    throw new Error(`Imagen sin alt en ${url}.`);
  }

  for (const image of document.querySelectorAll('img[src^="/"]')) {
    const src = image.getAttribute('src');
    if (!src || !existsSync(join(outputPath, src.slice(1)))) {
      throw new Error(`Imagen local ausente en ${url}: ${src}`);
    }
  }

  for (const link of document.querySelectorAll('a[href^="/"]')) {
    const href = link.getAttribute('href');
    if (!href) {
      continue;
    }
    const target = href === '/' ? 'index.html' : join(href.slice(1), 'index.html');
    if (!existsSync(join(outputPath, target))) {
      throw new Error(`Enlace interno roto en ${url}: ${href}`);
    }
  }
}

if (titles.size !== urls.length || descriptions.size !== urls.length) {
  throw new Error('Las rutas indexables deben tener title y description propios.');
}

const robots = readFileSync(robotsPath, 'utf8');
if (
  !robots.includes('Allow: /') ||
  !robots.includes(`Sitemap: ${siteUrl}/sitemap.xml`) ||
  /Disallow:\s*\//.test(robots)
) {
  throw new Error('robots.txt contiene una configuración de rastreo incorrecta.');
}

const notFoundDocument = new JSDOM(readFileSync(join(outputPath, '404.html'), 'utf8')).window
  .document;
if (
  notFoundDocument.querySelector('meta[name="robots"]')?.getAttribute('content') !==
    'noindex, follow' ||
  notFoundDocument.querySelectorAll('h1').length !== 1
) {
  throw new Error('404.html debe contener un H1 y noindex, follow.');
}

const params = new URLSearchParams({
  fields: 'slug',
  filter: JSON.stringify({ status: { _in: ['available', 'reserved'] } }),
  limit: '-1',
});
const response = await fetch(
  `https://directus-production-5522.up.railway.app/items/cars?${params}`,
);
if (!response.ok) {
  throw new Error(`No se pudo contrastar el sitemap con Directus: ${response.status}`);
}
const { data } = await response.json();
const expectedUrls = [
  ...staticPaths.map((path) => `${siteUrl}${path}`),
  ...data.map(({ slug }) => `${siteUrl}/coches/${encodeURIComponent(slug)}/`),
].sort();
if (JSON.stringify([...urls].sort()) !== JSON.stringify([...new Set(expectedUrls)])) {
  throw new Error(
    'El sitemap no coincide con las rutas estáticas y el inventario público de Directus.',
  );
}

console.log(`SEO verificado en ${urls.length} rutas prerenderizadas.`);
