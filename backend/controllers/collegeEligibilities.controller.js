import {
  getEligibleStudentsService,
  checkEligibilityService,
  getEligibleDepartmentsService,
  getEligibleBatchesService,
} from '../services/collegeEligibilities.service.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/responseHandler.js';
import { pool } from '../config/db.js';
import { resolveUserIntId } from '../utils/userResolver.js';

// ─── Helper: resolve college_id from the logged-in user ──────────────────────
const getCollegeId = async (user) => {
  if (!user || user.role !== 'college') return null;
  try {
    const intId = await resolveUserIntId(user.userId);
    const res = await pool.query('SELECT id FROM colleges WHERE user_id = $1', [intId]);
    return res.rows[0]?.id ?? null;
  } catch {
    return null;
  }
};

// GET /api/nominations/eligible
export const getEligibleStudents = async (req, res, next) => {
  try {
    const collegeId = await getCollegeId(req.user);
    const { students, pagination } = await getEligibleStudentsService(req.query, collegeId);
    return paginatedResponse(res, students, pagination, 'Eligible students fetched successfully');
  } catch (err) {
    next(err);
  }
};

// GET /api/nominations/eligible/:studentId/check
export const checkEligibility = async (req, res, next) => {
  try {
    const student = await checkEligibilityService(req.params.studentId);
    if (!student) return errorResponse(res, 'Student is not eligible', 400);
    return successResponse(res, student, 'Student is eligible');
  } catch (err) {
    next(err);
  }
};

// GET /api/nominations/eligible/departments
export const getEligibleDepartments = async (req, res, next) => {
  try {
    const collegeId = await getCollegeId(req.user);
    const departments = await getEligibleDepartmentsService(collegeId);
    return successResponse(res, departments, 'Departments fetched successfully');
  } catch (err) {
    next(err);
  }
};

// GET /api/nominations/eligible/batches
export const getEligibleBatches = async (req, res, next) => {
  try {
    const collegeId = await getCollegeId(req.user);
    const batches = await getEligibleBatchesService(collegeId);
    return successResponse(res, batches, 'Batches fetched successfully');
  } catch (err) {
    next(err);
  }
};
