import { pool } from '../config/db.js';

// ─── Helper to build parameterized WHERE clauses ─────────────────────────────
const buildFilter = (filters) => {
  const conditions = [];
  const values = [];

  if (filters.department) {
    conditions.push(`department ILIKE $${values.length + 1}`);
    values.push(`%${filters.department}%`);
  }
  if (filters.course) {
    conditions.push(`course ILIKE $${values.length + 1}`);
    values.push(`%${filters.course}%`);
  }
  if (filters.batch) {
    conditions.push(`batch = $${values.length + 1}`);
    values.push(filters.batch);
  }
  if (filters.semester) {
    conditions.push(`semester = $${values.length + 1}`);
    values.push(parseInt(filters.semester));
  }
  if (filters.placementStatus) {
    conditions.push(`placement_status = $${values.length + 1}`);
    values.push(filters.placementStatus);
  }
  if (filters.college) {
    conditions.push(`college ILIKE $${values.length + 1}`);
    values.push(`%${filters.college}%`);
  }
  if (filters.search) {
    conditions.push(
      `(name ILIKE $${values.length + 1} OR email ILIKE $${values.length + 1} OR enrollment_no ILIKE $${values.length + 1})`
    );
    values.push(`%${filters.search}%`);
  }

  return {
    whereClause: conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '',
    values,
  };
};

// ─── Format a DB row into the API response shape ─────────────────────────────
const formatStudent = (row, skills = []) => ({
  id:              row.id,
  enrollmentNo:    row.enrollment_no,
  name:            row.name,
  email:           row.email,
  phone:           row.phone,
  department:      row.department,
  course:          row.course,
  semester:        row.semester,
  batch:           row.batch,
  cgpa:            row.cgpa !== null ? parseFloat(row.cgpa) : null,
  placementStatus: row.placement_status,
  address:         row.address,
  resumeStatus:    row.resume_status,
  linkedin:        row.linkedin,
  github:          row.github,
  placedAt:        row.placed_at,
  package:         row.package,
  college:         row.college,
  skills:          skills,
  createdAt:       row.created_at,
  updatedAt:       row.updated_at,
});

// ─── Get skills for a student ─────────────────────────────────────────────────
const getSkillsForStudent = async (studentId) => {
  const result = await pool.query(
    'SELECT skill_name FROM student_skills WHERE student_id = $1 ORDER BY id',
    [studentId]
  );
  return result.rows.map((r) => r.skill_name);
};

// ─── Get all students with optional filters & pagination ──────────────────────
export const getAllStudents = async (filters = {}, pagination = {}) => {
  const { whereClause, values } = buildFilter(filters);
  const page     = parseInt(pagination.page) || 1;
  const pageSize = parseInt(pagination.pageSize) || 1000;
  const offset   = (page - 1) * pageSize;

  const countResult = await pool.query(
    `SELECT COUNT(*) FROM students ${whereClause}`,
    values
  );
  const total = parseInt(countResult.rows[0].count);

  const dataResult = await pool.query(
    `SELECT * FROM students ${whereClause} ORDER BY created_at DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`,
    [...values, pageSize, offset]
  );

  const students = await Promise.all(
    dataResult.rows.map(async (row) => {
      const skills = await getSkillsForStudent(row.id);
      return formatStudent(row, skills);
    })
  );

  return { students, total, page, pageSize };
};

// ─── Get single student by id ─────────────────────────────────────────────────
export const getStudentById = async (id) => {
  const result = await pool.query('SELECT * FROM students WHERE id = $1', [id]);
  if (!result.rows[0]) return null;
  const skills = await getSkillsForStudent(id);
  return formatStudent(result.rows[0], skills);
};

// ─── Check if enrollment_no or email already exists ──────────────────────────
export const checkDuplicate = async (enrollmentNo, email, excludeId = null) => {
  let query = 'SELECT id FROM students WHERE (enrollment_no = $1 OR email = $2)';
  const values = [enrollmentNo, email];
  if (excludeId) {
    query += ` AND id != $3`;
    values.push(excludeId);
  }
  const result = await pool.query(query, values);
  return result.rows[0] || null;
};

// ─── Create student + skills ──────────────────────────────────────────────────
export const createStudent = async (data, skills = []) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const insertResult = await client.query(
      `INSERT INTO students
        (enrollment_no, name, email, phone, department, course, semester, batch,
         cgpa, placement_status, address, resume_status, linkedin, github,
         placed_at, package, college)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
       RETURNING *`,
      [
        data.enrollmentNo,
        data.name,
        data.email,
        data.phone || null,
        data.department || null,
        data.course || null,
        data.semester ? parseInt(data.semester) : null,
        data.batch || null,
        data.cgpa ? parseFloat(data.cgpa) : null,
        data.placementStatus || 'Not Eligible',
        data.address || null,
        data.resumeStatus || 'Not Uploaded',
        data.linkedin || null,
        data.github || null,
        data.placedAt || null,
        data.package || null,
        data.college || null,
      ]
    );

    const student = insertResult.rows[0];

    if (skills.length > 0) {
      const skillInserts = skills.map((skill, i) =>
        client.query(
          'INSERT INTO student_skills (student_id, skill_name) VALUES ($1, $2)',
          [student.id, skill]
        )
      );
      await Promise.all(skillInserts);
    }

    await client.query('COMMIT');
    return formatStudent(student, skills);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

