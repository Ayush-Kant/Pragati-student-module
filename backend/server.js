import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config();

console.log("POSTGRESQL_URI =", process.env.POSTGRESQL_URI);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use("/api/student/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Backend is running",
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on PORT : ${PORT}`);
});

connectDB().catch((err) => {
  console.error("❌ PostgreSQL connection failed:", err.message);
});