import express from 'express';
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment
} from '../controllers/department.controller.js';
import authMiddleware from '../../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/departments (Protected)
router.get('/', authMiddleware, getDepartments);

// POST /api/departments
router.post('/', createDepartment);

// PUT /api/departments/:id
router.put('/:id', updateDepartment);

// DELETE /api/departments/:id (Protected)
router.delete('/:id', authMiddleware, deleteDepartment);

export default router;
