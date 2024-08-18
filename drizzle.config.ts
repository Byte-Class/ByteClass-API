import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/core/drizzle/schema.ts",
  out: "./src/core/drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
});
