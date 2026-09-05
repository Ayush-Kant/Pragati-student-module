import dotenv from "dotenv";
import pg from "pg";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendDir = path.resolve(__dirname, "..");

dotenv.config({ path: path.join(backendDir, ".env") });

dns.setDefaultResultOrder?.("ipv4first");

const connectionString = process.env.POSTGRESQL_URI;

if (!connectionString) {
  console.error("✗ POSTGRESQL_URI is missing from backend/.env");
  process.exit(1);
}

const parsed = new URL(connectionString);
const expectedHost = "127.0.0.1";
const expectedPort = "55432";
const expectedDatabase = "pragati_dev";
const expectedUser = "postgres";

if (
  parsed.hostname !== expectedHost ||
  parsed.port !== expectedPort ||
  parsed.pathname.replace(/^\//, "") !== expectedDatabase ||
  decodeURIComponent(parsed.username) !== expectedUser
) {
  console.error("✗ Local PostgreSQL configuration is not using the Pragati intern setup.");
  console.error(`  Expected: postgres/postgres@${expectedHost}:${expectedPort}/${expectedDatabase}`);
  console.error(`  Found:    ${parsed.username}@${parsed.hostname}:${parsed.port || "5432"}${parsed.pathname}`);
  console.error("  Repair backend/.env by rerunning the intern setup from the repository root.");
  process.exit(1);
}

const { Client } = pg;
const client = new Client({ connectionString, connectionTimeoutMillis: 10000 });

try {
  await client.connect();
  const { rows } = await client.query("SELECT current_user, current_database(), version()");
  const row = rows[0];

  console.log("✓ PostgreSQL authentication succeeded.");
  console.log(`  User:     ${row.current_user}`);
  console.log(`  Database: ${row.current_database}`);
  console.log(`  Host:     ${parsed.hostname}:${parsed.port}`);
} catch (error) {
  console.error("✗ PostgreSQL authentication failed.");
  console.error("  The application cannot connect with the credentials configured in backend/.env.");
  console.error("  Make sure the Pragati Docker PostgreSQL container is running on host port 55432.");
  console.error(`  PostgreSQL error: ${error?.message || error}`);
  process.exitCode = 1;
} finally {
  await client.end().catch(() => {});
}
