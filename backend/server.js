import express from "express";
import connectDB from "./config/db.js";
import mentorRoutes from "./routes/mentor.routes.js";
import adminDashboardRoutes from "./routes/admin.dashboard.routes.js";
import contentRoutes from "./routes/content.routes.js";
import notificationRoutes from "./routes/notification.routes.js";

const PORT = process.env.PORT || 5001;

const app = express();

app.use(express.json());

app.use("/api/mentor", mentorRoutes);

app.use("/api/v1/admin/dashboard", adminDashboardRoutes);

app.use("/api/mentor", contentRoutes);

app.use("/api/student/notifications", notificationRoutes);

connectDB(process.env.POSTGRESQL_URI).then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on PORT : ${PORT}`);
  });
});
