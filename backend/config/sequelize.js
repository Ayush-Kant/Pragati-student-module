import path from "path";
import { fileURLToPath } from "url";
import { Sequelize } from "@sequelize/core";
import { PostgresDialect } from "@sequelize/postgres";
import dotenv from "dotenv";
import { normalizeDatabaseConnectionString } from "./connectionString.js";

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

const connectionString = normalizeDatabaseConnectionString(
  process.env.POSTGRESQL_URI || process.env.DATABASE_URL || "",
);

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
