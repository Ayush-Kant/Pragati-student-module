import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { connectDB } from './config/db.js';
import { initializeLiveSessionModule } from './src/database/migrations/liveSessionSchema.js';

// Student training / learning routes
import studentTrainingRoutes from './src/routes/trainingRoutes.js';
import studentCourseRoutes from './src/routes/courseRoutes.js';
import studentLessonRoutes from './src/routes/lessonRoutes.js';
import studentResourceRoutes from './src/routes/resourceRoutes.js';
import studentProgressRoutes from './src/routes/progressRoutes.js';

// Live sessions
import liveSessionRoutes from './src/routes/liveSessionRoutes.js';

import questionBankRouter from './routes/questionBank.routes.js';
import learningRoutes from './routes/learningRoutes.js';
import challengeRoutes from './routes/challenge.routes.js';
import companyProfileRoutes from './modules/company/routes/companyProfile.routes.js';
import companyAssessmentRoutes from './modules/company/routes/companyAssessment.routes.js';

// Student Profile Module
import studentProfileRouter from './src/routes/index.js';

// Projects Backend Module Routes
import projectRoutes from './src/routes/projectRoutes.js';
import milestoneRoutes from './src/routes/milestoneRoutes.js';
import submissionRoutes from './src/routes/submissionRoutes.js';
import feedbackRoutes from './src/routes/feedbackRoutes.js';

// Middleware
import errorHandler from './src/middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        origin.startsWith('http://localhost:') ||
        origin.startsWith('http://127.0.0.1:') ||
        origin.startsWith('http://localhost')
      ) {
        return callback(null, true);
      }

      const clientUrl = process.env.CLIENT_URL;
      if (clientUrl && origin === clientUrl) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'), false);
    },
    credentials: true,
  }),
);

// Training & Learning Module (MOD-4)
app.use('/api/student/training', studentTrainingRoutes);
app.use('/api/student/training', studentCourseRoutes);
app.use('/api/student/training', studentLessonRoutes);
app.use('/api/student/training', studentResourceRoutes);
app.use('/api/student/training', studentProgressRoutes);

// Live Sessions
app.use('/api/student/live-sessions', liveSessionRoutes);

// Student Profile Module
app.use(studentProfileRouter);

// Student Learning Routes
app.use('/api/student/learning', learningRoutes);

// Student Projects Backend Routes
app.use('/api/student/projects', projectRoutes);
app.use('/api/student/projects', milestoneRoutes);
app.use('/api/student/projects', submissionRoutes);
app.use('/api/student/projects', feedbackRoutes);

// Challenge Routes
app.use('/api/student/challenges', challengeRoutes);

// Question Bank (Mentor)
app.use('/api/mentor', questionBankRouter);

// Company Routes
app.use('/api/v1/company', companyProfileRoutes);
app.use('/api/v1/company/assessments', companyAssessmentRoutes);

// Health check
app.get('/', (req, res) => res.json({ message: '✅ Backend is running' }));

// Global error handler (must be last)
app.use(errorHandler);

connectDB()
  .then(async () => {
    try {
      await initializeLiveSessionModule();
      console.log('✅ Live session module initialized');
    } catch (error) {
      console.error('⚠️ Live session module initialization failed:', error.message);
    }

    app.listen(PORT, () => {
      console.log(`✅ Server running on PORT : ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ PostgreSQL connection failed:', err.message);
    process.exit(1);
  });

export default app;
