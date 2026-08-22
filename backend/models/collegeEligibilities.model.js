import { pool } from '../config/db.js';
import { MIN_CGPA_FOR_ELIGIBILITY } from '../constants/collegeStudentNominations.constants.js';

// ─── Get eligible students (non-drive-scoped, global pool) ───────────────────
// eligible_students is a VIEW over the students table.
// No manual sync needed — every student in the student database is automatically
// visible here as soon as they meet the CGPA threshold.

export const getEligibleStudents = async ({ department, batch, collegeId, limit, offset }) => {
  const params = [MIN_CGPA_FOR_ELIGIBILITY];
  let idx = 1;

  let conditions = [
    `cgpa >= $${idx}`,
    `placement_status != 'Placed'`,
    `id NOT IN (
       SELECT student_id 
       FROM student_nominations
       WHERE status NOT IN ('Rejected', 'Withdrawn')
     )`,
  ];

  if (collegeId) {
    idx++;
    conditions.push(`college_id = $${idx}`);
    params.push(collegeId);
  }

  if (department && department !== 'All') {
    idx++;
    conditions.push(`department = $${idx}`);
    params.push(department);
  }

  if (batch && batch !== 'All') {
    idx++;
    conditions.push(`batch = $${idx}`);
    params.push(batch);
  }

  const whereClause = `WHERE ${conditions.join(' AND ')}`;

  // Count query
  const countResult = await pool.query(
    `SELECT COUNT(*) FROM students ${whereClause}`,
    params
  );

  const total = parseInt(countResult.rows[0].count);

  // Data query
  const dataParams = [...params, limit, offset];

  const result = await pool.query(
    `SELECT *
     FROM students
     ${whereClause}
     ORDER BY cgpa DESC
     LIMIT $${dataParams.length - 1}
     OFFSET $${dataParams.length}`,
    dataParams
  );

  return {
    rows: result.rows,
    total,
  };
};


// ─── Check if a single student is eligible ───────────────────────────────────

export const checkEligibility = async (studentId) => {
  const result = await pool.query(
    `SELECT *
     FROM eligible_students
     WHERE id = $1
     AND cgpa >= $2
     AND placement_status != 'Placed'`,
    [
      studentId,
      MIN_CGPA_FOR_ELIGIBILITY
    ]
  );

  return result.rows[0] || null;
};


// ─── Distinct departments from eligible pool ────────────────────────────────

export const getEligibleDepartments = async (collegeId = null) => {
  const params = [];
  let where = '';

  if (collegeId) {
    params.push(collegeId);
    where = 'WHERE college_id = $1';
  }

  const result = await pool.query(
    `SELECT DISTINCT department
     FROM eligible_students
     ${where}
     ORDER BY department`,
    params
  );

  return result.rows.map((r) => r.department);
};


// ─── Distinct batches from eligible pool ────────────────────────────────────

export const getEligibleBatches = async (collegeId = null) => {
  const params = [];
  let where = '';

  if (collegeId) {
    params.push(collegeId);
    where = 'WHERE college_id = $1';
  }

  const result = await pool.query(
    `SELECT DISTINCT batch
     FROM eligible_students
     ${where}
     ORDER BY batch DESC`,
    params
  );

  return result.rows.map((r) => r.batch);
};


// NOTE:
// eligible_students is a VIEW.
// Students automatically appear when they satisfy eligibility criteria.