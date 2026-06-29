import express from "express";
import connectDB from "./config/db.js";
import mentorRoutes from "./routes/mentor.routes.js";

import adminDashboardRoutes from "./routes/admin.dashboard.routes.js";
import adminCollegeRoutes from "./routes/admin.college.routes.js";
import adminAssessmentRoutes from "./routes/admin.assessment.routes.js";
import contentRoutes from "./routes/content.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import collegeProfileRoutes from "./routes/collage.profile.routes.js";
import companyRoutes from "./routes/company.routes.js";
import authRouter from "./routes/auth.routes.js";
import adminDriveRoutes from "./routes/admin.drive.routes.js";
import interviewRoutes from "./routes/interview.routes.js";

import cors from "cors";
import errorMiddleware from "./middleware/errorMiddleware.js";

const PORT = process.env.PORT || 5000;

const app = express();


app.use("/api/mentor", mentorRoutes);

app.use("/api/college/profile", collegeProfileRoutes);

connectDB(process.env.POSTGRESQL_URI).then(() => {
    app.listen(PORT, () => {
        console.log(`✅ Server running on PORT : ${PORT}`)
    })
})