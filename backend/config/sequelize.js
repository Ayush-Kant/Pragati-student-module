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

export const sequelize = new Sequelize({
  dialect: PostgresDialect,
  url: connectionString,
  logging: false,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: true }
      : false,

  define: {
    timestamps: true,
    underscored: true,
  },
});

export default sequelize;
