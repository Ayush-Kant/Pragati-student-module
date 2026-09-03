import { pool } from "../../config/db.js";
import { resolveStudentUserId } from "../utils/studentReferenceResolver.js";
import dailyService from "../../services/daily.service.js";

const durationMinutes = (value) => {
  const match = String(value || '').match(/\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : 0;
};

export const getAllSessions = async (studentId, filters = {}) => {
  const resolvedStudentId = await resolveStudentUserId(pool, studentId);
  if (!resolvedStudentId) throw new Error("Student not found");

  const values = [resolvedStudentId];
  const conditions = [];
  const status = filters.status;
  if (status === 'upcoming') conditions.push("ls.status IN ('Upcoming','Scheduled','Live')");
  if (status === 'past') conditions.push("ls.status = 'Completed'");
  const limit = Math.min(Math.max(Number(filters.limit) || 50, 1), 100);
  const page = Math.max(Number(filters.page) || 1, 1);
  const offset = (page - 1) * limit;

  const result = await pool.query(
    `SELECT ls.id, ls.mentor_id AS "mentorId", ls.title, ls.session_type AS "sessionType",
            ls.scheduled_at AS "scheduledAt", ls.trainer, ls.date, ls.time, ls.duration, ls.status,
            ls.meeting_url AS "meetingUrl", ls.room_name AS "roomName", ls.created_at AS "createdAt",
            COALESCE(sa.attended, FALSE) AS attended,
            COALESCE(sa.status, 'Absent') AS "attendanceStatus",
            sa.attended_at AS "attendedAt",
            sr.recording_url AS "recordingUrl"
     FROM live_sessions ls
     LEFT JOIN session_attendance sa ON sa.session_id = ls.id AND sa.student_id = $1
     LEFT JOIN LATERAL (
       SELECT recording_url FROM session_recordings WHERE session_id = ls.id ORDER BY created_at DESC LIMIT 1
     ) sr ON TRUE
     ${conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''}
     ORDER BY COALESCE(ls.scheduled_at, ls.created_at) ASC
     LIMIT $2 OFFSET $3`,
    [resolvedStudentId, limit, offset],
  );

  return result.rows.map((row) => {
    const start = row.scheduledAt ? new Date(row.scheduledAt) : null;
    const mins = durationMinutes(row.duration);
    const joinableAt = start && !Number.isNaN(start.getTime()) ? new Date(start.getTime() - 10 * 60 * 1000) : null;
    return {
      id: row.id,
      sessionId: row.id,
      mentorId: row.mentorId,
      title: row.title,
      sessionType: row.sessionType,
      category: row.sessionType,
      mentor: row.trainer,
      trainer: row.trainer,
      scheduledAt: row.scheduledAt,
      startTime: row.scheduledAt,
      date: row.date,
      time: row.time,
      duration: row.duration,
      durationMinutes: mins,
      status: row.status,
      attended: row.status === 'Completed' ? Boolean(row.attended) : null,
      attendanceStatus: row.status === 'Completed' ? row.attendanceStatus : null,
      attendedAt: row.attendedAt,
      joinableAt: joinableAt?.toISOString() || null,
      joinable: row.status === 'Live' || (joinableAt && Date.now() >= joinableAt.getTime() && row.status !== 'Completed'),
      meetingUrl: row.meetingUrl || '',
      roomName: row.roomName || null,
      recordingUrl: row.recordingUrl || null,
      createdAt: row.createdAt,
    };
  });
};

export const getSessionById = async (id, studentId = null) => {
  const values = [id];
  let studentJoin = '';
  if (studentId !== null && studentId !== undefined) {
    const resolvedStudentId = await resolveStudentUserId(pool, studentId);
    if (!resolvedStudentId) return null;
    values.push(resolvedStudentId);
    studentJoin = `LEFT JOIN session_attendance sa ON sa.session_id = ls.id AND sa.student_id = $2
                   LEFT JOIN LATERAL (SELECT recording_url FROM session_recordings WHERE session_id = ls.id ORDER BY created_at DESC LIMIT 1) sr ON TRUE`;
  }
  const result = await pool.query(
    `SELECT ls.id, ls.mentor_id AS "mentorId", ls.title, ls.session_type AS "sessionType",
            ls.scheduled_at AS "scheduledAt", ls.trainer, ls.date, ls.time, ls.duration, ls.status,
            ls.meeting_url AS "meetingUrl", ls.room_name AS "roomName", ls.created_at AS "createdAt"
            ${studentJoin ? `, sa.attended, sa.status AS "attendanceStatus", sa.attended_at AS "attendedAt", sr.recording_url AS "recordingUrl"` : ''}
     FROM live_sessions ls ${studentJoin}
     WHERE ls.id = $1`,
    values,
  );
  const row = result.rows[0];
  if (!row) return null;
  return {
    ...row,
    sessionId: row.id,
    mentor: row.trainer,
    startTime: row.scheduledAt,
    category: row.sessionType,
    durationMinutes: durationMinutes(row.duration),
    attended: row.attended ?? null,
    attendanceStatus: row.attendanceStatus ?? null,
    recordingUrl: row.recordingUrl ?? null,
  };
};

export const joinSession = async (sessionId, studentId, userName = 'Student', sessionDurationMinutes = 0) => {
  const resolvedStudentId = await resolveStudentUserId(pool, studentId);
  if (!resolvedStudentId) throw new Error("Student not found");

  const session = await getSessionById(sessionId, resolvedStudentId);
  if (!session) throw new Error("Session not found");

  let meetingUrl = session.meetingUrl || '';
  let roomName = session.roomName || `pragati-session-${sessionId}`;
  let token = null;

  if (process.env.DAILY_API_KEY) {
    const room = await dailyService.ensureRoom({ roomName, meetingUrl });
    roomName = room.roomName;
    meetingUrl = room.meetingUrl || meetingUrl;
    if (meetingUrl !== session.meetingUrl || roomName !== session.roomName) {
      await pool.query('UPDATE live_sessions SET room_name = $2, meeting_url = $3, updated_at = NOW() WHERE id = $1', [sessionId, roomName, meetingUrl]);
    }
    const expiresAt = new Date(Date.now() + Math.max((sessionDurationMinutes || 60) + 30, 90) * 60 * 1000);
    token = await dailyService.createParticipantToken({ roomName, userName, expiresAt });
  }

  const result = await pool.query(
    `INSERT INTO session_participants (session_id, student_id, joined_at, left_at, join_token_issued_at)
     VALUES ($1, $2, NOW(), NULL, CASE WHEN $3 IS NOT NULL THEN NOW() ELSE NULL END)
     ON CONFLICT (session_id, student_id)
     DO UPDATE SET joined_at = NOW(), left_at = NULL, duration_seconds = NULL, join_token_issued_at = CASE WHEN $3 IS NOT NULL THEN NOW() ELSE session_participants.join_token_issued_at END
     RETURNING id, session_id AS "sessionId", student_id AS "studentId", joined_at AS "joinedAt"`,
    [sessionId, resolvedStudentId, token],
  );
  return { ...result.rows[0], meetingUrl, roomName, token };
};

export const leaveSession = async (sessionId, studentId) => {
  const resolvedStudentId = await resolveStudentUserId(pool, studentId);
  if (!resolvedStudentId) throw new Error("Student not found");

  const participant = await pool.query(
    `UPDATE session_participants
     SET left_at = COALESCE(left_at, NOW()), updated_at = NOW(),
         duration_seconds = GREATEST(0, EXTRACT(EPOCH FROM (COALESCE(left_at, NOW()) - joined_at))::int)
     WHERE session_id = $1 AND student_id = $2
     RETURNING id, session_id AS "sessionId", student_id AS "studentId", joined_at AS "joinedAt", left_at AS "leftAt", duration_seconds AS "durationSeconds"`,
    [sessionId, resolvedStudentId],
  );
  const row = participant.rows[0];
  if (!row) return null;

  const session = await getSessionById(sessionId, resolvedStudentId);
  const scheduledMinutes = durationMinutes(session?.duration);
  const attended = scheduledMinutes > 0 ? row.durationSeconds >= scheduledMinutes * 60 * 0.6 : row.durationSeconds > 0;
  const status = attended ? 'Present' : 'Absent';

  await pool.query(
    `INSERT INTO session_attendance (session_id, student_id, attended, attended_at, status, join_timestamp, leave_timestamp, duration_seconds)
     VALUES ($1, $2, $3, NOW(), $4, $5, $6, $7)
     ON CONFLICT (session_id, student_id)
     DO UPDATE SET attended = EXCLUDED.attended, attended_at = EXCLUDED.attended_at, status = EXCLUDED.status,
                   join_timestamp = EXCLUDED.join_timestamp, leave_timestamp = EXCLUDED.leave_timestamp,
                   duration_seconds = EXCLUDED.duration_seconds, updated_at = NOW()`,
    [sessionId, resolvedStudentId, attended, status, row.joinedAt, row.leftAt, row.durationSeconds],
  );

  return { ...row, attended, attendanceStatus: status, requiredDurationSeconds: Math.round(scheduledMinutes * 60 * 0.6) };
};

export default { getAllSessions, getSessionById, joinSession, leaveSession };
