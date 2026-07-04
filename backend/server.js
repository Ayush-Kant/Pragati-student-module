import express from "express";
<<<<<<< HEAD
import {connectDB} from "./config/db.js";
=======
import { connectDB } from "./config/db.js";
>>>>>>> 365efab62a553f45ffa7656776b0906acf10d6fc
import mentorRoutes from "./routes/mentor.routes.js";

import adminDashboardRoutes from "./routes/admin.dashboard.routes.js";
import adminCollegeRoutes from "./routes/admin.college.routes.js";
import adminAssessmentRoutes from "./routes/admin.assessment.routes.js";
import contentRoutes from "./routes/content.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import collegeProfileRoutes from "./routes/collage.profile.routes.js";
import cors from "cors";
import companyRoutes from "./routes/company.routes.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import companyRoutes from "./routes/company.routes.js";
import authRouter from "./routes/auth.routes.js";
import adminDriveRoutes from "./routes/admin.drive.routes.js";
import interviewRoutes from "./routes/interview.routes.js";
import collegeDashboardRoutes from "./routes/college.dashboard.routes.js";
import dotenv from "dotenv";
import cors from "cors";
import errorMiddleware from "./middleware/errorMiddleware.js";

dotenv.config();
const PORT = process.env.PORT || 5001;

const app = express();
app.use(errorMiddleware);

app.use(express.json());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origin.startsWith("http://localhost"))
        return callback(null, true);
      const clientUrl = process.env.CLIENT_URL;
      if (clientUrl && origin === clientUrl) return callback(null, true);
      return callback(new Error(`CORS policy: origin ${origin} not allowed`));
    },
    credentials: true,
  }),
);
app.use("/api/auth", authRouter);
app.use("/api/v1/admin/dashboard", adminDashboardRoutes);
app.use("/api/v1/admin/colleges", adminCollegeRoutes);
app.use("/api/v1/admin/assessments", adminAssessmentRoutes);
app.use("/api/mentor", contentRoutes);
app.use("/api/v1/company", companyRoutes);
app.use("/api/mentor", mentorRoutes);
app.use("/api/v1/company/interviews", interviewRoutes);
app.use("/api/student/notifications", notificationRoutes);
app.use("/api/college/profile", collegeProfileRoutes);
app.use("/api/college/dashboard", collegeDashboardRoutes);

connectDB(process.env.POSTGRESQL_URI).then(() => {
  app.get("/", (req, res) => {
    res.json({
      message: "Backend is running",
    });
  });
  app.listen(PORT, () => {
    console.log(`✅ Server running on PORT : ${PORT}`);
  });
});
