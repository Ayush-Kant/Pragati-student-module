import {pool} from '../config/db.js'

export const getNominationStatistics = async () => {
  const result = await pool.query(`
    SELECT
      (SELECT COUNT(*) FROM eligible_students) as total_eligible,
      (SELECT COUNT(*) FROM student_nominations) as total_nominated,
      (SELECT COUNT(*) FROM student_nominations WHERE status = 'Approved') as total_approved,
      (SELECT COUNT(*) FROM student_nominations WHERE status = 'Rejected') as total_rejected,
      (SELECT COUNT(*) FROM student_nominations WHERE status = 'Pending') as total_pending,
      (SELECT COUNT(*) FROM shortlisted_students) as total_shortlisted,
      (SELECT COUNT(*) FROM shortlisted_students WHERE status = 'Selected') as total_selected
  `)
  return result.rows[0]
}

export const getCompanyWiseStatistics = async () => {
  const result = await pool.query(`
    SELECT
      company_id,
      company_name,
      COUNT(*) as total_nominations,
      COUNT(CASE WHEN status = 'Approved' THEN 1 END) as approved,
      COUNT(CASE WHEN status = 'Rejected' THEN 1 END) as rejected,
      COUNT(CASE WHEN status = 'Pending' THEN 1 END) as pending
    FROM student_nominations
    GROUP BY company_id, company_name
    ORDER BY total_nominations DESC
  `)
  return result.rows
}

export const getDepartmentWiseStatistics = async () => {
  const result = await pool.query(`
    SELECT
      e.department,
      COUNT(DISTINCT e.id) as total_eligible,
      COUNT(DISTINCT n.id) as total_nominated,
      COUNT(DISTINCT s.id) as total_shortlisted
    FROM eligible_students e
    LEFT JOIN student_nominations n ON e.id = n.student_id
    LEFT JOIN shortlisted_students s ON e.id = s.student_id
    GROUP BY e.department
    ORDER BY e.department
  `)
  return result.rows
}