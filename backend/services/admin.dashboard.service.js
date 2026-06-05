import {pool} from '../config/db.js'
const getStats = async () => {
  const [drives, students, companies, colleges] = await Promise.all([
    pool.query("SELECT COUNT(*) FROM recruitment_drives"),
    pool.query("SELECT COUNT(*) FROM users WHERE role = 'student'"),
    pool.query("SELECT COUNT(*) FROM companies"),
    pool.query("SELECT COUNT(*) FROM colleges")
  ]);

  return {
    totalDrives: parseInt(drives.rows[0].count),
    totalStudents: parseInt(students.rows[0].count),
    totalCompanies: parseInt(companies.rows[0].count),
    totalColleges: parseInt(colleges.rows[0].count)
  };
};

const getFunnel = async () => {
  const result = await pool.query(`
    SELECT stage, COUNT(*) AS count
    FROM student_drive_progress
    GROUP BY stage
  `);

  const stageMap = {};

  result.rows.forEach(row => {
    stageMap[row.stage] = parseInt(row.count);
  });

  const stages = ['applied', 'tested', 'trained', 'selected'];

  return stages.map(stage => ({
    stage: stage.charAt(0).toUpperCase() + stage.slice(1),
    count: stageMap[stage] || 0
  }));
};

const getCompanyStats = async () => {
  const result = await pool.query(`
    SELECT
      c.id,
      c.name,
      COUNT(*) FILTER (WHERE sdp.stage = 'selected') AS total_hired,
      COUNT(DISTINCT rd.id)
      FILTER (WHERE rd.status = 'active') AS active_drives
    FROM companies c
    LEFT JOIN recruitment_drives rd
      ON rd.company_id = c.id
    LEFT JOIN student_drive_progress sdp
      ON sdp.company_id = c.id
    GROUP BY c.id, c.name
    ORDER BY total_hired DESC
  `);

  return result.rows.map(company => ({
    companyId: `cmp_${company.id}`,
    name: company.name,
    totalHired: parseInt(company.total_hired),
    activeDrives: parseInt(company.active_drives)
  }));
};

const getCollegePerformance = async () => {
  const result = await pool.query(`
    SELECT
      col.id,
      col.name,
      COUNT(sdp.student_id) AS total_students,
      COUNT(*) FILTER (WHERE sdp.stage = 'selected') AS selected
    FROM colleges col
    LEFT JOIN student_drive_progress sdp
      ON sdp.college_id = col.id
    GROUP BY col.id, col.name
  `);

  const colleges = result.rows.map(college => {
    const totalStudents = parseInt(college.total_students);
    const selected = parseInt(college.selected);

    const selectionRate =
      totalStudents === 0
        ? 0
        : Number(((selected / totalStudents) * 100).toFixed(1));

    return {
      collegeId: `col_${college.id}`,
      name: college.name,
      totalStudents,
      selected,
      selectionRate
    };
  });

  colleges.sort((a, b) => b.selectionRate - a.selectionRate);

  return colleges;
};

const getActivityFeed = async () => {
  const result = await pool.query(`
    SELECT
      aal.id,
      aal.action,
      aal.target_type,
      aal.target_id,
      u.full_name AS performed_by,
      aal.created_at
    FROM admin_audit_log aal
    JOIN users u
      ON u.id = aal.admin_id
    ORDER BY aal.created_at DESC
    LIMIT 10
  `);

  return result.rows.map(log => ({
    logId: `log_${log.id}`,
    action: log.action,
    targetType: log.target_type,
    targetId: log.target_id,
    performedBy: log.performed_by,
    createdAt: log.created_at
  }));
};

export {
  getStats,
  getFunnel,
  getCompanyStats,
  getCollegePerformance,
  getActivityFeed
};