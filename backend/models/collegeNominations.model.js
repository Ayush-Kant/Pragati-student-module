import { pool } from '../config/db.js'

export const getAllNominations = async ({ status, company_id, limit, offset }) => {
  let whereClause = 'WHERE 1=1'
  const params = []
  let paramCount = 0

  if (status) {
    paramCount++
    whereClause += ` AND n.status = $${paramCount}`
    params.push(status)
  }

  if (company_id) {
    paramCount++
    whereClause += ` AND n.company_id = $${paramCount}`
    params.push(company_id)
  }

  const countResult = await pool.query(
    `SELECT COUNT(*) FROM student_nominations n ${whereClause}`,
    params
  )
  const total = parseInt(countResult.rows[0].count)

  const dataParams = [...params]

  paramCount++
  dataParams.push(limit)
  const limitClause = `$${paramCount}`

  paramCount++
  dataParams.push(offset)
  const offsetClause = `$${paramCount}`

  const result = await pool.query(
    `SELECT n.*, e.name as student_name, e.enrollment_no,
      e.department, e.course, e.cgpa, e.batch
    FROM student_nominations n
    JOIN eligible_students e ON n.student_id = e.id
    ${whereClause}
    ORDER BY n.nomination_date DESC
    LIMIT ${limitClause} OFFSET ${offsetClause}`,
    dataParams
  )

  return { rows: result.rows, total }
}

export const getNominationById = async (id) => {
  const result = await pool.query(
    `SELECT n.*, e.name as student_name, e.enrollment_no,
      e.department, e.course, e.cgpa
    FROM student_nominations n
    JOIN eligible_students e ON n.student_id = e.id
    WHERE n.id = $1`,
    [id]
  )
  return result.rows[0] || null
}

export const createNomination = async ({ student_id, company_id, company_name, role, package: pkg, nominated_by, remarks }) => {
  const result = await pool.query(
    `INSERT INTO student_nominations
      (student_id, company_id, company_name, role, package, nominated_by, remarks)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *`,
    [student_id, company_id, company_name, role, pkg, nominated_by, remarks]
  )
  return result.rows[0]
}

export const updateNomination = async (id, { status, remarks }) => {
  const result = await pool.query(
    `UPDATE student_nominations
    SET status = $1, remarks = $2, updated_at = CURRENT_TIMESTAMP
    WHERE id = $3
    RETURNING *`,
    [status, remarks, id]
  )
  return result.rows[0] || null
}

export const deleteNomination = async (id) => {
  const result = await pool.query(
    'DELETE FROM student_nominations WHERE id = $1 RETURNING *',
    [id]
  )
  return result.rows[0] || null
}

export const getNominatedStudents = async (company_id) => {
  const result = await pool.query(
    `SELECT n.*, e.name as student_name, e.enrollment_no,
      e.department, e.cgpa
    FROM student_nominations n
    JOIN eligible_students e ON n.student_id = e.id
    WHERE n.company_id = $1
    ORDER BY e.cgpa DESC`,
    [company_id]
  )
  return result.rows
}