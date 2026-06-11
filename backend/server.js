import express from "express";
import connectDB from "./config/db.js";
import mentorRoutes from "./routes/mentor.routes.js";
import adminDashboardRoutes from './routes/admin.dashboard.routes.js';
import adminCollegeRoutes from './routes/admin.college.routes.js';
import companyRoutes from './routes/company.routes.js';
import contentRoutes from "./routes/content.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import cors from "cors";
import authRouter from "./routes/auth.routes.js";

const PORT = process.env.PORT || 5001;

const app = express();

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

app.use('/api/v1/admin/colleges', adminCollegeRoutes);

app.use('/api/companies', companyRoutes);

app.use("/api/mentor", contentRoutes);

app.use("/api/student/notifications", notificationRoutes);

connectDB(process.env.POSTGRESQL_URI).then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on PORT : ${PORT}`);
  });
});
