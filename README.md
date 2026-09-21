# Taller & Cars Listanco

Public website for **Taller & Cars Listanco**, built with Angular and backed by Directus for vehicle inventory.

## Active Services

- Website: <https://tallercarslistanco.es>
- Public API: <https://directus-production-5522.up.railway.app>
- Directus admin panel: <https://directus-production-5522.up.railway.app/admin>

The published site is a prerendered static Angular application hosted by Netlify and hydrated in the
browser. It reads public inventory from Directus on Railway, so the website does not depend on a developer
computer or a local Docker instance being online.

## Architecture

- **Frontend:** Angular 22 with custom SCSS, static prerendering, hydration, and client-side navigation.
- **Hosting:** Netlify, deployed automatically from `origin/main`.
- **CMS/API:** Directus 12.3.1 on Railway.
- **Online data services:** PostgreSQL/PostGIS, Redis, and S3 object storage.
- **Access model:** anonymous read-only requests from Angular; no API token is bundled in the frontend.

The Directus Open Innovation Grant is active for this project. This does not imply that Railway hosting
is free or has a fixed cost.

## Application Routes

- `/`
- `/taller`
- `/stock`
- `/coches/:slug`
- `/importacion-coches-alemania`
- `/contacto`

Stable routes and public vehicle details are prerendered as HTML. Netlify serves existing generated files
directly and returns `404.html` for paths that were not generated. Direct vehicle URLs therefore require a
new build after inventory or slug changes.

## Requirements

- Node.js in a version supported by Angular 22.
- npm. The repository currently declares npm 11.17.0 as its package manager.
- Docker is optional and only needed for the separate local Directus setup.

Install dependencies:

```bash
npm ci
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

`netlify.toml` uses `npm run build` and publishes that directory. The build generates the sitemap,
prerenders public routes, and runs the SEO output verifier before it can succeed.

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

- `https://tallercarslistanco.es`
- `https://tallercarslistanco.netlify.app`
- `http://localhost:4200`
- `http://127.0.0.1:4200`
- `http://127.0.0.1:4300`

Keep the exact production origin in the Directus CORS allowlist and verify browser requests before removing
any origin still in use.

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
to confirm publication: check that the Netlify deploy is ready and then verify the public site, direct
routes, Railway API requests, CORS, and image loading in a normal browser.

The production build generates `sitemap.xml` from the current public Directus slugs and prerenders the
five stable routes plus each public vehicle detail. A Directus publication, removal, or slug change therefore
requires a new Netlify build to keep generated HTML and the sitemap current. Until that build completes,
new slugs are not available as direct URLs and removed slugs may retain their previous generated file.

`robots.txt`, `sitemap.xml`, static assets, and prerendered routes are served directly. Missing paths use the
static `404.html` response.

## Production Domains

The canonical production origin is:

- <https://tallercarslistanco.es>

`netlify.toml` redirects HTTP and `www` variants of the primary domain to that HTTPS origin. It also retains
the existing redirects from the configured `autolistanco.es` variants.
