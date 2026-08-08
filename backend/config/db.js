import path from "path";
import { fileURLToPath } from "url";
import pg from "pg";
import dotenv from "dotenv";
import { setDefaultResultOrder } from "node:dns";
import { normalizeDatabaseConnectionString } from "./connectionString.js";

setDefaultResultOrder("ipv4first");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envCandidates = [
  path.resolve(__dirname, "..", "..", ".env"),
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), "..", ".env"),
];

for (const envPath of envCandidates) {
  dotenv.config({ path: envPath });
}

const { Pool } = pg;
const connectionString = normalizeDatabaseConnectionString(
  process.env.POSTGRESQL_URI || process.env.DATABASE_URL,
);

if (!connectionString) {
  throw new Error("❌ No database connection string found in .env file");
}

export const pool = new Pool({
  connectionString,
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 15000,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: true } : false,
});

export const connectDB = async () => {
  let client;

  try {
    console.log("🔄 Connecting to PostgreSQL...");
    client = await pool.connect();
    await client.query("SELECT NOW()");
    console.log("✅ PostgreSQL connected successfully");
  } catch (error) {
    console.error("❌ PostgreSQL connection failed:");
    console.error("Message:", error.message);
    console.error("Code:", error.code);
    console.error("Details:", error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
};

export default connectDB;
