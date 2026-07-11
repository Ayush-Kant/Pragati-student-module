import { pool } from "../config/db.js";

export const getEligibilityCriteria = async (driveId) => {
  const result = await pool.query(
    "SELECT * FROM drive_eligibility WHERE drive_id = $1",
    [driveId]
  );
  return result.rows[0];
};

export const createEligibilityCriteria = async (driveId, data) => {
  const { minimum_cgpa, eligible_departments } = data;
  const result = await pool.query(
    `INSERT INTO drive_eligibility (drive_id, minimum_cgpa, eligible_departments)
     VALUES ($1, $2, $3) RETURNING *`,
    [driveId, minimum_cgpa, eligible_departments]
  );
  return result.rows[0];
};

export const updateEligibilityCriteria = async (driveId, data) => {
  const { minimum_cgpa, eligible_departments } = data;
  const result = await pool.query(
    `UPDATE drive_eligibility
     SET minimum_cgpa = $1, eligible_departments = $2
     WHERE drive_id = $3 RETURNING *`,
    [minimum_cgpa, eligible_departments, driveId]
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
