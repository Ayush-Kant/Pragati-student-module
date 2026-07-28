import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import { connectDB, pool } from "./config/db.js";
import { initializeLiveSessionModule } from "./src/database/migrations/liveSessionSchema.js";
import initializeAssignmentModule from "./src/database/migrations/assignmentSchema.js";

// Admin routes
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

// Standard and role-specific routes
import authRouter from "./routes/auth.routes.js";
import studentRoutes from "./routes/student.routes.js";
import contentRoutes from "./routes/content.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import collegeProfileRoutes from "./routes/collage.profile.routes.js";
import companyProfileRoutes from "./modules/company/routes/companyProfile.routes.js";
import companyCandidateRoutes from "./modules/company/routes/companyCandidate.routes.js";
import companyDashboardRoutes from "./modules/company/routes/companyDashboard.routes.js";
import companyReportsRoutes from "./modules/company/routes/companyReports.routes.js";
import companyDrivesRoutes from "./modules/company/routes/companyDrives.routes.js";
import companyAssessmentRoutes from "./modules/company/routes/companyAssessment.routes.js";
import companyInterviewRoutes from "./modules/company/routes/companyInterview.routes.js";
import companyNotificationRoutes from "./modules/company/routes/companyNotification.routes.js";
import companyOfferRoutes from "./modules/company/routes/companyOffer.routes.js";
import interviewRoutes from "./routes/interview.routes.js";
import mentorRoutes from "./routes/mentor.routes.js";
import trainingRoutes from "./routes/trainingRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import collegeDashboardRoutes from "./routes/college.dashboard.routes.js";
import collegeJobsRoutes from "./routes/college.jobs.routes.js";
import departmentRoutes from "./routes/college.department.routes.js";
import courseRoutes from "./routes/college.course.routes.js";
import departmentStatisticsRoutes from "./routes/college.departmentstatistics.routes.js";
import placementDriveRoutes from "./routes/placementDrives.routes.js";

// Student training / learning routes
import studentTrainingRoutes from "./src/routes/trainingRoutes.js";
import studentCourseRoutes from "./src/routes/courseRoutes.js";
import studentLessonRoutes from "./src/routes/lessonRoutes.js";
import studentResourceRoutes from "./src/routes/resourceRoutes.js";
import studentProgressRoutes from "./src/routes/progressRoutes.js";
import learningRoutes from "./routes/learningRoutes.js";
import challengeRoutes from "./routes/challenge.routes.js";
import questionBankRouter from "./routes/questionBank.routes.js";

// Live sessions and student assignment endpoints
import liveSessionRoutes from "./src/routes/liveSessionRoutes.js";
import studentAssessmentRoutes from "./src/modules/student/assessments-quizzes/routes/assessments.routes.js";
import assignmentRoutes from "./src/routes/assignmentRoutes.js";
import submissionRoutes from "./src/routes/submissionRoutes.js";
import feedbackRoutes from "./src/routes/feedbackRoutes.js";
import gradeRoutes from "./src/routes/gradeRoutes.js";
import deadlineRoutes from "./src/routes/deadlineRoutes.js";
import projectRoutes from "./src/routes/projectRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import { initializeQuizModule } from "./models/quizModel.js";

// Student profile routes
import studentProfileRouter from "./src/routes/index.js";

// Middleware
import errorMiddleware from "./middleware/errorMiddleware.js";

// Bootstrap
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security and general middleware
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        origin.startsWith("http://localhost:") ||
        origin.startsWith("http://127.0.0.1:") ||
        origin.startsWith("http://localhost")
      ) {
        return callback(null, true);
      }
      const clientUrl = process.env.CLIENT_URL;
      if (clientUrl && origin === clientUrl) {
        return callback(null, true);
      }
      return callback(new Error(`CORS policy: origin ${origin} not allowed`));
    },
    credentials: true,
  }),
);
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json({ limit: "10kb" }));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests. Please try again later." },
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests. Please try again later." },
});

app.use("/api/v1/auth", authLimiter);
app.use("/api/auth", authLimiter);
app.use("/api", generalLimiter);

// Routes
app.use("/api/auth", authRouter);
app.use("/api/student/dashboard", dashboardRoutes);
app.use("/api/student/notifications", notificationRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/mentor", contentRoutes);
app.use("/api/mentor", mentorRoutes);
app.use("/api/mentor", questionBankRouter);

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

app.use("/api/college/profile", collegeProfileRoutes);
app.use("/api/college/dashboard", collegeDashboardRoutes);
app.use("/api/departments/statistics", departmentStatisticsRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/placement-drives", placementDriveRoutes);
app.use("/api/v1/company/jobs", collegeJobsRoutes);

app.use("/api/v1/company", companyProfileRoutes);
app.use("/api/v1/company/candidates", companyCandidateRoutes);
app.use("/api/v1/company/dashboard", companyDashboardRoutes);
app.use("/api/v1/company/reports", companyReportsRoutes);
app.use("/api/v1/company/drives", companyDrivesRoutes);
app.use("/api/v1/company/assessments", companyAssessmentRoutes);
app.use("/api/v1/company/interviews", companyInterviewRoutes);
app.use("/api/v1/company/notifications", companyNotificationRoutes);
app.use("/api/v1/company/offers", companyOfferRoutes);
app.use("/api/v1/company/training", trainingRoutes);

app.use("/api/student/assessments", studentAssessmentRoutes);
app.use("/api/student/training", studentTrainingRoutes);
app.use("/api/student/training", studentCourseRoutes);
app.use("/api/student/training", studentLessonRoutes);
app.use("/api/student/training", studentResourceRoutes);
app.use("/api/student/training", studentProgressRoutes);
app.use("/api/student/learning", learningRoutes);
app.use("/api/student/challenges", challengeRoutes);
app.use("/api/student/live-sessions", liveSessionRoutes);

app.use("/api/student/assignments", assignmentRoutes);
app.use("/api/student/assignments", submissionRoutes);
app.use("/api/student/assignments", feedbackRoutes);
app.use("/api/student/assignments", gradeRoutes);
app.use("/api/student/assignments", deadlineRoutes);
app.use("/api/student/projects", projectRoutes);
app.use("/api/student", quizRoutes);

app.use(studentProfileRouter);

app.get("/", (req, res) => {
  res.json({ success: true, message: "Backend is running" });
});

// Global error handler — must be registered last
app.use(errorMiddleware);

let server;

const shutdown = async (signal) => {
  console.log(`\n${signal} received — shutting down gracefully...`);
  server.close(async () => {
    try {
      await pool.end();
      console.log("✅ PostgreSQL pool closed");
    } catch (err) {
      console.error("⚠️  Error closing PostgreSQL pool:", err.message);
    }
    console.log("✅ Server closed");
    process.exit(0);
  });

  setTimeout(() => {
    console.error("❌ Forced shutdown after timeout");
    process.exit(1);
  }, 10_000);
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

connectDB()
  .then(async () => {
    try {
      await initializeLiveSessionModule();
    } catch (error) {
      console.error("Live session module initialization failed:", error.message);
    }

    try {
      await initializeAssignmentModule();
    } catch (error) {
      console.error("Assignment module initialization failed:", error.message);
    }

    try {
      await initializeQuizModule();
    } catch (error) {
      console.error("Quiz module initialization failed:", error.message);
    }

    server = app.listen(PORT, () => {
      console.info(`Server running on port ${PORT}`);
      console.info(`Environment: ${process.env.NODE_ENV || "development"}`);
    });
  })
  .catch((err) => {
    console.error("❌ PostgreSQL connection failed:", err.message);
    process.exit(1);
  });

export default app;
