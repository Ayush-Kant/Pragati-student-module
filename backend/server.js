import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";

import adminDashboardRoutes from "./routes/admin.dashboard.routes.js";
import adminCollegeRoutes from "./routes/admin.college.routes.js";
import contentRoutes from "./routes/content.routes.js";
import companyRoutes from "./routes/company.routes.js";
import studentProfileRoutes from "./routes/studentProfile.routes.js";
import authRoutes from "./routes/auth.routes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// routes
app.use("/api/student/dashboard", dashboardRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/student", studentProfileRoutes);
app.use("/api/v1/admin/dashboard", adminDashboardRoutes);
app.use("/api/v1/admin/colleges", adminCollegeRoutes);
app.use("/api/v1/admin/companies", companyRoutes);
app.use("/api/mentor", contentRoutes);

// root route
app.get("/", (req, res) => {
  res.json({
    message: "Backend is running",
  });
});

// connect DB and start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on PORT: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Server failed to start:", err);
  });

