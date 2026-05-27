import express from "express";
<<<<<<< HEAD
=======
import dotenv from "dotenv";
>>>>>>> 0b27c17 (fix: addressed PR review comments)
import connectDB from "./config/db.js";
import cors from "cors";
import adminDashboardRoutes from './routes/admin.dashboard.routes.js';
import adminCollegeRoutes from './routes/admin.college.routes.js'
import contentRoutes from "./routes/content.routes.js";

import studentRoutes from "./routes/studentRoutes.js";

import studentProfileRoutes from "./routes/studentProfile.routes.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

<<<<<<< HEAD
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
=======
// middleware
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/student", studentProfileRoutes);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on PORT: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Server failed to start:", err);
  });
>>>>>>> 0b27c17 (fix: addressed PR review comments)
