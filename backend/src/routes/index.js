// ─────────────────────────────────────────────────────────────────────────────
//  src/routes/index.js
//  Student Profile Management — Route Aggregator
//
//  Mounts all student profile sub-routers under /api/student/profile.
//
//  Usage (in server.js or app.js):
//    import studentProfileRouter from './src/routes/index.js';
//    app.use(studentProfileRouter);
// ─────────────────────────────────────────────────────────────────────────────

import express from 'express';

import studentProfileRoutes from './studentProfileRoutes.js';
import academicRoutes       from './academicRoutes.js';
import skillsRoutes         from './skillsRoutes.js';
import documentRoutes       from './documentRoutes.js';
import socialProfileRoutes  from './socialProfileRoutes.js';

const router = express.Router();

// Mount all student profile sub-routers under /api/student/profile
router.use('/api/student/profile', studentProfileRoutes);
router.use('/api/student/profile', academicRoutes);
router.use('/api/student/profile', skillsRoutes);
router.use('/api/student/profile', documentRoutes);
router.use('/api/student/profile', socialProfileRoutes);

export default router;
