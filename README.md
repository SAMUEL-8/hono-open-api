# Hono Open API Starter

A starter template for building fully documented, type-safe JSON APIs with **Hono**, **OpenAPI**, **PostgreSQL** (Docker), **Drizzle ORM**, **Zod v4**, and **Vitest**.

> Looking to contribute or set up a dev environment? See [CONTRIBUTING.md](./CONTRIBUTING.md).

## Requirements

| Tool           | Version            | Notes                                              |
| -------------- | ------------------ | -------------------------------------------------- |
| Node.js        | `>=24 <25` (LTS)   | Enforced via `engines`. Use a version manager.     |
| pnpm           | `11.9.0`           | Auto-managed via `packageManager` + Corepack.      |
| Docker         | Any recent version | Runs PostgreSQL locally via `docker-compose.yml`.  |

pnpm is pinned through Corepack — you do not install it manually. Running any
`pnpm` command inside the project uses the exact version declared in
`package.json`.

## Quick start

```sh
# 1. Clone without git history
npx degit SAMUEL-8/hono-open-api my-api
cd my-api

# 2. Create your env file
cp .env.example .env

# 3. Install dependencies
pnpm install

# 4. Start PostgreSQL (creates dev + test databases automatically)
pnpm db:up

# 5. Push the schema to the database
pnpm db:push

# 6. Run the dev server
pnpm dev
```

The API starts on the port defined in `.env` (`PORT`, default `9999`).

## Included

- Structured logging with [pino](https://getpino.io/) / [hono-pino](https://www.npmjs.com/package/hono-pino)
- Documented, type-safe routes with [@hono/zod-openapi](https://github.com/honojs/middleware/tree/main/packages/zod-openapi)
- Interactive API docs with [Scalar](https://scalar.com/#api-docs) / [@scalar/hono-api-reference](https://github.com/scalar/scalar/tree/main/packages/hono-api-reference)
- Boilerplate-reducing helpers with [stoker](https://www.npmjs.com/package/stoker)
- Type-safe schemas and env vars with [Zod v4](https://zod.dev/)
- PostgreSQL via [Docker Compose](./docker-compose.yml), with an auto-provisioned test database
- Single source of truth schemas with [Drizzle ORM](https://orm.drizzle.team/docs/overview) and [drizzle-zod](https://orm.drizzle.team/docs/zod)
- Testing with [Vitest](https://vitest.dev/)
- Editor, formatting, and lint settings via [@antfu/eslint-config](https://github.com/antfu/eslint-config)

## Endpoints

| Method | Path           | Description              |
| ------ | -------------- | ------------------------ |
| GET    | `/doc`         | OpenAPI specification    |
| GET    | `/reference`   | Scalar API documentation |
| GET    | `/tasks`       | List all tasks           |
| POST   | `/tasks`       | Create a task            |
| GET    | `/tasks/{id}`  | Get one task by id       |
| PATCH  | `/tasks/{id}`  | Update one task by id    |
| DELETE | `/tasks/{id}`  | Delete one task by id    |

## Project layout

| Path                                       | Purpose                                  |
| ------------------------------------------ | ---------------------------------------- |
| [src/app.ts](./src/app.ts)                 | Base Hono app, exports the `AppType`     |
| [src/index.ts](./src/index.ts)             | Node server entry point                  |
| [src/env.ts](./src/env.ts)                 | Type-safe, validated environment config  |
| [src/routes/tasks/](./src/routes/tasks/)   | Example OpenAPI route group (copy this)  |
| [src/db/schema/](./src/db/schema/)         | Drizzle table definitions and relations  |
| [src/db/migrations/](./src/db/migrations/) | Versioned SQL migration files            |
| [drizzle.config.ts](./drizzle.config.ts)   | Drizzle Kit configuration                |

Each route group follows the same shape: `*.index.ts` (router),
`*.routes.ts` (OpenAPI definitions), `*.handlers.ts` (request handlers),
and `*.test.ts` (tests). Use `src/routes/tasks/` as the reference example.

## Credits

Based on [hono-open-api-starter](https://github.com/w3cj/hono-open-api-starter)
by [w3cj](https://github.com/w3cj), licensed under MIT.

This fork is a substantial rework of the upstream template:

- **Database migrated from SQLite to PostgreSQL** running in Docker Compose
- Test database is **auto-provisioned** on first container start (no manual `CREATE DATABASE`)
- Drizzle schema reorganized into `src/db/schema/` with relations support
- Updated to **Zod v4**, **Drizzle ORM v0.45+**, and a modern dependency set
- Toolchain pinned to **Node 24 LTS** and **pnpm 11.9** for reproducible installs
- Added database scripts (`db:up`, `db:push`, `db:migrate`, …) and expanded docs

> For a Cloudflare-specific template, see the [cloudflare branch](https://github.com/w3cj/hono-open-api-starter/tree/cloudflare) on the upstream repo.
> For other deployment examples, see [hono-node-deployment-examples](https://github.com/w3cj/hono-node-deployment-examples).

## References

- [What is OpenAPI?](https://swagger.io/docs/specification/v3_0/about/)
- [Hono](https://hono.dev/) — [Zod OpenAPI example](https://hono.dev/examples/zod-openapi), [Testing](https://hono.dev/docs/guides/testing)
- [@hono/zod-openapi](https://github.com/honojs/middleware/tree/main/packages/zod-openapi)
- [Scalar docs](https://github.com/scalar/scalar/tree/main/?tab=readme-ov-file#documentation)
- [Drizzle ORM](https://orm.drizzle.team/docs/overview) — [push](https://orm.drizzle.team/docs/drizzle-kit-push), [generate](https://orm.drizzle.team/docs/drizzle-kit-generate), [migrate](https://orm.drizzle.team/docs/drizzle-kit-migrate)
