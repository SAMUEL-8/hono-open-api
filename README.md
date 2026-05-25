# Hono Open API Starter

A starter template for building fully documented type-safe JSON APIs with Hono and Open API.

> A new version of drizzle was released since the video showing this starter was made. See [this commit](https://github.com/w3cj/hono-open-api-starter/commit/92525ff84fb2a247c8245cc889b2320d7b3b6e2c) for the changes required to use drizzle v0.35+

> A new version of zod was released since the video showing this starter was made. See [this commit](https://github.com/w3cj/hono-open-api-starter/commit/f7f88dfc40cb7bda53f8729983d8308c2d6c780b) for the changes required to use zod v4.

> For a cloudflare specific template, see the [cloudflare branch](https://github.com/w3cj/hono-open-api-starter/tree/cloudflare) on this repo

> For other deployment examples see the [hono-node-deployment-examples](https://github.com/w3cj/hono-node-deployment-examples) repo

- [Hono Open API Starter](#hono-open-api-starter)
  - [Included](#included)
  - [Setup](#setup)
  - [Database](#database)
  - [Code Tour](#code-tour)
  - [Endpoints](#endpoints)
  - [References](#references)

## Included

- Structured logging with [pino](https://getpino.io/) / [hono-pino](https://www.npmjs.com/package/hono-pino)
- Documented / type-safe routes with [@hono/zod-openapi](https://github.com/honojs/middleware/tree/main/packages/zod-openapi)
- Interactive API documentation with [scalar](https://scalar.com/#api-docs) / [@scalar/hono-api-reference](https://github.com/scalar/scalar/tree/main/packages/hono-api-reference)
- Convenience methods / helpers to reduce boilerplate with [stoker](https://www.npmjs.com/package/stoker)
- Type-safe schemas and environment variables with [zod](https://zod.dev/)
- PostgreSQL database with [Docker Compose](./docker-compose.yml)
- Single source of truth database schemas with [drizzle](https://orm.drizzle.team/docs/overview) and [drizzle-zod](https://orm.drizzle.team/docs/zod)
- Testing with [vitest](https://vitest.dev/)
- Sensible editor, formatting and linting settings with [@antfu/eslint-config](https://github.com/antfu/eslint-config)

## Setup

Clone this template without git history

```sh
npx degit w3cj/hono-open-api my-api
cd my-api
```

Create `.env` file

```sh
cp .env.example .env
```

Install dependencies

```sh
pnpm install
```

Start PostgreSQL (requires [Docker](https://docs.docker.com/get-docker/))

```sh
pnpm db:up
```

Push schema to the database

```sh
pnpm db:push
```

Run

```sh
pnpm dev
```

Lint

```sh
pnpm lint
```

Test

```sh
pnpm test
```

## Database

PostgreSQL runs in Docker via [docker-compose.yml](./docker-compose.yml). Connection settings live in `.env` (development) and `.env.test` (tests).

| Path | Purpose |
| ---- | ------- |
| [src/db/schema/](./src/db/schema/) | Drizzle table definitions and relations |
| [src/db/migrations/](./src/db/migrations/) | Versioned SQL migration files |
| [drizzle.config.ts](./drizzle.config.ts) | Drizzle Kit configuration |

### Scripts

| Script | Command | When to use |
| ------ | ------- | ----------- |
| `pnpm db:up` | `docker compose up -d` | Start PostgreSQL locally |
| `pnpm db:down` | `docker compose down` | Stop PostgreSQL |
| `pnpm db:push` | `drizzle-kit push` | Sync schema directly to the database (local development) |
| `pnpm db:test:push` | `cross-env NODE_ENV=test drizzle-kit push` | Sync schema to the test database |
| `pnpm db:generate` | `drizzle-kit generate` | Create a new SQL migration from schema changes |
| `pnpm db:migrate` | `drizzle-kit migrate` | Apply pending migrations to the database |

### Local development (`push`)

Use `push` while iterating on the schema. It compares your TypeScript schema with the database and applies changes immediately — no migration files are created.

```sh
pnpm db:up
pnpm db:push
```

Best for fast local prototyping. Do **not** use `push` in staging or production.

### Team / production workflow (`generate` + `migrate`)

When a schema change is ready to share or deploy:

1. Update the schema in [src/db/schema/](./src/db/schema/)
2. Generate a migration file:

```sh
pnpm db:generate
```

3. Commit the new files under `src/db/migrations/`
4. Apply migrations on each environment:

```sh
pnpm db:migrate
```

Use this workflow in CI, staging, and production so every environment applies the same versioned SQL history.

### First clone

If the repo already contains migrations, a new developer can apply them instead of using `push`:

```sh
pnpm db:up
pnpm db:migrate
```

Both approaches work for an empty local database. Pick one workflow per environment and stay consistent.

### Tests

Tests load environment variables from `.env.test`, which uses a separate database name (`hono_open_api_test`). Create it once after starting Docker:

```sh
docker exec -it hono-open-api-db psql -U postgres -c "CREATE DATABASE hono_open_api_test;"
```

Then push the test schema and run tests:

```sh
pnpm db:test:push
pnpm test
```

## Code Tour

Base hono app exported from [app.ts](./src/app.ts). Local development uses [@hono/node-server](https://hono.dev/docs/getting-started/nodejs) defined in [index.ts](./src/index.ts) - update this file or create a new entry point to use your preferred runtime.

Typesafe env defined in [env.ts](./src/env.ts) - add any other required environment variables here. The application will not start if any required environment variables are missing

See [src/routes/tasks](./src/routes/tasks/) for an example Open API group. Copy this folder / use as an example for your route groups.

- Router created in [tasks.index.ts](./src/routes/tasks/tasks.index.ts)
- Route definitions defined in [tasks.routes.ts](./src/routes/tasks/tasks.routes.ts)
- Hono request handlers defined in [tasks.handlers.ts](./src/routes/tasks/tasks.handlers.ts)
- Group unit tests defined in [tasks.test.ts](./src/routes/tasks/tasks.test.ts)

All app routes are grouped together and exported into single type as `AppType` in [app.ts](./src/app.ts) for use in [RPC / hono/client](https://hono.dev/docs/guides/rpc).

## Endpoints

| Path               | Description              |
| ------------------ | ------------------------ |
| GET /doc           | Open API Specification   |
| GET /reference     | Scalar API Documentation |
| GET /tasks         | List all tasks           |
| POST /tasks        | Create a task            |
| GET /tasks/{id}    | Get one task by id       |
| PATCH /tasks/{id}  | Patch one task by id     |
| DELETE /tasks/{id} | Delete one task by id    |

## References

- [What is Open API?](https://swagger.io/docs/specification/v3_0/about/)
- [Hono](https://hono.dev/)
  - [Zod OpenAPI Example](https://hono.dev/examples/zod-openapi)
  - [Testing](https://hono.dev/docs/guides/testing)
  - [Testing Helper](https://hono.dev/docs/helpers/testing)
- [@hono/zod-openapi](https://github.com/honojs/middleware/tree/main/packages/zod-openapi)
- [Scalar Documentation](https://github.com/scalar/scalar/tree/main/?tab=readme-ov-file#documentation)
  - [Themes / Layout](https://github.com/scalar/scalar/blob/main/documentation/themes.md)
  - [Configuration](https://github.com/scalar/scalar/blob/main/documentation/configuration.md)
- [Drizzle ORM](https://orm.drizzle.team/docs/overview)
  - [Drizzle Kit push](https://orm.drizzle.team/docs/drizzle-kit-push)
  - [Drizzle Kit generate](https://orm.drizzle.team/docs/drizzle-kit-generate)
  - [Drizzle Kit migrate](https://orm.drizzle.team/docs/drizzle-kit-migrate)
