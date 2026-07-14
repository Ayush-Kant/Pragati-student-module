import pg from "pg";
import dotenv from "dotenv";
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");
dotenv.config();

const { Pool } = pg;

const connectionString = process.env.POSTGRESQL_URI;

if (!connectionString) {
  throw new Error("❌ POSTGRESQL_URI is missing in .env file");
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