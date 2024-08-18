import dotenv from "dotenv";
dotenv.config({
  path: ".env",
});

import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";

const migrationClient = postgres(process.env.DATABASE_URL, { max: 1 });

async function main() {
  await migrate(drizzle(migrationClient), {
    migrationsFolder: "./src/core/drizzle/migrations",
  });

  await migrationClient.end();
}

main();
