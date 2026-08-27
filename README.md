# Gold App

Gold market dashboard built as one repository: Next.js web application, Fastify API, Prisma/MySQL, and a BullMQ ingestion worker.

## Local development

Install dependencies in both the repository root and `backend/`, then copy `backend/.env.example` to `backend/.env` and provide a MySQL URL, Redis URL, origin, and a session secret of at least 32 characters.

Run `npm run dev` for the web application and `npm run dev` from `backend/` for the API. Run `npm run worker` from `backend/` to process market ingestion.

## Docker

Copy `.env.docker.example` to `.env`, replace every placeholder, then run `docker compose up --build`. The standalone Compose stack is available at `http://localhost:8080`; Mailpit is optional with `--profile mail`.

## Database and feeds

Schema changes are committed under `backend/prisma/migrations` and startup uses `prisma migrate deploy`. Crypto ingestion is enabled by default. Set `GOLD_BULLION_URL` and `SILVER_BULLION_URL` only when valid compatible sources are available.

## Deployer

Choose **Node.js + React + MySQL**, select the existing `gold-app` repository, and let Deployer clone it to `/var/www/gold`. Deployer detects this monorepo and runs API, web, and worker containers against shared MySQL and Redis at `http://gold.test`.
