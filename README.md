# Shopper

An Instacart-like shopping platform. Monorepo containing a Node.js backend and a mobile app (in progress).

## Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/) — `npm install -g pnpm`
- [Docker](https://www.docker.com/) (for the local database)

## Getting started

**1. Install dependencies**

```sh
pnpm install
```

**2. Start the database**

```sh
docker compose up -d
```

**3. Configure environment**

```sh
cp backend/.env.example backend/.env
```

The default values match the Docker setup — no edits needed for local development.

**4. Push the schema**

```sh
pnpm --filter backend db:push
```

**5. Start the dev server**

```sh
pnpm --filter backend dev
```

The API is now running at `http://localhost:3000`.

- `GET /health` — health check
- `POST /trpc/*` — tRPC endpoints

## Project structure

```
shopper/
├── backend/          # Node.js API (tRPC + Drizzle + PostgreSQL)
│   ├── src/
│   │   ├── db/
│   │   │   └── schema/   # Drizzle table definitions
│   │   ├── trpc/         # tRPC router and procedures
│   │   └── index.ts      # Express server entrypoint
│   └── drizzle.config.ts
└── mobile/           # Mobile app (coming soon)
```

## Database schema

| Table        | Description                              |
|--------------|------------------------------------------|
| `users`      | Customers and ops staff                  |
| `inventory`  | Products available for purchase          |
| `orders`     | A user's placed order                    |
| `line_items` | Individual items within an order         |

## Backend scripts

Run these from the `backend/` directory or prefix with `pnpm --filter backend`.

| Script          | Description                                      |
|-----------------|--------------------------------------------------|
| `dev`           | Start server with hot reload                     |
| `start`         | Start server (no hot reload)                     |
| `db:push`       | Apply schema changes directly to the database    |
| `db:generate`   | Generate SQL migration files                     |
| `db:studio`     | Open Drizzle Studio to browse the database       |

## Stopping the database

```sh
docker compose down
```

Data is persisted in a Docker volume and will survive restarts.
