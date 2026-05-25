import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import env from "@/env";
import * as schema from "./schema";

const client = postgres({
  host: env.DATABASE_HOST,
  port: env.DATABASE_PORT,
  user: env.DATABASE_USER,
  password: env.DATABASE_PASSWORD,
  database: env.DATABASE_NAME,
});

const db = drizzle(client, {
  casing: "snake_case",
  schema,
});

export default db;
