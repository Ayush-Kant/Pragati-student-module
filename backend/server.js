import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import studentRoutes from "./routes/student.routes.js";
import mentorRoutes from "./routes/mentor.routes.js";
import adminDashboardRoutes from "./routes/admin.dashboard.routes.js";
import adminCollegeRoutes from "./routes/admin.college.routes.js";
import adminAssessmentRoutes from "./routes/admin.assessment.routes.js";
import contentRoutes from "./routes/content.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import collegeProfileRoutes from "./routes/collage.profile.routes.js";
import companyRoutes from "./routes/company.routes.js";
import adminDriveRoutes from "./routes/admin.drive.routes.js";
import interviewRoutes from "./routes/interview.routes.js";
import collegeDashboardRoutes from "./routes/college.dashboard.routes.js";
import collegeJobsRoutes from "./routes/college.jobs.routes.js";
import departmentRoutes from "./routes/college.department.routes.js";
import courseRoutes from "./routes/college.course.routes.js";
import departmentStatisticsRoutes from "./routes/college.departmentstatistics.routes.js";
import placementDriveRoutes from "./routes/placementDrives.routes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import liveSessionRoutes from "./src/routes/liveSessionRoutes.js";
import assignmentRoutes from "./src/routes/assignmentRoutes.js";
import submissionRoutes from "./src/routes/submissionRoutes.js";
import feedbackRoutes from "./src/routes/feedbackRoutes.js";
import gradeRoutes from "./src/routes/gradeRoutes.js";
import deadlineRoutes from "./src/routes/deadlineRoutes.js";
import initializeLiveSessionModule from "./src/database/migrations/liveSessionSchema.js";
import initializeAssignmentModule from "./src/database/migrations/assignmentSchema.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import studentProfileRouter from "./src/routes/index.js";
import errorHandler from "./src/middleware/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());





app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origin.startsWith("http://localhost")) {
        return callback(null, true);
      }

      const clientUrl = process.env.CLIENT_URL;
      if (clientUrl && origin === clientUrl) {
        return callback(null, true);
      }

      return callback(new Error(`CORS policy: origin ${origin} not allowed`));
    },
    credentials: true,
  })
);

app.use("/api/auth", authRouter);
app.use("/api/student/dashboard", dashboardRoutes);
app.use("/api/student/live-sessions", liveSessionRoutes);
app.use("/api/v1/admin/dashboard", adminDashboardRoutes);
app.use("/api/v1/admin/colleges", adminCollegeRoutes);
app.use("/api/v1/admin/assessments", adminAssessmentRoutes);
app.use("/api/v1/admin/drives", adminDriveRoutes);
app.use("/api/v1/company/jobs", collegeJobsRoutes);
app.use("/api/v1/company", companyRoutes);
app.use("/api/mentor", contentRoutes);
app.use("/api/mentor", mentorRoutes);
app.use("/api/v1/company/interviews", interviewRoutes);
app.use("/api/student/notifications", notificationRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/college/profile", collegeProfileRoutes);
app.use("/api/college/dashboard", collegeDashboardRoutes);
app.use("/api/departments/statistics", departmentStatisticsRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/placement-drives", placementDriveRoutes);
app.use("/api/student/assignments", assignmentRoutes);
app.use("/api/student/assignments", submissionRoutes);
app.use("/api/student/assignments", feedbackRoutes);
app.use("/api/student/assignments", gradeRoutes);
app.use("/api/student/assignments", deadlineRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend is running",
  });
});

// ── Student Profile Module Routes ─────────────────────────────────────────────
app.use(studentProfileRouter);

// ── Global Error Handler (must be last) ──────────────────────────────────────
app.use(errorMiddleware);

connectDB()
  .then(async () => {
    try {
      await initializeLiveSessionModule();
      console.log("✅ Live session module initialized");
    } catch (error) {
      console.error("⚠️ Live session module initialization failed:", error.message);
    }

    try {
      await initializeAssignmentModule();
      console.log("✅ Assignment module initialized");
    } catch (error) {
      console.error("⚠️ Assignment module initialization failed:", error.message);
    }

    app.listen(PORT, () => {
      console.log(`✅ Server running on PORT ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  });
