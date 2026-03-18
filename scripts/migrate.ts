import fs from "node:fs/promises";
import path from "node:path";

const DEFAULT_DATABASE_URL =
  "postgresql://postgres:postgres@localhost:5432/postgres";

async function main() {
  const connectionString =
    process.env.DATABASE_URL?.trim() || DEFAULT_DATABASE_URL;
  const runtimeRequire = eval("require") as NodeJS.Require;
  const { Client } = runtimeRequire("pg") as {
    Client: new (...args: any[]) => any;
  };

  const migrationPath = path.join(process.cwd(), "scripts", "migrate.sql");
  const sql = await fs.readFile(migrationPath, "utf8");
  const client = new Client({ connectionString });

  console.log(`[MIGRATE] Running migrations against ${connectionString}`);

  await client.connect();

  try {
    await client.query(sql);
    console.log("[MIGRATE] Migration completed successfully.");
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error("[MIGRATE] Migration failed:", error);
  process.exit(1);
});
