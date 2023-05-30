# Gone.Bike

OpenSource, OpenData stolen bikes database, search engine and reporting tool.
Data is publicly accessible at [gone.bike/exports/](https://gone.bike/exports/), dumped on a daily basis (WIP).

## Dev requirements

Different areas require different tools.

### Website
The website part is built with [Astro](https://astro.build), to run into dev mode requires having `npm` installed and being connected to the dev VPN or having a copy of the database up and ruinning locally.
The only connection requirements for the website to run are `redis` and `directus`.

### Database
The database part is built with `postgresql` as relational SQL main db, [Directus](https://directus.io) as CMS.
In development mode a common database is used to avoid hassle of data transfering/synching and allow faster development.
To connect to such database you need access to the dev VPN
Alternatively, you can create a copy of the database locally (Slower)

### Search (TODO)
The search part with `elasticsearch` and `weaviate` to support image search and faceting.


## Database setup
1. Spin up a `postgresql` and `redis` instance. Easily done with `docker-compose up -d postgresql redis`
2. Create a `.directus.env` file
3. Install `directus` with `docker-compose up -d directus`
4. Load the scheam with `cat database/schema.sql | docker-compose exec -T postgresql psql -U postgres`

## Website dev setup (simple, frontend pages only)

1. Clone this repository
2. Run `cd astro && npm i`
3. Run `npm run dev`


## Website setup (db access, for SSR pages)
1. Ensure you have a *redis* connection, and access to a directus instance containing the related db
2. Create a `astro/.env` as follow
```
WEAVIATE_URI=http://localhost:8080
CELERY_REDIS_URI=redis://localhost:6379/0
REDIS_URI=redis://localhost:6379/0
DIRECTUS_URI=http://directus-url
DIRECTUS_TOKEN="<your token>"
```

