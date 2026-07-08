import { pool } from "../../config/db.js";
import { resolveStudentUserId } from "../utils/studentReferenceResolver.js";

export const getAllSessions = async () => {
  const result = await pool.query(
    `SELECT id, mentor_id AS "mentorId", title, session_type AS "sessionType", 
            scheduled_at AS "scheduledAt", trainer, date, time, duration, status, created_at AS "createdAt"
     FROM live_sessions
     ORDER BY scheduled_at DESC`
  );
  return result.rows;
};

export const getSessionById = async (id) => {
  const result = await pool.query(
    `SELECT id, mentor_id AS "mentorId", title, session_type AS "sessionType", 
            scheduled_at AS "scheduledAt", trainer, date, time, duration, status, created_at AS "createdAt"
     FROM live_sessions
     WHERE id = $1`,
    [id]
  );
  return result.rows[0] || null;
};

export const joinSession = async (sessionId, studentId) => {
  const resolvedStudentId = await resolveStudentUserId(pool, studentId);

  if (!resolvedStudentId) {
    const error = new Error("Student not found");
    error.status = 404;
    throw error;
  }

  const result = await pool.query(
    `INSERT INTO session_participants (session_id, student_id, joined_at, left_at)
     VALUES ($1, $2, NOW(), NULL)
     ON CONFLICT (session_id, student_id)
     DO UPDATE SET joined_at = NOW(), left_at = NULL
     RETURNING id, session_id AS "sessionId", student_id AS "studentId", joined_at AS "joinedAt"`,
    [sessionId, resolvedStudentId]
  );
  return result.rows[0];
};

export const leaveSession = async (sessionId, studentId) => {
  const resolvedStudentId = await resolveStudentUserId(pool, studentId);

  if (!resolvedStudentId) {
    const error = new Error("Student not found");
    error.status = 404;
    throw error;
  }

  const result = await pool.query(
    `UPDATE session_participants
     SET left_at = NOW()
     WHERE session_id = $1 AND student_id = $2
     RETURNING id, session_id AS "sessionId", student_id AS "studentId", left_at AS "leftAt"`,
    [sessionId, resolvedStudentId]
  );
  return result.rows[0] || null;
};

export default {
  getAllSessions,
  getSessionById,
  joinSession,
  leaveSession,
};
