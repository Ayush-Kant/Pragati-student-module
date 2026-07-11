import express from "express";
import connectDB from "./config/db.js";
import studentProfileRouter from "./src/routes/index.js";
import errorHandler from "./src/middleware/errorHandler.js";
import cors from "cors";
import dotenv from "dotenv";
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        origin.startsWith("http://localhost:") ||
        origin.startsWith("http://127.0.0.1:")
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"), false);
      }
    },
    credentials: true,
  }),
);
app.use(express.json());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/student/dashboard", dashboardRoutes);
app.use("/api/v1/admin/dashboard", adminDashboardRoutes);
app.use("/api/v1/admin/colleges", adminCollegeRoutes);
app.use("/api/v1/admin/assessments", adminAssessmentRoutes);
app.use("/api/mentor", contentRoutes);
app.use("/api/mentor", mentorRoutes);
app.use("/api/v1/admin/company", companyRoutes);
app.use("/api/v1/admin/company/interviews", interviewRoutes);
app.use("/api/v1/company", companyProfileRoutes);
app.use("/api/v1/company/training", trainingRoutes);
app.use("/api/student/notifications", notificationRoutes);
app.use("/api/v1/admin/disputes", adminDisputeRoutes);


app.get("/", (req, res) => {
  res.json({
    message: "Backend is running",
  });
});

// ── Student Profile Module Routes ─────────────────────────────────────────────
app.use(studentProfileRouter);

// ── Global Error Handler (must be last) ──────────────────────────────────────
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`✅ Server running on PORT : ${PORT}`);
});

connectDB(process.env.POSTGRESQL_URI).catch((err) => {
    console.error("❌ PostgreSQL connection failed:", err.message);
  });
