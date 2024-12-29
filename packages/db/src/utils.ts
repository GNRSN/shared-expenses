import path from "path";
import { migrate } from "drizzle-orm/libsql/migrator";

import type { DB } from "./client";

export async function runDevMigrations(
  db: DB,
  migrationsFolder = path.resolve(__dirname, "../drizzle-dev"),
) {
  console.log("Running migrations");
  await migrate(db, { migrationsFolder });
  console.log("Migrated successfully");
}
