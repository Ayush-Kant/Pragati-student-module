import { pool } from "../config/db.js";

// Get schedule for a placement drive
export const getDriveSchedule = async (driveId) => {
  const result = await pool.query(
    `SELECT 
        id, 
        drive_id, 
        timeline_events->0->>'event_name' AS event_name,
        timeline_events->0->>'event_date' AS event_date,
        timeline_events->0->>'event_time' AS event_time,
        timeline_events->0->>'venue' AS venue,
        created_at
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
     SET timeline_events = jsonb_build_array(
       jsonb_build_object('event_name', $1::text, 'event_date', $2::text, 'event_time', $3::text, 'venue', $4::text)
     )
     WHERE drive_id = $5
     RETURNING id, drive_id, created_at`,
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
      (drive_id, timeline_events)
      VALUES
      (
        $1,
        jsonb_build_array(
          jsonb_build_object('event_name', $2::text, 'event_date', $3::text, 'event_time', $4::text, 'venue', $5::text)
        )
      )
      RETURNING id, drive_id, created_at`,
      [
        driveId,
        event_name,
        event_date,
        event_time,
        venue
      ]
    );
  }

  // Format the output to match what the API expects
  return {
    ...result.rows[0],
    event_name,
    event_date,
    event_time,
    venue
  };
};