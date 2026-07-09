import { pool } from "../../config/db.js";


export const getSchedules = async () => {

  const result = await pool.query(
    `
    SELECT 
        ss.id,
        ss.session_id AS "sessionId",

        ls.title,
        ls.trainer,

        ls.date AS "date",
        ls.time AS "time",
        ls.duration,

        ss.status,
        ss.created_at AS "createdAt"

    FROM session_schedules ss

    JOIN live_sessions ls
    ON ss.session_id = ls.id

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

        ls.title,
        ls.trainer,

        ls.date AS "date",
        ls.time AS "time",
        ls.duration,

        ss.status,
        ss.created_at AS "createdAt"

    FROM session_schedules ss

    JOIN live_sessions ls
    ON ss.session_id = ls.id

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