# Changelog

All notable changes to this template are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Removed

- **BREAKING:** `dotenv-expand`. The template never used variable expansion, and
  the library silently corrupted values containing `$` (e.g. `"Ab$cd"` became
  `"Ab"`), even inside quotes. Since v1000 it also executes `$(...)` as shell
  commands. Plain `dotenv` keeps every special character intact when the value
  is quoted.
  **Migration:** if your `.env` references other variables (`${VAR}`), write the
  final values directly, or add `dotenv-expand` back to `src/env.ts`.

### Changed

- **BREAKING:** Pinned the package manager to `pnpm@12.14.0`. pnpm 12 ships as a
  native binary and fails on unrecognized `pnpm-workspace.yaml` settings instead
  of ignoring them.
  **Migration:** upgrade your global pnpm (`pnpm self-update 12`). On Windows,
  pnpm 11 may skip the binary setup step; if `pnpm` stops running, see
  `CONTRIBUTING.md`.
- **BREAKING:** `dotenv` 17 → 18. Preloading (`node -r dotenv/config`) and
  `.env.vault` support were removed. The template calls `config()` in
  `src/env.ts`, so it is unaffected; the startup log line now goes to stderr.
- `pnpm-workspace.yaml` follows the `eslint-plugin-pnpm` rules: keys sorted, no
  blank lines, and `minimumReleaseAgeExcludePrune: true`.
- `@scalar/hono-api-reference` 0.11 → 0.12 (no API changes for `Scalar({ url })`).
- Minor and patch updates: `hono`, `@hono/node-server`, `@hono/zod-openapi`,
  `zod`, `drizzle-orm`, `drizzle-kit`, `pino`, `pino-pretty`, `eslint`,
  `@antfu/eslint-config`, `tsx`, `tsc-alias`, `vitest`, `@types/node`.
- `.env.example` documents wrapping values with special characters in double quotes.

## [2.0.1] - 2026-07-09

A toolchain fix that separates the build scope from the editor/test scope so
test files stay fully type-checked while being kept out of the production build.

### Changed

- The production build now compiles through a dedicated `tsconfig.build.json`
  (`build` script runs `tsc -p tsconfig.build.json && tsc-alias -p tsconfig.build.json`).
  This config `extends` the base and is the only place that excludes
  `**/*.test.ts`, so `dist/` ships production code only — no test files, no
  `.d.ts`.

### Fixed

- Test files are back in the base `tsconfig.json` scope, so the editor and
  `vitest` resolve the `@/*` path alias inside `*.test.ts` again. Supersedes the
  2.0.0 approach, where excluding `**/*.test.ts` in `tsconfig.json` stripped the
  path mapping from tests and surfaced `Cannot find module '@/...'` (TS2307).

### Added

- `tsconfig.build.json` — build-only config that inherits the base and excludes
  tests from emitted output.

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
  discovery to `src/**/*.test.ts`. (Superseded in 2.0.1 — the exclusion moved to
  `tsconfig.build.json` because excluding tests in the base config broke the
  `@/*` path alias inside test files.)

## [1.0.0]

Initial template based on
[hono-open-api-starter](https://github.com/w3cj/hono-open-api-starter) by w3cj,
migrated from SQLite to PostgreSQL with Docker, Zod v4, and Drizzle ORM v0.45+.
