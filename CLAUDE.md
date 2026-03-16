# CLAUDE.md

## Project

Instacart-like shopping platform. pnpm monorepo with a Node.js backend and a mobile app (in progress).

## Structure

```
shopper/
├── backend/   # Node + tRPC + Drizzle + PostgreSQL
└── mobile/    # Placeholder
```

## Backend stack

- **Runtime:** Node.js + TypeScript (`tsx` for dev, `moduleResolution: Bundler`)
- **API:** tRPC v11 via Express adapter, served at `/trpc`
- **ORM:** Drizzle with `postgres` (postgres.js) driver
- **Database:** PostgreSQL 16 (Docker)
- **Tests:** Vitest

## Commands

```sh
# from repo root
docker compose up -d          # start postgres
pnpm install                  # install all workspace deps

# from backend/
pnpm dev                      # start server with hot reload (port 3000)
pnpm test                     # run tests
pnpm db:push                  # apply schema to database
pnpm db:studio                # open Drizzle Studio
```

## Architecture conventions

### Three layers in `backend/src/`

1. **`db/schema/`** — Drizzle table definitions only, no logic
2. **Domain actions** (e.g. `order/createOrder.ts`) — one file per action, Drizzle queries written directly in the function, no separate db abstraction layer
3. **`trpc/`** — tRPC routers call domain actions; each domain gets its own router file (e.g. `orders.ts`), assembled in `router.ts`

### Domain structure (e.g. `src/order/`)

- One file per action: `createOrder.ts`, `addItemToOrder.ts`, etc.
- `errors.ts` for typed domain errors (e.g. `OrderError`)
- `index.ts` re-exports everything — this is what tRPC and tests import from

### tRPC error handling

- `OrderError` (and equivalent domain errors) → `BAD_REQUEST`
- Everything else → `INTERNAL_SERVER_ERROR`

### Tests

- Test files live alongside the router: `src/trpc/orders.test.ts`
- Use `appRouter.createCaller({})` — no HTTP
- Mock domain action modules with `vi.mock` + `importActual` to preserve error classes

## Database

Postgres credentials (local Docker): `shopper:shopper@localhost:5432/shopper`

Tables: `users`, `inventory`, `orders`, `line_items`

Schema files: `backend/src/db/schema/`
