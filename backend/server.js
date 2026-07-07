import express from "express";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import connectDB, { pool } from "./config/db.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import assignmentRoutes from "./src/routes/assignmentRoutes.js";
import errorHandler from "./src/middleware/errorHandler.js";
import seedAssignments from "./src/database/seedAssignments.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const assignmentMigrationPath = path.join(__dirname, "migrations", "011_create_assignments_module.sql");

console.log("POSTGRESQL_URI =", process.env.POSTGRESQL_URI);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use("/api/student/dashboard", dashboardRoutes);
app.use("/api/student/assignments", assignmentRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Backend is running",
  });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ Server running on PORT : ${PORT}`);
});

const initializeAssignmentsModule = async () => {
  try {
    const migrationSql = fs.readFileSync(assignmentMigrationPath, "utf8");
    await pool.query(migrationSql);
    await seedAssignments();
    console.log("✅ Assignments module schema and seed data initialized");
  } catch (error) {
    console.error("❌ Assignments module initialization failed:", error.message);
  }
};

connectDB()
  .then(() => initializeAssignmentsModule())
  .catch((err) => {
    console.error("❌ PostgreSQL connection failed:", err.message);
  });

