# Taller & Cars Listanco

Car stock website for **Taller & Cars Listanco**.

The project is built with Angular and deployed on Netlify.

## Live Site

https://tallercarslistanco.netlify.app

## Tech Stack

- Angular
- Custom SCSS/CSS
- Directus as CMS/admin panel
- Netlify for deployment

## Current Status

The first frontend version is working with these routes:

- `/`
- `/stock`
- `/coches/:slug`
- `/contacto`

The frontend currently uses mock data from `src/app/data/mock-cars.ts`.

Directus has been prepared locally, but it is not connected to the Angular car service yet.

## Local Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
ng serve
```

Open the app in the browser:

```text
http://localhost:4200
```

## Build

Create a production build:

```bash
ng build
```

The site is deployed on Netlify as a static SPA.

Netlify publish directory:

```text
dist/compraventa-coches/browser
```

## Local Directus

Directus is used as the admin panel for managing cars.

Local URL:

```text
http://localhost:8055
```

Main collection:

```text
cars
```

Main collection fields:

- `slug`
- `Titulo`
- `Marca`
- `Modelo`
- `Version`
- `Anio`
- `Kilometraje`
- `Precio`
- `Combustible`
- `Cambio`
- `Potencia`
- `Motor`
- `Descripcion`
- `destacado`
- `imagenes`
- `status`

Status values:

- `available`: available
- `reserved`: reserved
- `hidden`: hidden

The frontend should only display cars with `available` or `reserved` status.

## Pending Work

- Connect `CarsService` to Directus.
- Map Directus fields to the current frontend car model.
- Load images from Directus Files.
- Replace mock data or keep it as a fallback.
- Add the final logo once it is ready.