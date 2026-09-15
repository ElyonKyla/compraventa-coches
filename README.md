# Taller & Cars Listanco

Public vehicle stock website for **Taller & Cars Listanco**, built with Angular and backed by Directus.

## Active Services

- Website: <https://tallercarslistanco.netlify.app>
- Public API: <https://directus-production-5522.up.railway.app>
- Directus admin panel: <https://directus-production-5522.up.railway.app/admin>

The published site is a static Angular SPA hosted by Netlify. It reads public inventory directly from
Directus on Railway, so the website does not depend on a developer computer or a local Docker instance
being online.

## Architecture

- **Frontend:** Angular 22 with custom SCSS and client-side routing.
- **Hosting:** Netlify, deployed automatically from `origin/main`.
- **CMS/API:** Directus 12.3.1 on Railway.
- **Online data services:** PostgreSQL/PostGIS, Redis, and S3 object storage.
- **Access model:** anonymous read-only requests from Angular; no API token is bundled in the frontend.

The Directus Open Innovation Grant is active for this project. This does not imply that Railway hosting
is free or has a fixed cost.

## Application Routes

- `/`
- `/stock`
- `/coches/:slug`
- `/contacto`

Netlify serves `index.html` for all routes through the redirect in `netlify.toml`, allowing direct visits
and browser reloads on Angular routes.

## Requirements

- Node.js in a version supported by Angular 22.
- npm. The repository currently declares npm 11.17.0 as its package manager.
- Docker is optional and only needed for the separate local Directus setup.

Install dependencies:

```bash
npm install
```

## Development Modes

### Local Directus

```bash
npm start
```

This runs Angular's development server, normally at <http://localhost:4200>, using
`http://localhost:8055` as the Directus origin. Local development keeps the mock inventory as a fallback
when the local API is unavailable.

### Railway Directus

```bash
npm run start:railway
```

This runs the development server against the public Railway API. It uses anonymous requests and does not
fall back to mock vehicles if the API fails or returns an empty catalog.

Angular normally selects port 4200. A different port can be supplied when needed, for example:

```bash
npm run start:railway -- --port 4300
```

Ports 4200 on `localhost` and `127.0.0.1`, plus `127.0.0.1:4300`, are currently included in the Railway
CORS allowlist.

### Production

The default Angular build configuration replaces `environment.ts` with
`environment.production.ts`. Production uses Railway and disables the mock fallback.

The related files are:

- `src/environments/environment.ts`
- `src/environments/environment.railway.ts`
- `src/environments/environment.production.ts`
- `src/app/config/directus.config.ts`

## Tests and Build

Run the test suite once:

```bash
npm test -- --watch=false
```

Create the production build:

```bash
npm run build
```

The production output is:

```text
dist/compraventa-coches/browser
```

`netlify.toml` uses `npm run build`, publishes that directory, and configures the SPA fallback.

The latest reported integration verification on September 15, 2026 covered five passing tests, a
successful production build, and normal-browser checks on desktop and mobile. It included the stock page,
direct detail navigation and reload, nine ordered photos, thumbnails, circular gallery navigation, and
the absence of console, network, and CORS errors. These checks were not rerun solely for this README edit.

## Directus Data Model

The real `cars` fields used by the frontend are:

- `id`
- `status`
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
- `Equipamiento`

`cars.imagenes` is an inverse relation through the `cars_files` junction collection. Junction records
contain `id`, `cars_id`, `directus_files_id`, and `sort`. Angular requests the relation with an explicit
sort by `cars_files.sort`, applies a stable client-side sort as a safeguard, and uses the first image as
the card cover and gallery primary image.

Status values are:

- `available`: shown publicly.
- `reserved`: shown publicly with its reserved state.
- `hidden`: excluded from public reads.

Directus public permissions restrict reads to `available` and `reserved` cars, their junction records,
and their associated files. Public create, update, and delete access is not enabled.

## Current Migration State

The Volkswagen Golf currently published in the online inventory was migrated with nine original JPEG
files in S3. Their sizes and SHA-256 hashes were verified against the migration source, and positions 1
through 9 are stored in `cars_files.sort`.

The earlier Audi test record remains local and was not imported. The current single-car online inventory
is migration state, not a catalog limit; additional records can be managed through Directus.

## CORS

Railway currently allows these frontend origins:

- `https://tallercarslistanco.netlify.app`
- `http://localhost:4200`
- `http://127.0.0.1:4200`
- `http://127.0.0.1:4300`

When a custom domain starts serving the application, add its exact production origin to the Directus
CORS allowlist and verify browser requests before removing any origin still in use.

## Local Directus Notes

The `directus/docker-compose.yml` file provides a separate Directus 11 and SQLite development setup. It
is not a replica of the Directus 12.3.1 Railway architecture and must not be used as an online deployment
description.

On the current developer machine, the existing local installation is located at
`C:\Users\elyon\directus-listanco`, available in WSL as `/mnt/c/Users/elyon/directus-listanco`. Docker for
that installation has been operated from Windows PowerShell. Running Docker Compose from inside WSL has
not been established and should not be assumed to work.

The repository's `directus/README.md` and `docs/directus-schema.md` describe an earlier local-only phase
and contain obsolete statements about the Angular integration and proposed field names. Use the data
model in this README and the current application code as the integration reference until those historical
documents are updated.

## Backups and Recovery

Directus schema snapshots describe schema structure; they do not include cars, uploaded photos, or public
permission records. Content recovery also requires an appropriate database backup or export and the
original files.

Do not commit database backups, exports, uploads, `.env` files, access tokens, license keys, or other
secrets. Local Directus data and secret paths are excluded by `.gitignore`.

## Deployment

Netlify deploys `main` automatically using the repository configuration. A successful push is not enough
to confirm publication: check that the Netlify deploy is ready and then verify the public site, direct SPA
routes, Railway API requests, CORS, and image loading in a normal browser.

## Planned Domains

The intended domains are not registered or active yet:

- `tallercarslistanco.es`: intended primary domain.
- `autoslistanco.es`: intended historical-name domain, planned to redirect to the primary domain.

Availability was observed at OVHcloud, but there is no confirmation of purchase, registration, DNS,
HTTPS, or redirect configuration. Required follow-up work includes purchasing the domains, connecting the
primary domain to Netlify, configuring DNS and HTTPS, redirecting the secondary domain and `www` variants,
adding the final production origin to the Directus CORS allowlist, and repeating public browser tests.
