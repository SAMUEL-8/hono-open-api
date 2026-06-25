# Changelog

All notable changes to this template are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-06-25

A major modernization of the toolchain and dependencies. This release requires
**Node.js 24 LTS** and pins **pnpm 11.9** for reproducible installs.

### Changed

- **BREAKING:** Now requires Node.js `>=24 <25` (LTS). Enforced via the
  `engines` field in `package.json`.
- Pinned the package manager to `pnpm@11.9.0` via the `packageManager` field
  so Corepack resolves the exact version on every machine.
- Upgraded all major dependencies:
  - `@hono/node-server` 1 → 2 (up to 2.3x faster body parsing; API unchanged)
  - `dotenv-expand` 12 → 13
  - `pino` 9 → 10
  - `@scalar/hono-api-reference` 0.9 → 0.11
  - `eslint` 9 → 10, `@antfu/eslint-config` 5 → 9, `eslint-plugin-format` 1 → 2
  - `vitest` 3 → 4
  - `typescript` 5.9 → 6.0
- Migrated `pnpm-workspace.yaml` to the pnpm 11 build-approval syntax
  (`allowBuilds`) and enabled `strictDepBuilds` for supply-chain safety.
- Removed the deprecated `baseUrl` from `tsconfig.json` (the `@/*` path mapping
  already uses a full path), preparing the config for TypeScript 7.

### Added

- `docker/init-test-db.sql` to auto-provision the `hono_open_api_test` database
  on first container start — no manual `CREATE DATABASE` required.
- A `pg_isready` healthcheck for the PostgreSQL service in `docker-compose.yml`.
- `CONTRIBUTING.md` with development, database, testing, and convention guides.
- This `CHANGELOG.md`.

### Fixed

- The PostgreSQL data volume now mounts at `/var/lib/postgresql` (correct for
  Postgres 18+), so data persists across container restarts.
- `lint:fix` now runs `eslint . --fix` instead of `npm run lint --fix`, which
  silently dropped the `--fix` flag and never applied any fixes.
- Test files are no longer compiled into `dist/` and run twice: `tsconfig.json`
  excludes `**/*.test.ts` from the build, and `vitest.config.ts` restricts test
  discovery to `src/**/*.test.ts`.

## [1.0.0]

Initial template based on
[hono-open-api-starter](https://github.com/w3cj/hono-open-api-starter) by w3cj,
migrated from SQLite to PostgreSQL with Docker, Zod v4, and Drizzle ORM v0.45+.
