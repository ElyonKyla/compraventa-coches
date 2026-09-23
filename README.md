# Taller & Cars Listanco

Official website for **Taller & Cars Listanco**, an automotive repair workshop and vehicle dealership based in Listanco, Maside (Ourense), Spain.

**Live website:** <https://tallercarslistanco.es>

## About the project

The website brings together the workshop presentation, its services, the vehicle catalogue, and the business contact details in one place.

It is designed to provide simple navigation on mobile and desktop devices, make direct contact easy, and improve the local online presence of Taller & Cars Listanco.

## Website features

- Business presentation and featured services.
- Information about the workshop and its activity.
- Catalogue of available and reserved vehicles.
- Individual vehicle pages with photographs and specifications.
- Information about vehicle imports from Germany.
- Contact details and Google Maps location.
- Responsive design for mobile, tablet, and desktop devices.
- Private inventory management panel.

## Main sections

- **Home:** business presentation, featured services, and access to the vehicle catalogue.
- **Workshop:** information about the workshop, its activity, and its experience.
- **Vehicles:** public catalogue connected to the inventory system.
- **Imports:** information about sourcing and importing vehicles from Germany.
- **Contact:** contact details, opening hours, and location.

## Inventory management

Vehicles are managed through a private administration panel. The public website only displays vehicles marked as available or reserved.

Each vehicle page may include:

- make, model, and version;
- year and mileage;
- price;
- fuel type, transmission, power, and engine;
- description and equipment;
- vehicle status;
- ordered image gallery.

Administration accounts and service credentials are not included in the public website or stored in the repository.

## Publishing

The website is hosted on **Netlify**. The inventory is managed with **Directus**, hosted on **Railway**.

Changes pushed to the repository's main branch generate a new production version. Adding or removing a vehicle, or changing its URL slug, also requires a new deployment so that its generated page and the sitemap remain up to date.

The canonical production domain is:

<https://tallercarslistanco.es>

## SEO and local presence

The website includes:

- search-friendly page titles and descriptions;
- canonical URLs under the primary domain;
- structured data for the workshop and vehicle dealership;
- business details consistent with the Google Business Profile;
- social sharing metadata;
- a link to the Taller & Cars Listanco listing on Google Maps.

Search visibility depends on Google's crawling and indexing process. Its progress can be monitored through Google Search Console and the Google Business Profile.

## Current status

The website is live and available through its production domain. Its contact information, opening hours, location, and structured business data are up to date.

The catalogue depends on the content published in the inventory panel. If there are no public vehicles or the inventory service is unavailable, the website displays an empty catalogue.
