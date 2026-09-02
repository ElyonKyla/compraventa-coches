# Directus Local

Configuración local para probar Directus como panel privado de coches. No conecta todavía con Angular; la web sigue usando `src/app/data/mock-cars.ts`.

## Preparación

Crea tu archivo local de variables desde el ejemplo:

```bash
cp directus/.env.example directus/.env
```

Edita `directus/.env` si quieres cambiar el usuario admin local o las claves de desarrollo. No uses contraseñas reales dentro del repo.

## Arrancar Directus

```bash
docker compose -f directus/docker-compose.yml up
```

Panel local:

`http://localhost:8055`

El primer usuario admin se puede crear desde el onboarding de Directus o con las variables `ADMIN_EMAIL` y `ADMIN_PASSWORD` del archivo `.env`.

## Datos Locales

Directus usa SQLite para esta fase inicial. Los datos, uploads y extensiones se guardan en carpetas locales ignoradas por Git:

`directus/database`, `directus/uploads`, `directus/extensions`.
