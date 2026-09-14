import { InjectionToken } from '@angular/core';

import { environment } from '../../environments/environment';

export interface DirectusConfig {
  baseUrl: string;
  useMocksOnError: boolean;
}

export const DIRECTUS_CONFIG = new InjectionToken<DirectusConfig>('DIRECTUS_CONFIG', {
  providedIn: 'root',
  factory: () => environment.directus,
});
