import express from "express";
import connectDB from "./config/db.js";
import cors from "cors";
import adminDashboardRoutes from './routes/admin.dashboard.routes.js';
import adminCollegeRoutes from './routes/admin.college.routes.js'
import contentRoutes from "./routes/content.routes.js";

import studentRoutes from "./routes/studentRoutes.js";

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/student", studentRoutes);
app.use("/api/v1/admin/dashboard", adminDashboardRoutes);
app.use('/api/v1/admin/colleges', adminCollegeRoutes);
app.use("/api/mentor", contentRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on PORT : ${PORT}`);
  });
});