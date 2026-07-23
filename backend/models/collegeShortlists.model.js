import { pool } from '../config/db.js'

export const getShortlistedStudents = async ({ company_id, status, limit, offset }) => {
  let whereClause = 'WHERE 1=1'
  const params = []
  let paramCount = 0

  if (company_id) {
    paramCount++
    whereClause += ` AND s.company_id = $${paramCount}`
    params.push(company_id)
  }

  if (status) {
    paramCount++
    whereClause += ` AND s.status = $${paramCount}`
    params.push(status)
  }

  const countResult = await pool.query(
    `SELECT COUNT(*) FROM shortlisted_students s ${whereClause}`,
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
    `SELECT s.*, e.name as student_name, e.enrollment_no,
      e.department, e.course, e.cgpa, e.batch
    FROM shortlisted_students s
    JOIN eligible_students e ON s.student_id = e.id
    ${whereClause}
    ORDER BY s.shortlist_date DESC
    LIMIT ${limitClause} OFFSET ${offsetClause}`,
    dataParams
  )

  return { rows: result.rows, total }
}

export const updateShortlist = async (id, { status, round, remarks }) => {
  const result = await pool.query(
    `UPDATE shortlisted_students
    SET status = $1, round = $2, remarks = $3, updated_at = CURRENT_TIMESTAMP
    WHERE id = $4
    RETURNING *`,
    [status, round, remarks, id]
  )
  return result.rows[0] || null
}

export const removeShortlistedStudent = async (id) => {
  const result = await pool.query(
    'DELETE FROM shortlisted_students WHERE id = $1 RETURNING *',
    [id]
  )
  return result.rows[0] || null
}

export const createShortlist = async ({ nomination_id, student_id, company_id, company_name, round, remarks }) => {
  const result = await pool.query(
    `INSERT INTO shortlisted_students
      (nomination_id, student_id, company_id, company_name, round, remarks)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *`,
    [nomination_id, student_id, company_id, company_name, round, remarks]
  )
  return result.rows[0]
}