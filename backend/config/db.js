import pg from "pg";
import dotenv from "dotenv";
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");
dotenv.config();

const { Pool } = pg;

const connectionString = process.env.POSTGRESQL_URI;

if (!connectionString) {
  throw new Error("POSTGRESQL_URI is missing in .env file");
}

const pgConfig = {
  connectionString,
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 15000,
<<<<<<< HEAD
  ssl: process.env.NODE_ENV === "production"
    ? { rejectUnauthorized: true }
    : false,
=======

  // 🔥 IMPORTANT FIX: disable SSL completely for local DB
  ssl: false,
>>>>>>> 0b27c17 (fix: addressed PR review comments)
};

export const pool = new Pool(pgConfig);

export const connectDB = async () => {
  try {
    await pool.query("SELECT 1");
    console.log("✅ PostgreSQL connected");
  } catch (error) {
    console.error("❌ PostgreSQL connection failed:", error.message);
    throw error;
  }
};

export default connectDB;