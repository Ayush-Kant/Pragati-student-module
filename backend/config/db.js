import pg from "pg";
import dotenv from "dotenv";
import dns from "dns";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dns.setDefaultResultOrder("ipv4first");
// Use absolute path so .env is found regardless of the working directory
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const { Pool, types } = pg;

// PostgreSQL DATE values represent calendar dates, not instants in time.
// Keep them as YYYY-MM-DD strings so API responses do not shift the date
// when JavaScript/UTC serialization is applied (for example, a birth date
// of 2003-05-15 must remain 2003-05-15 in every timezone).
types.setTypeParser(1082, (value) => value);

const connectionString = process.env.POSTGRESQL_URI;

if (!connectionString) {
  throw new Error("❌ POSTGRESQL_URI is missing in .env file");
}

export const pool = new Pool({
  connectionString,
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 15000,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: true }
      : false,
});

export const connectDB = async () => {
  let client;

  try {
    console.log("🔄 Connecting to PostgreSQL...");

    client = await pool.connect();

    await client.query("SELECT NOW()");

    console.log("✅ PostgreSQL connected successfully");
  } catch (error) {
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }
};
export default connectDB;
