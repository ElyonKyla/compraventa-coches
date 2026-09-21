import { PrerenderFallback, RenderMode, ServerRoute } from '@angular/ssr';

import { environment } from '../environments/environment';

interface SlugResponse {
  data: Array<{ slug: string }>;
}

export const serverRoutes: ServerRoute[] = [
  {
    path: 'coches/:slug',
    renderMode: RenderMode.Prerender,
    fallback: PrerenderFallback.None,
    async getPrerenderParams() {
      const params = new URLSearchParams({
        fields: 'slug',
        filter: JSON.stringify({ status: { _in: ['available', 'reserved'] } }),
        limit: '-1',
      });
      const response = await fetch(`${environment.directus.baseUrl}/items/cars?${params}`);
      if (!response.ok) {
        throw new Error(`No se pudieron obtener las rutas de vehículos: ${response.status}`);
      }

      const { data } = (await response.json()) as SlugResponse;
      return data.map(({ slug }) => ({ slug }));
    },
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
