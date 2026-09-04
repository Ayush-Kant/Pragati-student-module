import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./config/db.js";
import { initializeLiveSessionModule } from "./src/database/migrations/liveSessionSchema.js";
import { initializeAssignmentModule } from "./src/database/migrations/assignmentSchema.js";
import { startNotificationDigestScheduler } from "./services/notification.service.js";
import { ensureStudentAuthSchema } from "./services/studentAuth.service.js";
import { ensureStudentAssessmentSchema } from "./services/studentAssessmentSchema.service.js";

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

import authRouter from "./routes/auth.routes.js";
import studentRoutes from "./routes/student.routes.js";
import studentProfileRoutes from "./routes/studentProfile.routes.js";
import studentOnboardingRoutes from "./routes/studentOnboarding.routes.js";
import studentAssessmentRoutes from "./routes/studentAssessment.routes.js";
import studentCourseRoutes from "./src/routes/studentCourseRoutes.js";
import studentLiveSessionRoutes from "./src/routes/liveSessionRoutes.js";
import studentProjectRoutes from "./routes/studentProject.routes.js";
import studentCodingRoutes from "./routes/studentCoding.routes.js";
import studentAssignmentRoutes from "./routes/studentAssignment.routes.js";
import studentCertificateRoutes from "./routes/studentCertificate.routes.js";
import studentPerformanceRoutes from "./routes/studentPerformance.routes.js";
import studentInterviewRoutes from "./routes/studentInterview.routes.js";
import studentPlacementRoutes from "./routes/studentPlacement.routes.js";
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
import drivesRoutes from "./routes/drives.routes.js";
import collegeDashboardRoutes from "./routes/college.dashboard.routes.js";
import collegeJobsRoutes from "./routes/college.jobs.routes.js";
import nominationRoutes from "./routes/collegeStudentNominations.routes.js";
import collegeReportsGenerationRoutes from "./routes/collegeReportsGeneration.routes.js";
import collegeAnalyticsDashboardRouter from "./routes/collegeAnalyticsDashboard.routes.js";
import departmentRoutes from "./routes/college.department.routes.js";
import courseRoutes from "./routes/college.course.routes.js";
import departmentStatisticsRoutes from "./routes/college.departmentstatistics.routes.js";
import placementDriveRoutes from "./routes/placementDrives.routes.js";
import collegeCommunicationAnnouncementsRoutes from "./routes/collegeCommunicationAnnouncements.routes.js";
import companiesRoutes from "./routes/companies.routes.js";
import assignmentRoutes from "./src/routes/assignmentRoutes.js";
import certificatesRouter from "./routes/certificates.routes.js";
import badgesRouter from "./routes/badges.routes.js";
import { getStudentBadgesController } from "./controllers/badges.controller.js";
import authMiddleware from "./middleware/authMiddleware.js";
import mentorHiringRoutes from "./routes/mentorHiring.routes.js";
import notificationsRoutes from "./routes/notifications.routes.js";
import errorMiddleware from "./middleware/errorMiddleware.js";

dotenv.config();
console.log("POSTGRESQL_URI =", process.env.POSTGRESQL_URI);

const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:") || origin.startsWith("http://localhost")) callback(null, true);
    else {
      const clientUrl = process.env.CLIENT_URL;
      if (clientUrl && origin === clientUrl) callback(null, true);
      else callback(new Error("Not allowed by CORS"), false);
    }
  },
  credentials: true,
}));

