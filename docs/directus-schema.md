# Futuro Esquema Directus

Directus se conectará más adelante. De momento la web Angular sigue usando `src/app/data/mock-cars.ts` a través de `CarsService`.

El objetivo de esta fase es definir y probar el panel privado en local sin conectar todavía el frontend publicado en Netlify.

## Colección `cars`

Campos necesarios para replicar el modelo público actual:

| Campo | Tipo Directus sugerido | Notas |
| --- | --- | --- |
| `id` | UUID o String | Primary key. Identificador interno. |
| `slug` | String | Obligatorio y único. Usado en la ruta pública `/coches/:slug`. |
| `title` | String | Obligatorio. Nombre comercial visible. |
| `brand` | String | Obligatorio. Marca. |
| `model` | String | Obligatorio. Modelo. |
| `version` | String | Opcional. Acabado o motorización comercial. |
| `year` | Integer | Obligatorio. Año de matriculación o modelo. |
| `mileage` | Integer | Obligatorio. Kilómetros. |
| `price` | Integer o Decimal | Obligatorio. Precio en euros sin formato. |
| `fuel` | Select o String | Obligatorio. Combustible. |
| `transmission` | Select o String | Obligatorio. Cambio. |
| `power` | String | Opcional. Ejemplo: `190 CV`. |
| `engine` | String | Opcional. Ejemplo: `2.0 TDI`. |
| `description` | Text | Obligatorio. Texto descriptivo público. |
| `equipment` | JSON array o campo lista/repetible | Opcional. Lista de equipamiento. |
| `status` | Select | Valores: `available`, `reserved`, `hidden`. |
| `featured` | Boolean | Define si aparece en destacados de inicio. |
| `images` | Relación con Directus Files | Múltiples imágenes ordenables. |

## Reglas Iniciales De Publicación

La web pública debe mostrar solo coches con `status` igual a `available` o `reserved`.

Los coches con `status` igual a `hidden` no deben aparecer en listados ni ficha pública.

`featured` se usará para decidir los coches destacados en inicio.

Las imágenes se mapearán más adelante desde Directus Files a URLs públicas.

Por ahora Angular sigue usando `mock-cars.ts`; no hay integración con Directus en la V1.

## Campos Útiles Más Adelante

`sort`, `date_created`, `date_updated` y `published_at` pueden ayudar a ordenar el stock y controlar publicación sin cambiar el contrato público.
