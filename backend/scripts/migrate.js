import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { pool } from "../config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const migrationsDir = path.join(__dirname, "../migrations");

const migrationFiles = fs
  .readdirSync(migrationsDir)
  .filter((file) => file.endsWith(".sql"))
  .sort();

async function runMigrationsFresh() {
  try {
    console.log("Dropping existing tables and types to start fresh...");

    const { rows: tables } = await pool.query(`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public';
    `);

    if (tables.length > 0) {
      const tableNames = tables.map((t) => `"${t.tablename}"`).join(", ");
      await pool.query(`DROP TABLE IF EXISTS ${tableNames} CASCADE;`);
      console.log(`✔ Dropped ${tables.length} existing tables.`);
    }

    const { rows: types } = await pool.query(`
      SELECT t.typname
      FROM pg_type t
      JOIN pg_namespace n ON t.typnamespace = n.oid
      WHERE n.nspname = 'public'
        AND t.typtype = 'e';
    `);

    if (types.length > 0) {
      const typeNames = types.map((t) => `"${t.typname}"`).join(", ");
      await pool.query(`DROP TYPE IF EXISTS ${typeNames} CASCADE;`);
      console.log(`✔ Dropped ${types.length} existing custom types.`);
    }

    console.log("Database clean slate ready.");
  } catch (error) {
    console.error("❌ Failed to drop existing database objects:", error);
    throw error;
  }
}

async function runMigrations() {
  try {
    console.log("Dropping existing tables to start fresh...");
    await pool.query(`
      DROP SCHEMA public CASCADE;
      CREATE SCHEMA public;
      GRANT ALL ON SCHEMA public TO public;
    `);
    console.log("Existing tables dropped successfully.");

    for (const file of migrationFiles) {
      const filePath = path.join(migrationsDir, file);
      console.log(`Running migration: ${file}...`);
      const sql = fs.readFileSync(filePath, "utf8");
      await pool.query(sql);
      console.log(`Migration completed successfully: ${file}`);
    }

    console.log("All migrations completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

export { runMigrationsFresh, runMigrations };
export default runMigrations;

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  runMigrations();
}
