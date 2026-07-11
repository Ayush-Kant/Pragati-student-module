import { pool } from "../config/db.js";

// Get schedule for a placement drive
export const getDriveSchedule = async (driveId) => {
  const result = await pool.query(
    `SELECT *
     FROM drive_schedule
     WHERE drive_id = $1`,
    [driveId]
  );

  return result.rows[0];
};

// Update or Insert schedule
export const updateDriveSchedule = async (driveId, data) => {
  const {
    event_name,
    event_date,
    event_time,
    venue
  } = data;

  // Try UPDATE first
  let result = await pool.query(
    `UPDATE drive_schedule
     SET
        event_name = $1,
        event_date = $2,
        event_time = $3,
        venue = $4
     WHERE drive_id = $5
     RETURNING *`,
    [
      event_name,
      event_date,
      event_time,
      venue,
      driveId
    ]
  );

  // If no schedule exists, INSERT it
  if (result.rowCount === 0) {
    result = await pool.query(
      `INSERT INTO drive_schedule
      (
        drive_id,
        event_name,
        event_date,
        event_time,
        venue
      )
      VALUES
      (
        $1,
        $2,
        $3,
        $4,
        $5
      )
      RETURNING *`,
      [
        driveId,
        event_name,
        event_date,
        event_time,
        venue
      ]
    );
  }

  return result.rows[0];
};