// ─── Update student + skills ──────────────────────────────────────────────────
export const updateStudent = async (id, data, skills) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const updateResult = await client.query(
      `UPDATE students SET
        enrollment_no    = COALESCE($1, enrollment_no),
        name             = COALESCE($2, name),
        email            = COALESCE($3, email),
        phone            = COALESCE($4, phone),
        department       = COALESCE($5, department),
        course           = COALESCE($6, course),
        semester         = COALESCE($7, semester),
        batch            = COALESCE($8, batch),
        cgpa             = COALESCE($9, cgpa),
        placement_status = COALESCE($10, placement_status),
        address          = COALESCE($11, address),
        resume_status    = COALESCE($12, resume_status),
        linkedin         = COALESCE($13, linkedin),
        github           = COALESCE($14, github),
        placed_at        = COALESCE($15, placed_at),
        package          = COALESCE($16, package),
        college          = COALESCE($17, college),
        updated_at       = CURRENT_TIMESTAMP
       WHERE id = $18
       RETURNING *`,
      [
        data.enrollmentNo || null,
        data.name || null,
        data.email || null,
        data.phone !== undefined ? data.phone : null,
        data.department !== undefined ? data.department : null,
        data.course !== undefined ? data.course : null,
        data.semester !== undefined ? parseInt(data.semester) : null,
        data.batch !== undefined ? data.batch : null,
        data.cgpa !== undefined ? parseFloat(data.cgpa) : null,
        data.placementStatus !== undefined ? data.placementStatus : null,
        data.address !== undefined ? data.address : null,
        data.resumeStatus !== undefined ? data.resumeStatus : null,
        data.linkedin !== undefined ? data.linkedin : null,
        data.github !== undefined ? data.github : null,
        data.placedAt !== undefined ? data.placedAt : null,
        data.package !== undefined ? data.package : null,
        data.college !== undefined ? data.college : null,
        id,
      ]
    );

    if (!updateResult.rows[0]) {
      await client.query('ROLLBACK');
      return null;
    }

    // If skills are provided, replace them
    if (Array.isArray(skills)) {
      await client.query('DELETE FROM student_skills WHERE student_id = $1', [id]);
      if (skills.length > 0) {
        const skillInserts = skills.map((skill) =>
          client.query(
            'INSERT INTO student_skills (student_id, skill_name) VALUES ($1, $2)',
            [id, skill]
          )
        );
        await Promise.all(skillInserts);
      }
    }

    await client.query('COMMIT');
    const finalSkills = Array.isArray(skills) ? skills : await getSkillsForStudent(id);
    return formatStudent(updateResult.rows[0], finalSkills);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

// ─── Delete student ───────────────────────────────────────────────────────────
export const deleteStudent = async (id) => {
  const result = await pool.query(
    'DELETE FROM students WHERE id = $1 RETURNING id',
    [id]
  );
  return result.rows[0] || null;
};

// ─── Get student statistics ───────────────────────────────────────────────────
export const getStudentStatistics = async (college = null) => {
  const whereClause = college ? 'WHERE college ILIKE $1' : '';
  const values      = college ? [`%${college}%`] : [];

  const result = await pool.query(
    `SELECT
       COUNT(*)                                        AS total,
       COUNT(*) FILTER (WHERE placement_status = 'Placed')        AS placed,
       COUNT(*) FILTER (WHERE placement_status = 'Eligible')      AS eligible,
       COUNT(*) FILTER (WHERE placement_status = 'Not Eligible')  AS not_eligible,
       ROUND(AVG(cgpa)::numeric, 2)                   AS avg_cgpa
     FROM students ${whereClause}`,
    values
  );

  const row = result.rows[0];
  const total = parseInt(row.total);
  return {
    total,
    placed:       parseInt(row.placed),
    eligible:     parseInt(row.eligible),
    notEligible:  parseInt(row.not_eligible),
    placementRate: total > 0 ? Math.round((parseInt(row.placed) / total) * 100) : 0,
    avgCgpa:      parseFloat(row.avg_cgpa) || 0,
  };
};

// ─── Academic Details ─────────────────────────────────────────────────────────
export const getAcademicDetails = async (studentId) => {
  const result = await pool.query(
    'SELECT * FROM student_academic_details WHERE student_id = $1',
    [studentId]
  );
  return result.rows[0] || null;
};

export const upsertAcademicDetails = async (studentId, data) => {
  const result = await pool.query(
    `INSERT INTO student_academic_details
       (student_id, tenth_percentage, twelfth_percentage, backlogs, active_backlogs)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (student_id) DO UPDATE SET
       tenth_percentage   = EXCLUDED.tenth_percentage,
       twelfth_percentage = EXCLUDED.twelfth_percentage,
       backlogs           = EXCLUDED.backlogs,
       active_backlogs    = EXCLUDED.active_backlogs,
       updated_at         = CURRENT_TIMESTAMP
     RETURNING *`,
    [
      studentId,
      data.tenthPercentage || null,
      data.twelfthPercentage || null,
      data.backlogs || 0,
      data.activeBacklogs || 0,
    ]
  );
  return result.rows[0];
};

// ─── Skills CRUD ──────────────────────────────────────────────────────────────
export const getStudentSkills = async (studentId) => {
  const result = await pool.query(
    'SELECT * FROM student_skills WHERE student_id = $1 ORDER BY id',
    [studentId]
  );
  return result.rows;
};

export const addStudentSkill = async (studentId, skillName) => {
  const result = await pool.query(
    'INSERT INTO student_skills (student_id, skill_name) VALUES ($1, $2) RETURNING *',
    [studentId, skillName]
  );
  return result.rows[0];
};

export const deleteStudentSkill = async (studentId, skillId) => {
  const result = await pool.query(
    'DELETE FROM student_skills WHERE id = $1 AND student_id = $2 RETURNING id',
    [skillId, studentId]
  );
  return result.rows[0] || null;
};
