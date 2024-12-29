import type { Config } from "drizzle-kit";

export default {
  schema: "./src/schema.ts",
  // REVIEW: sqlite or turso for dev?
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL! as string,
    // authToken: process.env.TURSO_AUTH_TOKEN! as string,
  },
  out: "./drizzle-dev",
  verbose: true,
  strict: true,
} satisfies Config;
