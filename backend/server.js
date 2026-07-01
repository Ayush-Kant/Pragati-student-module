import express from "express";
import { connectDB } from "./config/db.js";
import adminDashboardRoutes from "./routes/admin.dashboard.routes.js";
import adminCollegeRoutes from "./routes/admin.college.routes.js";
import adminAssessmentRoutes from "./routes/admin.assessment.routes.js";
import contentRoutes from "./routes/content.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import cors from "cors";
import companyRoutes from "./routes/company.routes.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import authRouter from "./routes/auth.routes.js";
import adminDriveRoutes from "./routes/admin.drive.routes.js";
import interviewRoutes from "./routes/interview.routes.js";
import questionBankRouter from "./routes/questionBank.routes.js";

import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import adminDashboardRoutes from "./routes/admin.dashboard.routes.js";
import adminCollegeRoutes from "./routes/admin.college.routes.js";
import adminAssessmentRoutes from "./routes/admin.assessment.routes.js";
import adminNotificationRoutes from "./routes/admin.notification.routes.js";
import contentRoutes from "./routes/content.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import companyRoutes from "./routes/company.routes.js";
import adminDriveRoutes from "./routes/admin.drive.routes.js";
import interviewRoutes from "./routes/interview.routes.js";
import mentorRoutes from "./routes/mentor.routes.js";
import adminDisputeRoutes from "./routes/admin.dispute.routes.js";
import companyProfileRoutes from "./modules/company/routes/companyProfile.routes.js";
import trainingRoutes from "./routes/trainingRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import errorMiddleware from "./middleware/errorMiddleware.js";

dotenv.config();

console.log("POSTGRESQL_URI =", process.env.POSTGRESQL_URI);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"), false);
      }
    },
    credentials: true,
  })
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
app.use("/api/v1/admin/notifications", adminNotificationRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Backend is running",
  });
});

app.use(errorMiddleware);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on PORT : ${PORT}`);
  });
}).catch((err) => {
  console.error("❌ PostgreSQL connection failed:", err.message);
});

