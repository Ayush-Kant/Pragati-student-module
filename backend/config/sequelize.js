import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.POSTGRESQL_URI || "";

if (!connectionString) {
  console.warn("⚠️ Warning: POSTGRESQL_URI environment variable is not defined.");
}

export const sequelize = new Sequelize(connectionString, {
  dialect: "postgres",
  logging: false, // Set to console.log if you need query debugging
  dialectOptions: {
    ssl:
      process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: true }
        : false,
  },
  define: {
    timestamps: true,
    underscored: true, // Map camelCase properties in Sequelize models to snake_case in tables
  },
});

export default sequelize;
