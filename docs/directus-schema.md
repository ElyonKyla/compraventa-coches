# Futuro esquema Directus

Directus se conectara mas adelante. De momento la web usa `src/app/data/mock-cars.ts` a traves de `CarsService`.

## Coleccion `cars`

Campos necesarios para replicar el modelo publico actual:

| Campo | Tipo Directus sugerido | Notas |
| --- | --- | --- |
| `id` | UUID | Identificador interno. |
| `slug` | String | Unico. Usado en la ruta publica `/coches/:slug`. |
| `title` | String | Nombre comercial visible. |
| `brand` | String | Marca. |
| `model` | String | Modelo. |
| `version` | String | Opcional. Acabado o motorizacion comercial. |
| `year` | Integer | Año de matriculacion o modelo. |
| `mileage` | Integer | Kilometros. |
| `price` | Integer | Precio en euros sin formato. |
| `fuel` | String | Combustible. |
| `transmission` | String | Cambio. |
| `power` | String | Opcional. Ejemplo: `190 CV`. |
| `engine` | String | Opcional. Ejemplo: `2.0 TDI`. |
| `description` | Text | Texto descriptivo publico. |
| `equipment` | JSON o relacion M2M | Lista de equipamiento. |
| `status` | Dropdown | Valores: `available`, `reserved`, `hidden`. |
| `featured` | Boolean | Define si aparece en Inicio. |
| `images` | Files M2M | Galeria ordenable de imagenes. |

## Reglas iniciales de publicacion

La web publica debe mostrar solo coches con `status` igual a `available` o `reserved`.

Los coches con `status` igual a `hidden` no deben aparecer en listados ni ficha publica.

## Campos utiles mas adelante

`sort`, `date_created`, `date_updated` y `published_at` pueden ayudar a ordenar el stock y controlar publicacion sin cambiar el contrato publico.
