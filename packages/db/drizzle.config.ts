import type { Config } from "drizzle-kit";

export default {
  schema: "./src/schema.ts",
  dialect: "turso",
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL! as string,
    authToken: process.env.TURSO_AUTH_TOKEN! as string,
  },
  out: "./migrations",
  verbose: true,
  strict: true,
} satisfies Config;
