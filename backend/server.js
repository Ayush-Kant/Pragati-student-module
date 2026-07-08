import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectDB } from "./config/db.js";

// Admin Routes
import adminDashboardRoutes from "./routes/admin.dashboard.routes.js";
import adminCollegeRoutes from "./routes/admin.college.routes.js";
import adminAssessmentRoutes from "./routes/admin.assessment.routes.js";
import adminDriveRoutes from "./routes/admin.drive.routes.js";
import adminNotificationRoutes from "./routes/admin.notification.routes.js";
import adminDisputeRoutes from "./routes/admin.dispute.routes.js";

// Standard & Role-Specific Routes
import authRouter from "./routes/auth.routes.js";
import contentRoutes from "./routes/content.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import companyRoutes from "./routes/company.routes.js";
import companyProfileRoutes from "./modules/company/routes/companyProfile.routes.js";
import interviewRoutes from "./routes/interview.routes.js";
import questionBankRouter from "./routes/questionBank.routes.js";
import mentorRoutes from "./routes/mentor.routes.js";
import trainingRoutes from "./routes/trainingRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

// Live Sessions Routes
import liveSessionRoutes from "./src/routes/liveSessionRoutes.js";
import attendanceRoutes from "./src/routes/attendanceRoutes.js";
import recordingRoutes from "./src/routes/recordingRoutes.js";
import participantRoutes from "./src/routes/participantRoutes.js";
import scheduleRoutes from "./src/routes/scheduleRoutes.js";
import initializeLiveSessionModule from "./src/database/migrations/liveSessionSchema.js";

// Middleware
import errorMiddleware from "./middleware/errorMiddleware.js";
dotenv.config();

console.log("POSTGRESQL_URI =", process.env.POSTGRESQL_URI);

const app = express();
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

// Live Sessions Routes
app.use("/api/student/live-sessions", liveSessionRoutes);
app.use("/api/student/live-sessions", attendanceRoutes);
app.use("/api/student/live-sessions", recordingRoutes);
app.use("/api/student/live-sessions", participantRoutes);
app.use("/api/student/live-sessions", scheduleRoutes);
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
app.use("/api/v1/admin/notifications", adminNotificationRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Backend is running",
  });
});

app.use(errorMiddleware);

connectDB()
  .then(async () => {
    try {
      await initializeLiveSessionModule();
      console.log("✅ Live session module initialized");
    } catch (error) {
      console.error("⚠️ Live session module initialization failed:", error.message);
    }

    app.listen(PORT, () => {
      console.log(`✅ Server running on PORT : ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ PostgreSQL connection failed:", err.message);
  });
