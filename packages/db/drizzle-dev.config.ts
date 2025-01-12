/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/schema.ts",
  // REVIEW: sqlite or turso for dev?
  dialect: "sqlite",
  dbCredentials: {
    // eslint-disable-next-line no-restricted-properties
    url: process.env.TURSO_DATABASE_URL!,
  },
  out: "./drizzle-dev",
  verbose: true,
  strict: true,
} satisfies Config;
