import express from "express";
import { connectDB } from "./config/db.js";
import mentorRoutes from "./routes/mentor.routes.js";
import adminDashboardRoutes from "./routes/admin.dashboard.routes.js";
import adminCollegeRoutes from "./routes/admin.college.routes.js";
import contentRoutes from "./routes/content.routes.js";
import cors from "cors";
import authRouter from "./routes/auth.routes.js";
import companyRoutes from "./modules/company/routes/companyProfile.routes.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import authMiddleware from "./middleware/authMiddleware.js";

import dotenv from "dotenv";

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

app.use("/api/mentor", contentRoutes);

app.use("/api/v1/company", companyRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on PORT : ${PORT}`);
  });
});
