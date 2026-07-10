import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  searchStudents,
  filterStudents,
  getStudentStatistics,
  getAcademicDetails,
  updateAcademicDetails,
  getStudentSkills,
  addStudentSkill,
  deleteStudentSkill,
} from '../controllers/student.controller.js';

const router = Router();

// All student routes require authentication
router.use(authMiddleware);

// ─── Search & Filter & Statistics (before /:id to avoid conflicts) ────────────
router.get('/search',     searchStudents);
router.get('/filter',     filterStudents);
router.get('/statistics', getStudentStatistics);

// ─── Student CRUD ─────────────────────────────────────────────────────────────
router.get('/',    getStudents);
router.post('/',   createStudent);
router.get('/:id',    getStudentById);
router.put('/:id',    updateStudent);
router.delete('/:id', deleteStudent);

// ─── Academic Details ─────────────────────────────────────────────────────────
router.get('/:id/academic', getAcademicDetails);
router.put('/:id/academic', updateAcademicDetails);

// ─── Skills ───────────────────────────────────────────────────────────────────
router.get('/:id/skills',             getStudentSkills);
router.post('/:id/skills',            addStudentSkill);
router.delete('/:id/skills/:skillId', deleteStudentSkill);

export default router;
