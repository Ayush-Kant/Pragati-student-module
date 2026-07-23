import { pool } from '../config/db.js'
import { MIN_CGPA_FOR_ELIGIBILITY } from '../constants/collegeStudentNominations.constants.js'

export const getEligibleStudents = async ({ department, batch, limit, offset }) => {
  let whereClause = `WHERE cgpa >= $1 AND placement_status != 'Placed'`
  const params = [MIN_CGPA_FOR_ELIGIBILITY]
  let paramCount = 1

  if (department && department !== 'All') {
    paramCount++
    whereClause += ` AND department = $${paramCount}`
    params.push(department)
  }

  if (batch && batch !== 'All') {
    paramCount++
    whereClause += ` AND batch = $${paramCount}`
    params.push(batch)
  }

  // Count query — separate and clean
  const countResult = await pool.query(
    `SELECT COUNT(*) FROM eligible_students ${whereClause}`,
    params
  )
  const total = parseInt(countResult.rows[0].count)

  // Data query with pagination
  const dataParams = [...params]

  paramCount++
  dataParams.push(limit)
  const limitClause = `$${paramCount}`

  paramCount++
  dataParams.push(offset)
  const offsetClause = `$${paramCount}`

  const result = await pool.query(
    `SELECT * FROM eligible_students
     ${whereClause}
     ORDER BY cgpa DESC
     LIMIT ${limitClause} OFFSET ${offsetClause}`,
    dataParams
  )

  return { rows: result.rows, total }
}

export const checkEligibility = async (studentId) => {
  const result = await pool.query(
    'SELECT * FROM eligible_students WHERE id = $1 AND cgpa >= $2',
    [studentId, MIN_CGPA_FOR_ELIGIBILITY]
  )
  return result.rows[0] || null
}

export const getEligibleDepartments = async () => {
  const result = await pool.query(
    'SELECT DISTINCT department FROM eligible_students ORDER BY department'
  )
  return result.rows.map(r => r.department)
}

export const getEligibleBatches = async () => {
  const result = await pool.query(
    'SELECT DISTINCT batch FROM eligible_students ORDER BY batch DESC'
  )
  return result.rows.map(r => r.batch)
}