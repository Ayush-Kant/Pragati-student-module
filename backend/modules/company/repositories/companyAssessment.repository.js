import { pool } from "../../../config/db.js";
export const getAssessmentsRepo = async () => {
  const result = await pool.query(
    `
    SELECT *
    FROM assessments
    WHERE status != 'archived'
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
      total_marks,
      status
    )
    VALUES ($1,$2,$3,$4,$5,$6)
    RETURNING *
    `,
    [
      data.title,
      data.type || 'MCQ',
      data.difficulty || 'Medium',
      data.time_limit_minutes || 60,
      data.total_marks || 100,
      data.status || 'active',
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
      total_marks = $5,
      status = $6,
      updated_at = NOW()
    WHERE id = $7
    RETURNING *
    `,
    [
      data.title,
      data.type || 'MCQ',
      data.difficulty || 'Medium',
      data.time_limit_minutes || 60,
      data.total_marks || 100,
      data.status || 'active',
      id,
    ]
  );

  return result.rows[0];
};
export const deleteAssessmentRepo = async (id) => {
  await pool.query(
    `
    UPDATE assessments
    SET status = 'archived', archived_at = NOW()
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
    SET status = 'archived', archived_at = NOW()
    WHERE id = $1
    `,
    [id]
  );
};