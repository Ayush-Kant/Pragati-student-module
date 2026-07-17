import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";


import { connectDB } from "./config/db.js";
import { initializeLiveSessionModule } from "./src/database/migrations/liveSessionSchema.js";

// Admin Routes
import adminDashboardRoutes from "./routes/admin.dashboard.routes.js";
import adminCollegeRoutes from "./routes/admin.college.routes.js";
import adminAssessmentRoutes from "./routes/admin.assessment.routes.js";
import adminDriveRoutes from "./routes/admin.drive.routes.js";
import adminNotificationRoutes from "./routes/admin.notification.routes.js";
import adminDisputeRoutes from "./routes/admin.dispute.routes.js";
import adminCourseRoutes from "./routes/admin.course.routes.js";
import adminStudentRoutes from "./routes/admin.student.routes.js";
import adminMentorRoutes from "./routes/admin.mentor.routes.js";
import adminCompanyRoutes from "./routes/admin.company.routes.js";

// Standard & Role-Specific Routes
import authRouter from "./routes/auth.routes.js";
import studentRoutes from "./routes/student.routes.js";
import contentRoutes from "./routes/content.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import collegeProfileRoutes from "./routes/collage.profile.routes.js";
import companyProfileRoutes from "./modules/company/routes/companyProfile.routes.js";
import interviewRoutes from "./routes/interview.routes.js";
import questionBankRouter from "./routes/questionBank.routes.js";
import mentorRoutes from "./routes/mentor.routes.js";
import trainingRoutes from "./routes/trainingRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import collegeDashboardRoutes from "./routes/college.dashboard.routes.js";
import collegeJobsRoutes from "./routes/college.jobs.routes.js";
import departmentRoutes from "./routes/college.department.routes.js";
import courseRoutes from "./routes/college.course.routes.js";
import departmentStatisticsRoutes from "./routes/college.departmentstatistics.routes.js";
import placementDriveRoutes from "./routes/placementDrives.routes.js";

// Company Assessment route
import companyAssessmentRoutes from "./modules/company/routes/companyAssessment.routes.js";

// --- Intern Features ---
import companyRoutes from "./routes/company.routes.js";
import mentorHiringRoutes from "./routes/mentorHiring.routes.js";
// -----------------------

// company Assessment route
import companyAssessmentRoutes from "./modules/company/routes/companyAssessment.routes.js";
// Middleware
import errorMiddleware from "./middleware/errorMiddleware.js";

dotenv.config();

console.log("POSTGRESQL_URI =", process.env.POSTGRESQL_URI);



const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(express.json());

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        origin.startsWith("http://localhost:") ||
        origin.startsWith("http://127.0.0.1:") ||
        origin.startsWith("http://localhost")
      ) {
        callback(null, true);
      } else {
        const clientUrl = process.env.CLIENT_URL;
        if (clientUrl && origin === clientUrl) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"), false);
        }
      }
    },
    credentials: true,
  }),
);

// Routes
app.use("/api/auth", authRouter);
app.use("/api/student/dashboard", dashboardRoutes);
app.use("/api/v1/admin/dashboard", adminDashboardRoutes);
app.use("/api/v1/admin/colleges", adminCollegeRoutes);
app.use("/api/v1/admin/assessments", adminAssessmentRoutes);
app.use("/api/v1/admin/students", adminStudentRoutes);
app.use("/api/v1/admin/mentors", adminMentorRoutes);
app.use("/api/v1/admin/courses", adminCourseRoutes);
app.use("/api/v1/admin/drives", adminDriveRoutes);
app.use("/api/v1/admin/company", adminCompanyRoutes);
app.use("/api/v1/admin/company/interviews", interviewRoutes);
app.use("/api/v1/admin/notifications", adminNotificationRoutes);
app.use("/api/v1/admin/disputes", adminDisputeRoutes);
app.use("/api/v1/certificates", certificateRoutes);
app.use("/api/v1/upload", uploadRoutes);
app.use("/api/v1/skills", skillsRoutes);


app.use("/api/mentor", contentRoutes);
app.use("/api/mentor", mentorRoutes);
app.use("/api/v1/mentor", mentorHiringRoutes); // <-- Added from intern code

app.use("/api/v1/company", companyProfileRoutes);
app.use("/api/v1/company", companyRoutes); // <-- Added from intern code
app.use("/api/v1/company/interviews", interviewRoutes); // <-- Added from intern code
app.use("/api/v1/company/training", trainingRoutes);
app.use("/api/v1/company/jobs", collegeJobsRoutes);
app.use("/api/v1/company/assessments", companyAssessmentRoutes);

app.use("/api/student/notifications", notificationRoutes);
app.use("/api/students", studentRoutes);

app.use("/api/college/profile", collegeProfileRoutes);
app.use("/api/college/dashboard", collegeDashboardRoutes);

app.use("/api/departments/statistics", departmentStatisticsRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/placement-drives", placementDriveRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Backend is running",
  });
});

// Error middleware should be placed after all routes
app.use(errorMiddleware);

connectDB()
  .then(async () => {
    try {
      await initializeLiveSessionModule();
      console.log("✅ Live session module initialized");
    } catch (error) {
      console.error(
        "⚠️ Live session module initialization failed:",
        error.message,
      );
    }

    app.listen(PORT, () => {
      console.log(`✅ Server running on PORT : ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("⚠️ PostgreSQL connection failed:", err.message);
    console.warn(
      "Starting server without a database connection. Routes that require PostgreSQL will fail until the database is reachable.",
    );
    app.listen(PORT, () => {
      console.log(`✅ Server running on PORT : ${PORT} (database unavailable)`);
    });
  });
