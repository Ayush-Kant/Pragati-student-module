import * as studentService from '../services/student.service.js';
import { validateStudent, validateAcademicDetails, validateSkill, validateRequestBody } from '../validators/student.validator.js';
import { pool } from '../config/db.js';
import { resolveUserIntId } from '../utils/userResolver.js';
import { MIN_CGPA_FOR_ELIGIBILITY } from '../constants/collegeStudentNominations.constants.js';

// Helper: get college details for the logged-in user
const getCollegeDetails = async (userId) => {
  try {
    const intUserId = await resolveUserIntId(userId);
    const res = await pool.query('SELECT id, name FROM colleges WHERE user_id = $1', [intUserId]);
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

    const filters = { department, course, batch, semester, placementStatus, search, college: collegeFilter, collegeId: collegeIdFilter };
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

// ─── GET /api/students/eligible-pool ─────────────────────────────────────────
// Returns students from the eligible_students VIEW scoped to the college,
// with optional filters for the nomination page (no drive selected).
// Query params: ?department=&batch=&search=&page=&pageSize=
export const getEligiblePool = async (req, res, next) => {
  try {
    const { department, batch, search, page = 1, pageSize = 100 } = req.query;

    // Build college scope
    let collegeId = null;
    if (req.user.role === 'college') {
      const college = await getCollegeDetails(req.user.userId);
      if (!college) return res.status(200).json({ success: true, data: [], pagination: {} });
      collegeId = college.id;
    }

    const params = [MIN_CGPA_FOR_ELIGIBILITY];
    let idx = 1;
    const conditions = [
      `s.cgpa >= $${idx}`,
      `s.placement_status != 'Placed'`,
    ];

    if (collegeId) {
      idx++;
      conditions.push(`s.college_id = $${idx}`);
      params.push(collegeId);
    }
    if (department) {
      idx++;
      conditions.push(`s.department ILIKE $${idx}`);
      params.push(`%${department}%`);
    }
    if (batch) {
      idx++;
      conditions.push(`s.batch = $${idx}`);
      params.push(batch);
    }
    if (search) {
      idx++;
      conditions.push(
        `(s.name ILIKE $${idx} OR s.enrollment_no ILIKE $${idx} OR s.email ILIKE $${idx})`
      );
      params.push(`%${search}%`);
    }

    const where = `WHERE ${conditions.join(' AND ')}`;
    const limit = parseInt(pageSize);
    const offset = (parseInt(page) - 1) * limit;

    const countRes = await pool.query(
      `SELECT COUNT(*) FROM students s ${where}`,
      params
    );
    const total = parseInt(countRes.rows[0].count);

    const dataRes = await pool.query(
      `SELECT
         s.id,
         s.id            AS student_id,
         s.enrollment_no,
         s.name,
         s.email,
         s.phone,
         s.department,
         s.course,
         s.semester,
         s.batch,
         s.cgpa,
         s.placement_status,
         s.college,
         s.college_id,
         s.linkedin,
         s.github,
         s.resume_status,
         COALESCE(
           ARRAY(SELECT skill_name FROM student_skills sk WHERE sk.student_id = s.id ORDER BY sk.id),
           '{}'::TEXT[]
         ) AS skills,
         -- mark students already nominated (any active nomination)
         EXISTS (
           SELECT 1 FROM student_nominations sn
           WHERE sn.student_id = s.id
             AND sn.status NOT IN ('Rejected','Withdrawn')
         ) AS already_nominated
       FROM students s
       ${where}
       ORDER BY s.cgpa DESC
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, limit, offset]
    );

    return res.status(200).json({
      success: true,
      data: dataRes.rows,
      pagination: {
        total,
        page: parseInt(page),
        pageSize: limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};
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
