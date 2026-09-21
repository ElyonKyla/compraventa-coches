import { writeFile } from 'node:fs/promises';

const siteUrl = 'https://tallercarslistanco.es';
const directusUrl = 'https://directus-production-5522.up.railway.app/items/cars';
const staticPaths = ['/', '/taller', '/stock', '/importacion-coches-alemania', '/contacto'];
const params = new URLSearchParams({
  fields: 'slug',
  filter: JSON.stringify({ status: { _in: ['available', 'reserved'] } }),
  limit: '-1',
});

const response = await fetch(`${directusUrl}?${params}`);
if (!response.ok) {
  throw new Error(`No se pudo generar el sitemap desde Directus: ${response.status}`);
}

const { data } = await response.json();
const vehiclePaths = data
  .map(({ slug }) => slug)
  .filter((slug) => typeof slug === 'string' && slug.length > 0)
  .map((slug) => `/coches/${encodeURIComponent(slug)}`);
const urls = [...new Set([...staticPaths, ...vehiclePaths])];
const entries = urls.map((path) => `  <url><loc>${siteUrl}${path}</loc></url>`).join('\n');
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`;

await writeFile(new URL('../public/sitemap.xml', import.meta.url), sitemap, 'utf8');
