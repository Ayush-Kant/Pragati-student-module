import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { connectDB } from './config/db.js';

// Student training / learning routes
import studentTrainingRoutes from './src/routes/trainingRoutes.js';
import studentCourseRoutes from './src/routes/courseRoutes.js';
import studentLessonRoutes from './src/routes/lessonRoutes.js';
import studentResourceRoutes from './src/routes/resourceRoutes.js';
import studentProgressRoutes from './src/routes/progressRoutes.js';

// Live sessions (optional)
import liveSessionRoutes from './src/routes/liveSessionRoutes.js';

// Admin & standard routes
import adminDashboardRoutes from './routes/admin.dashboard.routes.js';
import adminCollegeRoutes from './routes/admin.college.routes.js';
import adminAssessmentRoutes from './routes/admin.assessment.routes.js';
import adminDriveRoutes from './routes/admin.drive.routes.js';
import adminNotificationRoutes from './routes/admin.notification.routes.js';
import adminDisputeRoutes from './routes/admin.dispute.routes.js';

import authRouter from './routes/auth.routes.js';
import contentRoutes from './routes/content.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import companyRoutes from './routes/company.routes.js';
import companyProfileRoutes from './modules/company/routes/companyProfile.routes.js';
import interviewRoutes from './routes/interview.routes.js';
import questionBankRouter from './routes/questionBank.routes.js';
import mentorRoutes from './routes/mentor.routes.js';
import trainingRoutes from './routes/trainingRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import companyAssessmentRoutes from './modules/company/routes/companyAssessment.routes.js';

// Student profile (if present)
import studentProfileRouter from './src/routes/index.js';

// Middleware
import errorHandler from './src/middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'), false);
    },
    credentials: true,
  })
);

app.use(express.json());

// Authentication
app.use('/api/auth', authRouter);

// Student Dashboard & Live Sessions
app.use('/api/student/dashboard', dashboardRoutes);
app.use('/api/student/live-sessions', liveSessionRoutes);

// Training & Learning Module (MOD-4)
app.use('/api/student/training', studentTrainingRoutes);
app.use('/api/student/training', studentCourseRoutes);
app.use('/api/student/training', studentLessonRoutes);
app.use('/api/student/training', studentResourceRoutes);
app.use('/api/student/training', studentProgressRoutes);

// Admin Routes
app.use('/api/v1/admin/dashboard', adminDashboardRoutes);
app.use('/api/v1/admin/colleges', adminCollegeRoutes);
app.use('/api/v1/admin/assessments', adminAssessmentRoutes);
app.use('/api/v1/admin/disputes', adminDisputeRoutes);
app.use('/api/v1/admin/drives', adminDriveRoutes);
app.use('/api/v1/admin/notifications', adminNotificationRoutes);

// Mentor & Content Routes
app.use('/api/mentor', contentRoutes);
app.use('/api/mentor', mentorRoutes);

// Company Routes
app.use('/api/v1/admin/company', companyRoutes);
app.use('/api/v1/admin/company/interviews', interviewRoutes);
app.use('/api/v1/company', companyProfileRoutes);
app.use('/api/v1/company/training', trainingRoutes);
app.use('/api/v1/company/assessments', companyAssessmentRoutes);

// Notifications
app.use('/api/student/notifications', notificationRoutes);

// Student Profile Module
app.use(studentProfileRouter);

// Health check
app.get('/', (req, res) => res.json({ message: '✅ Backend is running' }));

// Global error handler (must be last)
app.use(errorHandler);

// Start DB connection and server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on PORT : ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ PostgreSQL connection failed:', err.message);
    process.exit(1);
  });

export default app;
