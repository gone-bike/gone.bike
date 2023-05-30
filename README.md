# Gone.Bike
OpenSource, OpenData stolen bikes database, search engine and reporting tool.

Data is publicly accessible at [gone.bike/exports/](https://gone.bike/exports/)

## Tech Stack
- [Astro](https://astro.build) / [VueJS](https://vuejs.org/) (Frontend)
- [Celery](https://docs.celeryq.dev/) (Backend)
- [Directus](https://directus.io) (Middleware / API)
- [Docker](https://www.docker.com/) (DevOp)
- [PostgreSQL](https://www.postgresql.org) (Backend)
- [Redis](https://redis.io) (Backend)
- [Weaviate](https://weaviate.io) (Backend)


## Dev requirements
You need to have `npm` and `docker-compose` commands available.

## Development Setup
This guide provides all necessary steps to have a fully functional local setup.

Clone this repository and access the repository root directory:

```
git clone git@github.com:gone-bike/gone.bike.git && \
cd gone.bike
```

---

### Frontend setup
Create development env file in `astro/` directory and install dependencies:

```
cd astro && \
cp .env.example .env && \
npm i
```

For pages that do not require db connection, this is enough to have the dev environment up and running, otherwise you need to have the backend setup.

Generate multilanguage pages:
```npx astro-i18next generate```

Start the local server with:
```npm run dev```

---

### Database setup

In repository root directory, use template env files:

```
touch .env && \
cp .worker.env.example .worker.env && \
cp .directus.env.example .directus.env && \
cp .astro.env.example .astro.env
```

Create local data and config folders:
```
mkdir -p .config .data/{directus,postgresql} && \
chmod 0777 .data/directus
```

Create local config folder and files:
```
touch .config/redis.conf
```

Startup `postgresql`, `redis` and `directus` services:

```
docker-compose up -d postgresql redis directus
```

Ensure server is running with:
```
docker-compose logs --tail 10 directus
```

that should show something smilar to this:
```
gone.bike.directus  | [12:35:20.420] INFO: Adding first admin user...
gone.bike.directus  | [12:35:20.483] INFO: Done
gone.bike.directus  | [12:35:23.050] INFO: Server started at http://0.0.0.0:8055
```



Copy database schema inside directus container: and apply it:

```
docker-compose cp database/directus-schema.yml directus:/directus/ && \
docker-compose exec directus npx directus schema apply -y directus-schema.yml
```

Verify successful schema install by accessing directus at [http://localhost:8055](http://localhost:8055)

**NOTE**: It might be a directus bug, but in order to fully apply the schema and see it in the CMS, you need to perform a "Make collection invisible / Make collection visible" operation on any of the available collections. Operation can be applied twice in order to keep the state. After that, access the [/admin/settings/data-model/bike_brand](http://localhost:8055/admin/settings/data-model/bike_brand) address to enforce Directus metadata reload.

You should now be able to see a empty but schemed database.



---

### Database import

SQL database

```
wget https://gone.bike/exports/gone.bike.db-dump.latest.sql.gz && \
gunzip -c gone.bike.db-dump.latest.sql.gz | docker-compose exec -T postgresql psql -U postgres
```

Images

```
wget https://gone.bike/exports/gone.bike.images.latest.tgz  && \
tar zxvf gone.bike.images.latest.tgz --directory .data/directus/
```