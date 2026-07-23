import { pool } from "../config/db.js";

export const getEligibilityCriteria = async (driveId) => {
  const result = await pool.query(
    "SELECT id, drive_id, cgpa_cutoff AS minimum_cgpa, allowed_branches AS eligible_departments, created_at FROM drive_eligibility WHERE drive_id = $1",
    [driveId]
  );
  return result.rows[0];
};

export const createEligibilityCriteria = async (driveId, data) => {
  const { minimum_cgpa, eligible_departments } = data;
  let deps = eligible_departments;
  if (typeof deps === 'string') {
    deps = deps.split(',').map(d => d.trim());
  }
  const result = await pool.query(
    `INSERT INTO drive_eligibility (drive_id, cgpa_cutoff, allowed_branches)
     VALUES ($1, $2, $3) RETURNING id, drive_id, cgpa_cutoff AS minimum_cgpa, allowed_branches AS eligible_departments, created_at`,
    [driveId, minimum_cgpa, deps]
  );
  return result.rows[0];
};

export const updateEligibilityCriteria = async (driveId, data) => {
  const { minimum_cgpa, eligible_departments } = data;
  let deps = eligible_departments;
  if (typeof deps === 'string') {
    deps = deps.split(',').map(d => d.trim());
  }
  const result = await pool.query(
    `UPDATE drive_eligibility
     SET cgpa_cutoff = $1, allowed_branches = $2
     WHERE drive_id = $3 RETURNING id, drive_id, cgpa_cutoff AS minimum_cgpa, allowed_branches AS eligible_departments, created_at`,
    [minimum_cgpa, deps, driveId]
  );
  return result.rows[0];
};

export const deleteEligibilityCriteria = async (driveId) => {
  const result = await pool.query(
    "DELETE FROM drive_eligibility WHERE drive_id = $1 RETURNING *",
    [driveId]
  );
  return result.rows[0];
};
