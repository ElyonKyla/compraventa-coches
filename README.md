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

The production frontend reads the public car inventory from Directus on Railway. Local development uses
Directus at `http://localhost:8055` and keeps mock cars as a development-only fallback.

## Local Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
ng serve
```

To run the development server against Directus on Railway instead:

```bash
npm run start:railway
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

- Add the final logo once it is ready.
