# Gone.Bike
OpenSource, OpenData stolen bikes database, search engine and reporting tool.

Data is publicly accessible at [gone.bike/exports/](https://gone.bike/exports/)

## Tech Stack
- [Astro](https://astro.build) / [VueJS](https://vuejs.org/) (Frontend)
- [Celery](https://docs.celeryq.dev/en/stable/0) (Backend)
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

Start the local server with:
```npm run dev```

---

### Backend / Database setup
Use template env files:

```
cp .env.example .env && \
cp .worker.env.example .worker.env && \
cp .directus.env.example .directus.env && \
cp .astro.env.example .astro.env
```

Startup `postgresql`, `redis` and `directus` services:

```docker-compose up -d postgresql redis directus```

@TODO - continue setup
