import { pool } from "../../../config/db.js";
export const getAssessmentsRepo = async () => {
  const result = await pool.query(
    `
    SELECT *
    FROM assessments
    WHERE archived = false
    ORDER BY created_at DESC
    `
  );

  return result.rows;
};
export const getAssessmentByIdRepo = async (id) => {
  const result = await pool.query(
    `
    SELECT *
    FROM assessments
    WHERE id = $1
    `,
    [id]
  );

  return result.rows[0];
};
export const createAssessmentRepo = async (data) => {
  const result = await pool.query(
    `
    INSERT INTO assessments
    (
      title,
      type,
      difficulty,
      time_limit_minutes,
      total_marks
    )
    VALUES ($1,$2,$3,$4,$5)
    RETURNING *
    `,
    [
      data.title,
      data.type,
      data.difficulty,
      data.time_limit_minutes,
      data.total_marks,
    ]
  );

  return result.rows[0];
};
export const updateAssessmentRepo = async (id, data) => {
  const result = await pool.query(
    `
    UPDATE assessments
    SET
      title = $1,
      type = $2,
      difficulty = $3,
      time_limit_minutes = $4,
      total_marks = $5
    WHERE id = $6
    RETURNING *
    `,
    [
      data.title,
      data.type,
      data.difficulty,
      data.time_limit_minutes,
      data.total_marks,
      id,
    ]
  );

  return result.rows[0];
};
export const deleteAssessmentRepo = async (id) => {
  await pool.query(
    `
    UPDATE assessments
    SET archived = true
    WHERE id = $1
    `,
    [id]
  );
};
export const assignAssessmentRepo = async (
  assessmentId,
  driveId
) => {
  const result = await pool.query(
    `
    UPDATE recruitment_drives
    SET assigned_test_id = $1
    WHERE id = $2
    RETURNING *
    `,
    [assessmentId, driveId]
  );

  return result.rows[0];
};
export const archiveAssessmentRepo = async (id) => {
  await pool.query(
    `
    UPDATE assessments
    SET archived = true
    WHERE id = $1
    `,
    [id]
  );
};