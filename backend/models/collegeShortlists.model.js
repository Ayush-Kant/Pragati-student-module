import { pool } from '../config/db.js';

// eligible_students is a VIEW over students — all JOINs work as before.

export const getShortlistedStudents = async ({ company_id, college_id, status, limit, offset }) => {
  const params = [];
  let idx = 0;
  const conditions = ['1=1'];

  if (company_id) {
    idx++;
    conditions.push(`s.company_id = $${idx}`);
    params.push(company_id);
  }

  if (status) {
    idx++;
    conditions.push(`s.status = $${idx}`);
    params.push(status);
  }

  if (college_id) {
    idx++;
    conditions.push(`e.college_id = $${idx}`);
    params.push(college_id);
  }

  const whereClause = `WHERE ${conditions.join(' AND ')}`;

  const countResult = await pool.query(
    `SELECT COUNT(*)
     FROM shortlisted_students s
     JOIN eligible_students e ON e.id = s.student_id
     ${whereClause}`,
    params
  );
  const total = parseInt(countResult.rows[0].count);

  const dataParams = [...params, limit, offset];

  const result = await pool.query(
    `SELECT
       s.*,
       e.name           AS student_name,
       e.enrollment_no,
       e.department,
       e.course,
       e.cgpa,
       e.batch,
       e.email,
       e.college_id
     FROM shortlisted_students s
     JOIN eligible_students e ON e.id = s.student_id
     ${whereClause}
     ORDER BY s.shortlist_date DESC
     LIMIT $${dataParams.length - 1} OFFSET $${dataParams.length}`,
    dataParams
  );

  return { rows: result.rows, total };
};

export const updateShortlist = async (id, { status, round, remarks }) => {
  const result = await pool.query(
    `UPDATE shortlisted_students
     SET status = $1, round = $2, remarks = $3, updated_at = CURRENT_TIMESTAMP
     WHERE id = $4
     RETURNING *`,
    [status, round, remarks, id]
  );
  return result.rows[0] || null;
};

export const removeShortlistedStudent = async (id) => {
  const result = await pool.query(
    'DELETE FROM shortlisted_students WHERE id = $1 RETURNING *',
    [id]
  );
  return result.rows[0] || null;
};

export const createShortlist = async ({
  nomination_id,
  student_id,
  company_id,
  company_name,
  round,
  remarks,
}) => {
  const result = await pool.query(
    `INSERT INTO shortlisted_students
       (nomination_id, student_id, company_id, company_name, round, remarks)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [nomination_id, student_id, company_id, company_name, round, remarks]
  );
  return result.rows[0];
};
