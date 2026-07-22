import { pool } from "../config/db.js";

// Get all interview rounds for a placement drive
export const getInterviewRounds = async (driveId) => {
  const result = await pool.query(
    `SELECT *
     FROM interview_rounds
     WHERE drive_id = $1
     ORDER BY round_order ASC`,
    [driveId]
  );

  return result.rows;
};

// Create a new interview round
export const createInterviewRound = async (driveId, data) => {
  const { round_name, description, round_order } = data;

  const result = await pool.query(
    `INSERT INTO interview_rounds
    (
      drive_id,
      round_name,
      description,
      round_order
    )
    VALUES
    (
      $1,
      $2,
      $3,
      $4
    )
    RETURNING *`,
    [driveId, round_name, description, round_order]
  );

  return result.rows[0];
};

// Update an interview round
export const updateInterviewRound = async (driveId, roundId, data) => {
  const { round_name, description, round_order } = data;

  const result = await pool.query(
    `UPDATE interview_rounds
     SET
       round_name = $1,
       description = $2,
       round_order = $3
     WHERE id = $4
       AND drive_id = $5
     RETURNING *`,
    [round_name, description, round_order, roundId, driveId]
  );

  return result.rows[0];
};

// Delete an interview round
export const deleteInterviewRound = async (driveId, roundId) => {
  const result = await pool.query(
    `DELETE FROM interview_rounds
     WHERE id = $1
       AND drive_id = $2
     RETURNING *`,
    [roundId, driveId]
  );

  return result.rows[0];
};