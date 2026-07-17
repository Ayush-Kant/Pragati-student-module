import { pool } from '../../../config/db.js';

export const listCompanyDrives = async (companyId) => {
  const query = `
    SELECT 
      id::text AS "driveId",
      job_title AS "jobTitle",
      department,
      required_skills AS "requiredSkills",
      salary_package AS "salaryPackage",
      work_mode AS "workMode",
      location,
      deadline,
      UPPER(status) AS "status",
      UPPER(current_stage) AS "currentStage",
      frozen,
      (SELECT COUNT(*)::int FROM student_drive_progress WHERE drive_id = recruitment_drives.id) AS "candidateCount"
    FROM recruitment_drives
    WHERE company_id = $1
    ORDER BY created_at DESC
  `;
  const result = await pool.query(query, [companyId]);
  return result.rows;
};

export const createCompanyDrive = async (companyId, driveData) => {
  const query = `
    INSERT INTO recruitment_drives (
      company_id, job_title, department, required_skills, salary_package, work_mode, location, deadline
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id::text AS "driveId"
  `;
  const result = await pool.query(query, [
    companyId,
    driveData.jobTitle,
    driveData.department || '',
    driveData.requiredSkills || [],
    driveData.salaryPackage || '',
    driveData.workMode || 'Onsite',
    driveData.location || '',
    driveData.deadline || null
  ]);
  return result.rows[0];
};

export const getCompanyDriveById = async (companyId, driveId) => {
  const query = `
    SELECT 
      id::text AS "driveId",
      job_title AS "jobTitle",
      department,
      required_skills AS "requiredSkills",
      salary_package AS "salaryPackage",
      work_mode AS "workMode",
      location,
      deadline,
      UPPER(status) AS "status",
      UPPER(current_stage) AS "currentStage",
      frozen,
      (SELECT COUNT(*)::int FROM student_drive_progress WHERE drive_id = recruitment_drives.id) AS "candidateCount"
    FROM recruitment_drives
    WHERE company_id = $1 AND id = $2
  `;
  const result = await pool.query(query, [companyId, driveId]);
  return result.rows[0] || null;
};

export const updateCompanyDrive = async (companyId, driveId, driveData) => {
  const query = `
    UPDATE recruitment_drives
    SET 
      job_title = COALESCE($3, job_title),
      department = COALESCE($4, department),
      required_skills = COALESCE($5, required_skills),
      salary_package = COALESCE($6, salary_package),
      work_mode = COALESCE($7, work_mode),
      location = COALESCE($8, location),
      deadline = COALESCE($9, deadline),
      updated_at = NOW()
    WHERE company_id = $1 AND id = $2
    RETURNING id::text AS "driveId"
  `;
  const result = await pool.query(query, [
    companyId,
    driveId,
    driveData.jobTitle || null,
    driveData.department || null,
    driveData.requiredSkills || null,
    driveData.salaryPackage || null,
    driveData.workMode || null,
    driveData.location || null,
    driveData.deadline || null
  ]);
  return result.rows.length > 0;
};

export const closeCompanyDrive = async (companyId, driveId) => {
  const query = `
    UPDATE recruitment_drives
    SET status = 'closed', updated_at = NOW()
    WHERE company_id = $1 AND id = $2
    RETURNING id::text AS "driveId"
  `;
  const result = await pool.query(query, [companyId, driveId]);
  return result.rows.length > 0;
};

export const pauseCompanyDrive = async (companyId, driveId) => {
  const query = `
    UPDATE recruitment_drives
    SET status = 'paused', updated_at = NOW()
    WHERE company_id = $1 AND id = $2
    RETURNING id::text AS "driveId"
  `;
  const result = await pool.query(query, [companyId, driveId]);
  return result.rows.length > 0;
};

export const listCompanyDriveCandidates = async (companyId, driveId) => {
  const query = `
    SELECT 
      s.id::text AS "candidateId",
      s.name,
      UPPER(sdp.stage) AS "status"
    FROM student_drive_progress sdp
    JOIN students s ON s.id = sdp.student_id
    WHERE sdp.company_id = $1 AND sdp.drive_id = $2
  `;
  const result = await pool.query(query, [companyId, driveId]);
  return result.rows;
};
