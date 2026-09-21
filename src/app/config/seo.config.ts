export const SITE_URL = 'https://tallercarslistanco.es';
export const SITE_NAME = 'Taller & Cars Listanco';
export const DEFAULT_SOCIAL_IMAGE = `${SITE_URL}/images/logo-listanco-alt-source.png`;

export interface SeoData {
  title: string;
  description: string;
  path: string;
  robots?: string;
  type?: string;
  image?: string;
  imageAlt?: string;
  structuredData?: Record<string, unknown> | Record<string, unknown>[];
}

export const BUSINESS_STRUCTURED_DATA: Record<string, unknown> = {
  '@id': `${SITE_URL}/#business`,
  '@type': ['AutoRepair', 'AutoDealer'],
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  logo: DEFAULT_SOCIAL_IMAGE,
  image: DEFAULT_SOCIAL_IMAGE,
  telephone: ['+34695577147', '+34607923867'],
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Carretera General, 2',
    postalCode: '32574',
    addressLocality: 'Listanco',
    addressRegion: 'Ourense',
    addressCountry: 'ES',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Saturday',
      opens: '09:00',
      closes: '13:00',
    },
  ],
  hasMap:
    'https://www.google.com/maps/place/Taller+%26+Cars+Listanco/@42.3998063,-8.0102057,17z/data=!3m1!4b1!4m6!3m5!1s0xd2ff1df0ef5753f:0x4455193232c00226!8m2!3d42.3998063!4d-8.0102057!16s%2Fg%2F11yzr4zlyp',
};

export const IMPORT_SERVICE_STRUCTURED_DATA: Record<string, unknown> = {
  '@type': 'Service',
  '@id': `${SITE_URL}/importacion-coches-alemania#service`,
  name: 'Importación de coches desde Alemania',
  url: `${SITE_URL}/importacion-coches-alemania`,
  provider: {
    '@id': `${SITE_URL}/#business`,
  },
};
