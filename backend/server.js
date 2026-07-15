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
import collegeCommunicationAnnouncementsRoutes from "./routes/collegeCommunicationAnnouncements.routes.js";

dotenv.config();

const app = express();
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
import errorMiddleware from "./middleware/errorMiddleware.js";





app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origin.startsWith("http://localhost"))
        return callback(null, true);

      const clientUrl = process.env.CLIENT_URL;

      if (clientUrl && origin === clientUrl)
        return callback(null, true);

      return callback(
        new Error(`CORS policy: origin ${origin} not allowed`)
      );
    },
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRouter);

app.use("/api/v1/admin/dashboard", adminDashboardRoutes);
app.use("/api/v1/admin/colleges", adminCollegeRoutes);
app.use("/api/v1/admin/assessments", adminAssessmentRoutes);
app.use("/api/v1/company/jobs", collegeJobsRoutes);
app.use("/api/v1/company", companyRoutes);
app.use("/api/mentor", contentRoutes);
app.use("/api/mentor", mentorRoutes);
app.use("/api/v1/company/interviews", interviewRoutes);
app.use("/api/mentor", mentorRoutes);
app.use("/api/mentor", contentRoutes);
app.use("/api/v1/company/jobs", collegeJobsRoutes);
app.use("/api/v1/company", companyRoutes);
app.use("/api/v1/company/interviews", interviewRoutes);
app.use("/api/mentor", contentRoutes);
app.use("/api/mentor", mentorRoutes);

app.use("/api/student/notifications", notificationRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/college/profile", collegeProfileRoutes);
app.use("/api/college/dashboard", collegeDashboardRoutes);

app.use("/api/departments/statistics", departmentStatisticsRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/placement-drives", placementDriveRoutes);
app.use(
  "/api/college-communication",
  collegeCommunicationAnnouncementsRoutes
);
// Health Check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend is running",
  });
});


connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on PORT ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  });