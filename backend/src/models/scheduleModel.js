import { pool } from "../../config/db.js";


export const getSchedules = async () => {

  const result = await pool.query(
    `
    SELECT 
        ss.id,
        ss.session_id AS "sessionId",
        ss.title,
        ss.trainer,
        ss.date AS "date",
        ss.time AS "time",
        ss.duration,
        ss.status,
        ss.created_at AS "createdAt"

    FROM session_schedules ss

    ORDER BY ss.created_at DESC
    `
  );

  return result.rows;
};



export const getUpcomingSessions = async () => {

  const result = await pool.query(
    `
    SELECT 
        ss.id,
        ss.session_id AS "sessionId",
        ss.title,
        ss.trainer,
        ss.date AS "date",
        ss.time AS "time",
        ss.duration,
        ss.status,
        ss.created_at AS "createdAt"

    FROM session_schedules ss

    WHERE ss.status IN ('Upcoming','Scheduled')

    ORDER BY ss.created_at DESC
    `
  );

  return result.rows;
};



export default {
  getSchedules,
  getUpcomingSessions
};