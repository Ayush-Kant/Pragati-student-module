import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectDB } from "./config/db.js";
import { initializeLiveSessionModule } from "./src/database/migrations/liveSessionSchema.js";

// Existing Route Imports on student-team branch
import authRouter from "./routes/auth.routes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import liveSessionRoutes from "./src/routes/liveSessionRoutes.js";
import adminDashboardRoutes from "./routes/admin.dashboard.routes.js";
import adminCollegeRoutes from "./routes/admin.college.routes.js";
import adminAssessmentRoutes from "./routes/admin.assessment.routes.js";
import contentRoutes from "./routes/content.routes.js";
import mentorRoutes from "./routes/mentor.routes.js";
import companyRoutes from "./routes/company.routes.js";
import interviewRoutes from "./routes/interview.routes.js";
import companyProfileRoutes from "./modules/company/routes/companyProfile.routes.js";
import companyAssessmentRoutes from "./modules/company/routes/companyAssessment.routes.js";
import trainingRoutes from "./routes/trainingRoutes.js";
import notificationRoutes from "./routes/notification.routes.js";
import adminDisputeRoutes from "./routes/admin.dispute.routes.js";

// Student Profile Management Module Routes
import studentProfileRouter from "./src/routes/index.js";

// Projects Backend Module Routes
import projectRoutes from "./src/routes/projectRoutes.js";
import milestoneRoutes from "./src/routes/milestoneRoutes.js";
import submissionRoutes from "./src/routes/submissionRoutes.js";
import feedbackRoutes from "./src/routes/feedbackRoutes.js";

// Middleware
import errorHandler from "./src/middleware/errorHandler.js";

dotenv.config();

console.log("POSTGRESQL_URI =", process.env.POSTGRESQL_URI);

const app = express();
const PORT = process.env.PORT || 5000;

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

// Mount Existing Routes
app.use("/api/auth", authRouter);
app.use("/api/student/dashboard", dashboardRoutes);
app.use("/api/student/live-sessions", liveSessionRoutes);
app.use("/api/v1/admin/dashboard", adminDashboardRoutes);
app.use("/api/v1/admin/colleges", adminCollegeRoutes);
app.use("/api/v1/admin/assessments", adminAssessmentRoutes);
app.use("/api/mentor", contentRoutes);
app.use("/api/mentor", mentorRoutes);
app.use("/api/v1/admin/company", companyRoutes);
app.use("/api/v1/admin/company/interviews", interviewRoutes);
app.use("/api/v1/company", companyProfileRoutes);
app.use("/api/v1/company/assessments", companyAssessmentRoutes);
app.use("/api/v1/company/training", trainingRoutes);
app.use("/api/student/notifications", notificationRoutes);
app.use("/api/v1/admin/disputes", adminDisputeRoutes);

// Mount Student Profile Module Routes
app.use(studentProfileRouter);

// Mount Projects Backend Module Routes
app.use("/api/student/projects", projectRoutes);
app.use("/api/student/projects", milestoneRoutes);
app.use("/api/student/projects", submissionRoutes);
app.use("/api/student/projects", feedbackRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Backend is running",
  });
});

// Global Error Handler (must be last)
app.use(errorHandler);

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
    process.exit(1);
  });
