/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/schema.ts",
  dialect: "turso",
  dbCredentials: {
    // LATER: Any reason for not importing these from env.ts?
    // eslint-disable-next-line no-restricted-properties
    url: process.env.TURSO_DATABASE_URL!,
    // eslint-disable-next-line no-restricted-properties
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
  out: "./migrations",
  verbose: true,
  strict: true,
} satisfies Config;
