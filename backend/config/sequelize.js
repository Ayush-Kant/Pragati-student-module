import { Sequelize } from "@sequelize/core";
import { PostgresDialect } from "@sequelize/postgres";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.POSTGRESQL_URI || "";

if (!connectionString) {
  console.warn(
    "⚠️ Warning: POSTGRESQL_URI environment variable is not defined.",
  );
}

const url = new URL(connectionString);
const isProduction = process.env.NODE_ENV === "production";

export const sequelize = new Sequelize({
  dialect: PostgresDialect,
  host: url.hostname,
  port: Number(url.port) || 5432,
  database: url.pathname.replace(/^\//, ""),
  user: url.username,
  password: url.password,
  logging: false,
  ssl: isProduction
    ? { require: true, rejectUnauthorized: true }
    : { require: true, rejectUnauthorized: false },
  define: {
    timestamps: true,
    underscored: true,
  },
});

export default sequelize;
