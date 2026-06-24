-- Runs once on first container init (postgres entrypoint executes files in
-- /docker-entrypoint-initdb.d). Creates the dedicated test database alongside
-- the default one so `pnpm db:test:push` has a target to push the schema into.
CREATE DATABASE hono_open_api_test;
