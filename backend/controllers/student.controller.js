import * as studentService from '../services/student.service.js';
import { validateStudent, validateAcademicDetails, validateSkill, validateRequestBody } from '../validators/student.validator.js';
import { pool } from '../config/db.js';

// Helper: get college name for the logged-in user
const getCollegeName = async (userId) => {
  try {
    const res = await pool.query('SELECT name FROM colleges WHERE user_id = $1', [userId]);
    return res.rows[0]?.name || null;
  } catch {
    return null;
  }
};

// ─── GET /api/students ────────────────────────────────────────────────────────
export const getStudents = async (req, res, next) => {
  try {
    const { department, course, batch, semester, placementStatus, search, page, pageSize } = req.query;

    // Scope to the logged-in college automatically
    const collegeName = await getCollegeName(req.user.userId);
    const filters    = { department, course, batch, semester, placementStatus, search, college: collegeName || undefined };
    const pagination = { page, pageSize };

    const result = await studentService.getStudents(filters, pagination);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/students/:id ────────────────────────────────────────────────────
export const getStudentById = async (req, res, next) => {
  try {
    const result = await studentService.getStudent(parseInt(req.params.id));
    if (!result.success) return res.status(404).json(result);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// ─── POST /api/students ───────────────────────────────────────────────────────
export const createStudent = async (req, res, next) => {
  try {
    if (!validateRequestBody(req, res, validateStudent)) return;

    // Auto-attach the college name from the logged-in user's profile
    const collegeName = await getCollegeName(req.user.userId);
    if (collegeName) req.body.college = collegeName;

    const result = await studentService.addStudent(req.body);
    if (!result.success) return res.status(409).json(result);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

// ─── PUT /api/students/:id ────────────────────────────────────────────────────
export const updateStudent = async (req, res, next) => {
  try {
    const result = await studentService.editStudent(parseInt(req.params.id), req.body);
    if (!result.success) return res.status(404).json(result);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// ─── DELETE /api/students/:id ─────────────────────────────────────────────────
export const deleteStudent = async (req, res, next) => {
  try {
    const result = await studentService.removeStudent(parseInt(req.params.id));
    if (!result.success) return res.status(404).json(result);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/students/search?q=... ──────────────────────────────────────────
export const searchStudents = async (req, res, next) => {
  try {
    const { q, page, pageSize } = req.query;
    const result = await studentService.searchStudents(q || '', { page, pageSize });
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/students/filter ─────────────────────────────────────────────────
export const filterStudents = async (req, res, next) => {
  try {
    const { department, course, batch, semester, placementStatus, college, page, pageSize } = req.query;
    const result = await studentService.filterStudents(
      { department, course, batch, semester, placementStatus, college },
      { page, pageSize }
    );
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/students/statistics ─────────────────────────────────────────────
export const getStudentStatistics = async (req, res, next) => {
  try {
    const { college } = req.query;
    const result = await studentService.getStatistics(college || null);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/students/:id/academic ───────────────────────────────────────────
export const getAcademicDetails = async (req, res, next) => {
  try {
    const result = await studentService.getAcademicDetails(parseInt(req.params.id));
    if (!result.success) return res.status(404).json(result);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// ─── PUT /api/students/:id/academic ──────────────────────────────────────────
export const updateAcademicDetails = async (req, res, next) => {
  try {
    if (!validateRequestBody(req, res, validateAcademicDetails)) return;

    const result = await studentService.updateAcademicDetails(parseInt(req.params.id), req.body);
    if (!result.success) return res.status(404).json(result);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/students/:id/skills ─────────────────────────────────────────────
export const getStudentSkills = async (req, res, next) => {
  try {
    const result = await studentService.getStudentSkills(parseInt(req.params.id));
    if (!result.success) return res.status(404).json(result);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// ─── POST /api/students/:id/skills ────────────────────────────────────────────
export const addStudentSkill = async (req, res, next) => {
  try {
    if (!validateRequestBody(req, res, validateSkill)) return;
    const result = await studentService.addStudentSkill(parseInt(req.params.id), req.body.skillName);
    if (!result.success) return res.status(404).json(result);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

// ─── DELETE /api/students/:id/skills/:skillId ─────────────────────────────────
export const deleteStudentSkill = async (req, res, next) => {
  try {
    const result = await studentService.deleteStudentSkill(
      parseInt(req.params.id),
      parseInt(req.params.skillId)
    );
    if (!result.success) return res.status(404).json(result);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
