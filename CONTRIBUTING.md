# Contributing

This guide covers how to set up a development environment, run the database
and tests, and follow the project conventions. For an overview of what the
template provides, see the [README](./README.md).

## Environment setup

| Tool    | Version          | How it is enforced                              |
| ------- | ---------------- | ----------------------------------------------- |
| Node.js | `>=24 <25` (LTS) | `engines` field in `package.json`               |
| pnpm    | `11.9.0`         | `packageManager` field, resolved via Corepack   |
| Docker  | Recent           | Required for the local PostgreSQL instance      |

If Corepack is not enabled, run `corepack enable` once. After that, every
`pnpm` command in this repo uses the pinned version automatically.

```sh
cp .env.example .env
pnpm install
pnpm db:up
pnpm db:push
pnpm dev
```

## Database

PostgreSQL runs in Docker via [docker-compose.yml](./docker-compose.yml).
Connection settings come from `.env` (development) and `.env.test` (tests).

Both databases live in the **same** container:

| Database              | Source file | Created by                                              |
| --------------------- | ----------- | ------------------------------------------------------- |
| `hono_open_api`       | `.env`      | The `POSTGRES_DB` variable on first container start     |
| `hono_open_api_test`  | `.env.test` | [`docker/init-test-db.sql`](./docker/init-test-db.sql)  |

`pnpm db:up` creates **both** databases automatically the first time the
volume is initialized. There is no manual `CREATE DATABASE` step.

> The init script only runs on a fresh volume. If you change it, recreate the
> volume with `docker compose down -v` (stops the container **and** removes the
> volume), then `pnpm db:up`.

### Scripts

| Script              | Command                                    | When to use                                       |
| ------------------- | ------------------------------------------ | ------------------------------------------------- |
| `pnpm db:up`        | `docker compose up -d`                     | Start PostgreSQL (dev + test databases)           |
| `pnpm db:down`      | `docker compose down`                      | Stop PostgreSQL                                   |
| `pnpm db:push`      | `drizzle-kit push`                         | Sync schema directly to the dev database          |
| `pnpm db:test:push` | `cross-env NODE_ENV=test drizzle-kit push` | Sync schema to the test database                  |
| `pnpm db:generate`  | `drizzle-kit generate`                     | Create a new SQL migration from schema changes    |
| `pnpm db:migrate`   | `drizzle-kit migrate`                      | Apply pending migrations to the database          |

### push vs migrate

These are two different workflows. Pick one per environment and stay consistent.

| Workflow              | Command(s)                  | Use it for                          | Never use it for     |
| --------------------- | --------------------------- | ----------------------------------- | -------------------- |
| `push`                | `pnpm db:push`              | Fast local prototyping              | Staging / production |
| `generate` + `migrate`| `pnpm db:generate` then `pnpm db:migrate` | Shared / deployed environments | Throwaway local hacks |

**Local development (`push`)** compares your TypeScript schema with the
database and applies changes immediately, without creating migration files.

```sh
pnpm db:up
pnpm db:push
```

**Team / production workflow (`generate` + `migrate`)** produces versioned SQL
so every environment applies the same history:

1. Update the schema in [src/db/schema/](./src/db/schema/)
2. Generate a migration: `pnpm db:generate`
3. Commit the new files under `src/db/migrations/`
4. Apply them on each environment: `pnpm db:migrate`

> In production, always use `migrate`. `push` can drop columns because it
> reconciles state directly instead of replaying versioned migrations.

## Testing

Tests load environment variables from `.env.test`, which targets the
`hono_open_api_test` database. Because that database is auto-provisioned by
`pnpm db:up`, no manual setup is needed.

```sh
pnpm db:up          # if the container is not already running
pnpm db:test:push   # sync the schema into the test database
pnpm test           # run the suite
```

The test suite (`src/routes/tasks/tasks.test.ts`) pushes the schema in a
`beforeAll` hook and exercises the routes in-memory with `testClient` — it does
not start an HTTP server, which keeps tests fast and isolated.

## Quality checks

Run these before opening a pull request:

```sh
pnpm typecheck   # tsc --noEmit
pnpm lint        # eslint .
pnpm lint:fix    # auto-fix lint issues
pnpm test        # full test suite
```

## Conventions

| Area            | Convention                                                            |
| --------------- | --------------------------------------------------------------------- |
| Route groups    | One folder per group with `*.index`, `*.routes`, `*.handlers`, `*.test` |
| Schemas         | Define Drizzle tables in `src/db/schema/`, expose via `index.ts`      |
| Env vars        | Add new variables to `src/env.ts`; the app fails fast if any are missing |
| Database casing | `snake_case` in the database, mapped from camelCase in code via Drizzle |
| Commits         | Conventional Commits (e.g. `feat:`, `fix:`, `chore:`)                  |

New env vars must be added to the Zod schema in [src/env.ts](./src/env.ts) and
documented in [.env.example](./.env.example).

## Pull request checklist

- [ ] `pnpm typecheck` passes
- [ ] `pnpm lint` passes
- [ ] `pnpm test` passes
- [ ] New environment variables are added to `src/env.ts` and `.env.example`
- [ ] Schema changes include a generated migration when targeting shared environments
- [ ] Commit messages follow Conventional Commits