app.use("/api/auth", authRouter);
app.use("/api/students", studentRoutes);
app.use("/api/student/profile", studentProfileRoutes);
app.use("/api/student/onboarding", studentOnboardingRoutes);
app.use("/api/student/assessments", studentAssessmentRoutes);
app.use("/api/student/quizzes", studentAssessmentRoutes);
app.use("/api/student/courses", studentCourseRoutes);
app.use("/api/student/sessions", studentLiveSessionRoutes);
app.use("/api/student/projects", studentProjectRoutes);
app.use("/api/student/coding", studentCodingRoutes);
app.use("/api/student/assignments", studentAssignmentRoutes);
app.use("/api/student/certificates", studentCertificateRoutes);
app.use("/api/student/performance", studentPerformanceRoutes);
app.use("/api/student/interviews", studentInterviewRoutes);
app.use("/api/student/placement", studentPlacementRoutes);
app.use("/api/student/dashboard", dashboardRoutes);
app.use("/api/student/notifications", notificationRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/public", express.static(path.join(__dirname, "public")));

app.use("/api/v1/admin/dashboard", adminDashboardRoutes);
app.use("/api/v1/admin/colleges", adminCollegeRoutes);
app.use("/api/v1/admin/assessments", adminAssessmentRoutes);
app.use("/api/v1/admin/students", adminStudentRoutes);
app.use("/api/v1/admin/mentors", adminMentorRoutes);
app.use("/api/v1/admin/courses", adminCourseRoutes);
app.use("/api/v1/admin/drives", adminDriveRoutes);
app.use("/api/v1/admin/company", adminCompanyRoutes);
app.use("/api/v1/admin/notifications", adminNotificationRoutes);
app.use("/api/v1/admin/disputes", adminDisputeRoutes);
app.use("/api/mentor/content", contentRoutes);
app.use("/api/mentor", contentRoutes);
app.use("/api/mentor", mentorRoutes);
app.use("/api/v1/mentor", mentorHiringRoutes);
app.use("/api/v1/company", companyProfileRoutes);
app.use("/api/v1/company/candidates", companyCandidateRoutes);
app.use("/api/v1/company/dashboard", companyDashboardRoutes);
app.use("/api/v1/company/reports", companyReportsRoutes);
app.use("/api/v1/company/drives", companyDrivesRoutes);
app.use("/api/v1/company/assessments", companyAssessmentRoutes);
app.use("/api/v1/company/interviews", companyInterviewRoutes);
app.use("/api/v1/company/notifications", companyNotificationRoutes);
app.use("/api/v1/company/offers", companyOfferRoutes);
app.use("/api/v1/admin/company/interviews", interviewRoutes);
app.use("/api/v1/company/training", trainingRoutes);
app.use("/api/v1/company/jobs", collegeJobsRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/v1/drives", drivesRoutes);
app.use("/api/college/profile", collegeProfileRoutes);
app.use("/api/college/dashboard", collegeDashboardRoutes);
app.use("/api/college", nominationRoutes);
app.use("/api/college", collegeJobsRoutes);
app.use("/api/college/communication", collegeCommunicationAnnouncementsRoutes);
app.use("/api/departments/statistics", departmentStatisticsRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/companies", companiesRoutes);
app.use("/api/placement-drives", placementDrivesRoutes);
app.use("/api/v1/notifications", notificationsRoutes);
app.use("/api/v1/certificates", certificatesRouter);
app.use("/api/v1/badges", badgesRouter);
app.get("/api/v1/students/:id/badges", authMiddleware, getStudentBadgesController);
app.use("/api/reports", collegeReportsGenerationRoutes);
app.use("/api/analytics", collegeAnalyticsDashboardRouter);

app.get("/", (req, res) => res.json({ message: "Backend is running" }));
app.use(errorMiddleware);

connectDB()
  .then(async () => {
    try { await ensureStudentAuthSchema(); console.log("✅ Student authentication/session schema ready"); }
    catch (error) { console.error("⚠️ Student auth schema initialization failed:", error.message); }
    try { await ensureStudentAssessmentSchema(); console.log("✅ Student assessment schema ready"); }
    catch (error) { console.error("⚠️ Student assessment schema initialization failed:", error.message); }
    try { await initializeLiveSessionModule(); console.log("✅ Live session module initialized"); }
    catch (error) { console.error("⚠️ Live session module initialization failed:", error.message); }
    try { await initializeAssignmentModule(); console.log("✅ Assignment module initialized"); }
    catch (error) { console.error("⚠️ Assignment module initialization failed:", error.message); }
    startNotificationDigestScheduler();
    console.log("✅ Student notification digest scheduler started");
    app.listen(PORT, () => console.log(`✅ Server running on PORT : ${PORT}`));
  })
  .catch((err) => console.error("⚠️ PostgreSQL connection failed:", err.message));

export default app;
