import * as studentService from '../services/student.service.js';
import { validateStudent, validateAcademicDetails, validateSkill, validateRequestBody } from '../validators/student.validator.js';
import { pool } from '../config/db.js';

// Helper: get college details for the logged-in user
const getCollegeDetails = async (userId) => {
  try {
    const res = await pool.query('SELECT id, name FROM colleges WHERE user_id = $1', [userId]);
    return res.rows[0] || null;
  } catch {
    return null;
  }
};

// ─── GET /api/students ────────────────────────────────────────────────────────
export const getStudents = async (req, res, next) => {
  try {
    const { department, course, batch, semester, placementStatus, search, page, pageSize } = req.query;

    let collegeFilter = req.query.college;
    let collegeIdFilter = undefined;
    if (req.user.role === 'college') {
      const college = await getCollegeDetails(req.user.userId);
      // If a college user doesn't have a profile yet, they should see no students
      if (!college) return res.status(200).json({ success: true, data: [], pagination: {} });
      collegeFilter = college.name;
      collegeIdFilter = college.id;
    }

    const filters    = { department, course, batch, semester, placementStatus, search, college: collegeFilter, collegeId: collegeIdFilter };
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
    
    // Security check: If role is college, ensure this student belongs to them
    if (req.user.role === 'college') {
      const college = await getCollegeDetails(req.user.userId);
      // Fallback: Check if they match either by exact college_id (preferred) or string name
      if (result.data.collegeId !== college.id && result.data.college !== college.name) {
        return res.status(403).json({ success: false, message: 'Forbidden: Student belongs to another college' });
      }
    }
    
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// ─── POST /api/students ───────────────────────────────────────────────────────
export const createStudent = async (req, res, next) => {
  try {
    if (!validateRequestBody(req, res, validateStudent)) return;

    if (req.user.role === 'college') {
      const college = await getCollegeDetails(req.user.userId);
      if (!college) return res.status(400).json({ success: false, message: 'College profile required to add students' });
      req.body.college = college.name;
      req.body.collegeId = college.id;
    }

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
    if (req.user.role === 'college') {
      const result = await studentService.getStudent(parseInt(req.params.id));
      if (!result.success) return res.status(404).json(result);
      const college = await getCollegeDetails(req.user.userId);
      if (result.data.collegeId !== college.id && result.data.college !== college.name) return res.status(403).json({ success: false, message: 'Forbidden' });
    }

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
    if (req.user.role === 'college') {
      const result = await studentService.getStudent(parseInt(req.params.id));
      if (!result.success) return res.status(404).json(result);
      const college = await getCollegeDetails(req.user.userId);
      if (result.data.collegeId !== college.id && result.data.college !== college.name) return res.status(403).json({ success: false, message: 'Forbidden' });
    }

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
    let collegeFilter = null;
    let collegeIdFilter = undefined;
    if (req.user.role === 'college') {
      const college = await getCollegeDetails(req.user.userId);
      if (!college) return res.status(200).json({ success: true, data: [], pagination: {} });
      collegeFilter = college.name;
      collegeIdFilter = college.id;
    }
    
    // Pass collegeFilter and collegeIdFilter to searchStudents
    const result = await studentService.searchStudents(q || '', { page, pageSize, college: collegeFilter, collegeId: collegeIdFilter });
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/students/filter ─────────────────────────────────────────────────
export const filterStudents = async (req, res, next) => {
  try {
    let { department, course, batch, semester, placementStatus, college, page, pageSize } = req.query;
    let collegeIdFilter = undefined;
    
    if (req.user.role === 'college') {
      const collegeObj = await getCollegeDetails(req.user.userId);
      if (!collegeObj) return res.status(200).json({ success: true, data: [], pagination: {} });
      college = collegeObj.name;
      collegeIdFilter = collegeObj.id;
    }

    const result = await studentService.filterStudents(
      { department, course, batch, semester, placementStatus, college, collegeId: collegeIdFilter },
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
    let collegeFilter = req.query.college;
    let collegeIdFilter = undefined;
    if (req.user.role === 'college') {
      const college = await getCollegeDetails(req.user.userId);
      if (!college) return res.status(200).json({ success: true, data: {} });
      collegeFilter = college.name;
      collegeIdFilter = college.id;
    }
    
    const result = await studentService.getStatistics(collegeFilter || null, collegeIdFilter);
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
