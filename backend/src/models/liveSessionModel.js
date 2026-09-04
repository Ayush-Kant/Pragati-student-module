import { pool } from "../../config/db.js";
import dailyService from "../../services/daily.service.js";

const durationMinutes = (value) => {
  const match = String(value || "").match(/\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : 0;
};

const deriveSessionStatus = (session, now = Date.now()) => {
  if (!session) return "Upcoming";
  if (session.status === "Completed") return "Completed";

  const start = session.scheduledAt ? new Date(session.scheduledAt).getTime() : NaN;
  const minutes = durationMinutes(session.duration);
  if (!Number.isFinite(start)) return session.status || "Upcoming";

  const end = minutes > 0 ? start + minutes * 60 * 1000 : NaN;
  if (Number.isFinite(end) && now > end) return "Completed";
  if (now >= start && (!Number.isFinite(end) || now <= end)) return "Live";
  return session.status === "Live" ? "Upcoming" : session.status || "Upcoming";
};

const resolveDriveId = async (studentId) => {
  const tableCheck = await pool.query("SELECT to_regclass('public.student_drive_progress') AS table_name");
  if (!tableCheck.rows[0]?.table_name) return null;

  const result = await pool.query(
    `SELECT drive_id AS "driveId"
     FROM student_drive_progress
     WHERE student_id = $1
     ORDER BY stage_updated_at DESC NULLS LAST, id DESC
     LIMIT 1`,
    [studentId],
  );
  return result.rows[0]?.driveId ?? null;
};

export const getAllSessions = async (studentId, filters = {}) => {
  if (!Number.isInteger(Number(studentId)) || Number(studentId) <= 0) {
    const error = new Error("Student not found");
    error.status = 404;
    throw error;
  }

  const resolvedStudentId = Number(studentId);
  const driveId = await resolveDriveId(resolvedStudentId);
  const values = [resolvedStudentId];
  const conditions = [driveId ? `(ls.drive_id = $2 OR ls.drive_id IS NULL)` : `ls.drive_id IS NULL`];
  if (driveId) values.push(driveId);

  const status = String(filters.status || "").toLowerCase();
  if (status === "upcoming") conditions.push("ls.status IN ('Upcoming','Scheduled','Live')");
  if (status === "past" || status === "completed") conditions.push("ls.status = 'Completed'");
  if (status === "live") conditions.push("ls.status = 'Live'");

  const limit = Math.min(Math.max(Number(filters.limit) || 50, 1), 100);
  const page = Math.max(Number(filters.page) || 1, 1);
  const offset = (page - 1) * limit;
  values.push(limit, offset);
  const limitIndex = values.length - 1;
  const offsetIndex = values.length;

  const result = await pool.query(
    `SELECT ls.id,
            ls.mentor_id AS "mentorId",
            ls.title,
            ls.session_type AS "sessionType",
            ls.scheduled_at AS "scheduledAt",
            ls.trainer,
            ls.date,
            ls.time,
            ls.duration,
            ls.status,
            ls.drive_id AS "driveId",
            ls.meeting_url AS "meetingUrl",
            ls.room_name AS "roomName",
            ls.created_at AS "createdAt",
            COALESCE(sa.attended, FALSE) AS attended,
            COALESCE(sa.status, 'Absent') AS "attendanceStatus",
            sa.attended_at AS "attendedAt",
            sr.recording_url AS "recordingUrl"
     FROM live_sessions ls
     LEFT JOIN session_attendance sa
       ON sa.session_id = ls.id AND sa.student_id = $1
     LEFT JOIN LATERAL (
       SELECT recording_url
       FROM session_recordings
       WHERE session_id = ls.id
       ORDER BY created_at DESC
       LIMIT 1
     ) sr ON TRUE
     WHERE ${conditions.join(" AND ")}
     ORDER BY COALESCE(ls.scheduled_at, ls.created_at) ASC
     LIMIT $${limitIndex} OFFSET $${offsetIndex}`,
    values,
  );

  return result.rows.map((row) => {
    const status = deriveSessionStatus(row);
    const start = row.scheduledAt ? new Date(row.scheduledAt) : null;
    const mins = durationMinutes(row.duration);
    const joinableAt = start && !Number.isNaN(start.getTime())
      ? new Date(start.getTime() - 10 * 60 * 1000)
      : null;
    const endsAt = start && mins > 0
      ? new Date(start.getTime() + mins * 60 * 1000)
      : null;
    const beforeEnd = !endsAt || Date.now() <= endsAt.getTime();
    const joinable = Boolean(
      beforeEnd &&
      status !== "Completed" &&
      (status === "Live" || (joinableAt && Date.now() >= joinableAt.getTime())),
    );

    return {
      id: row.id,
      sessionId: row.id,
      driveId: row.driveId,
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
      status,
      attended: status === "Completed" ? Boolean(row.attended) : null,
      attendanceStatus: status === "Completed" ? row.attendanceStatus : null,
      attendedAt: row.attendedAt,
      joinableAt: joinableAt?.toISOString() || null,
      joinable,
      meetingUrl: row.meetingUrl || "",
      roomName: row.roomName || null,
      recordingUrl: row.recordingUrl || null,
      createdAt: row.createdAt,
    };
  });
};

export const getSessionById = async (id, studentId = null) => {
  const values = [id];
  let studentJoin = "";
  let driveCondition = "";

  if (studentId !== null && studentId !== undefined) {
    const resolvedStudentId = Number(studentId);
    if (!Number.isInteger(resolvedStudentId) || resolvedStudentId <= 0) return null;

    const driveId = await resolveDriveId(resolvedStudentId);
    values.push(resolvedStudentId);
    studentJoin = `
      LEFT JOIN session_attendance sa
        ON sa.session_id = ls.id AND sa.student_id = $2
      LEFT JOIN LATERAL (
        SELECT recording_url
        FROM session_recordings
        WHERE session_id = ls.id
        ORDER BY created_at DESC
        LIMIT 1
      ) sr ON TRUE`;

    if (driveId) {
      values.push(driveId);
      driveCondition = ` AND (ls.drive_id = $3 OR ls.drive_id IS NULL)`;
    } else {
      driveCondition = ` AND ls.drive_id IS NULL`;
    }
  }

  const result = await pool.query(
    `SELECT ls.id,
            ls.mentor_id AS "mentorId",
            ls.title,
            ls.session_type AS "sessionType",
            ls.scheduled_at AS "scheduledAt",
            ls.trainer,
            ls.date,
            ls.time,
            ls.duration,
            ls.status,
            ls.drive_id AS "driveId",
            ls.meeting_url AS "meetingUrl",
            ls.room_name AS "roomName",
            ls.created_at AS "createdAt"
            ${studentJoin ? `,
            sa.attended,
            sa.status AS "attendanceStatus",
            sa.attended_at AS "attendedAt",
            sr.recording_url AS "recordingUrl"` : ""}
     FROM live_sessions ls
     ${studentJoin}
     WHERE ls.id = $1${driveCondition}
     LIMIT 1`,
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
    status: deriveSessionStatus(row),
    durationMinutes: durationMinutes(row.duration),
    attended: row.attended ?? null,
    attendanceStatus: row.attendanceStatus ?? null,
    attendedAt: row.attendedAt ?? null,
    recordingUrl: row.recordingUrl ?? null,
    meetingUrl: row.meetingUrl || "",
    roomName: row.roomName || null,
  };
};

export const joinSession = async (
  sessionId,
  studentId,
  userName = "Student",
  sessionDurationMinutes = 0,
) => {
  const resolvedStudentId = Number(studentId);
  if (!Number.isInteger(resolvedStudentId) || resolvedStudentId <= 0) {
    const error = new Error("Student not found");
    error.status = 404;
    throw error;
  }

  const session = await getSessionById(sessionId, resolvedStudentId);
  if (!session) {
    const error = new Error("Session not found or not available to this student");
    error.status = 404;
    throw error;
  }

  let meetingUrl = session.meetingUrl || "";
  let roomName = session.roomName || `pragati-session-${sessionId}`;
  let token = null;

  if (process.env.DAILY_API_KEY) {
    const room = await dailyService.ensureRoom({ roomName, meetingUrl });
    roomName = room.roomName;
    meetingUrl = room.meetingUrl || meetingUrl;

    await pool.query(
      "UPDATE live_sessions SET room_name = $2, meeting_url = $3, updated_at = NOW() WHERE id = $1",
      [sessionId, roomName, meetingUrl],
    );

    const expiresAt = new Date(
      Date.now() + Math.max((sessionDurationMinutes || 60) + 30, 90) * 60 * 1000,
    );
    token = await dailyService.createParticipantToken({ roomName, userName, expiresAt });
  }

  if (!meetingUrl) {
    const error = new Error("This live session has no meeting link and Daily.co is not configured");
    error.status = 503;
    throw error;
  }

  const result = await pool.query(
    `INSERT INTO session_participants
      (session_id, student_id, joined_at, left_at, join_token_issued_at)
     VALUES ($1, $2, NOW(), NULL, CASE WHEN $3::text IS NOT NULL THEN NOW() ELSE NULL END)
     ON CONFLICT (session_id, student_id)
     DO UPDATE SET joined_at = NOW(), left_at = NULL, duration_seconds = NULL,
       join_token_issued_at = CASE
         WHEN $3::text IS NOT NULL THEN NOW()
         ELSE session_participants.join_token_issued_at
       END
     RETURNING id,
               session_id AS "sessionId",
               student_id AS "studentId",
               joined_at AS "joinedAt"`,
    [sessionId, resolvedStudentId, token],
  );

  return { ...result.rows[0], meetingUrl, roomName, token };
};

export const leaveSession = async (sessionId, studentId) => {
  const resolvedStudentId = Number(studentId);
  if (!Number.isInteger(resolvedStudentId) || resolvedStudentId <= 0) {
    const error = new Error("Student not found");
    error.status = 404;
    throw error;
  }

  const session = await getSessionById(sessionId, resolvedStudentId);
  if (!session) {
    const error = new Error("Session not found or not available to this student");
    error.status = 404;
    throw error;
  }

  const existingAttendance = await pool.query(
    "SELECT attended FROM session_attendance WHERE session_id = $1 AND student_id = $2",
    [sessionId, resolvedStudentId],
  );
  const previousAttended = Boolean(existingAttendance.rows[0]?.attended);

  const participant = await pool.query(
    `UPDATE session_participants
     SET left_at = COALESCE(left_at, NOW()),
         updated_at = NOW(),
         duration_seconds = GREATEST(
           0,
           EXTRACT(EPOCH FROM (COALESCE(left_at, NOW()) - joined_at))::int
         )
     WHERE session_id = $1 AND student_id = $2
     RETURNING id,
               session_id AS "sessionId",
               student_id AS "studentId",
               joined_at AS "joinedAt",
               left_at AS "leftAt",
               duration_seconds AS "durationSeconds"`,
    [sessionId, resolvedStudentId],
  );

  const row = participant.rows[0];
  if (!row) return null;

  const scheduledMinutes = durationMinutes(session.duration);
  const attended = scheduledMinutes > 0
    ? row.durationSeconds >= scheduledMinutes * 60 * 0.6
    : row.durationSeconds > 0;
  const status = attended ? "Present" : "Absent";

  await pool.query(
    `INSERT INTO session_attendance
      (session_id, student_id, attended, attended_at, status, join_timestamp, leave_timestamp, duration_seconds)
     VALUES ($1, $2, $3, CASE WHEN $3 THEN NOW() ELSE NULL END, $4, $5, $6, $7)
     ON CONFLICT (session_id, student_id)
     DO UPDATE SET attended = EXCLUDED.attended,
       attended_at = EXCLUDED.attended_at,
       status = EXCLUDED.status,
       join_timestamp = EXCLUDED.join_timestamp,
       leave_timestamp = EXCLUDED.leave_timestamp,
       duration_seconds = EXCLUDED.duration_seconds,
       updated_at = NOW()`,
    [sessionId, resolvedStudentId, attended, status, row.joinedAt, row.leftAt, row.durationSeconds],
  );

  if (attended && !previousAttended && session.driveId) {
    await pool.query(
      `UPDATE student_drive_progress
       SET sessions_attended = COALESCE(sessions_attended, 0) + 1
       WHERE student_id = $1 AND drive_id = $2`,
      [resolvedStudentId, session.driveId],
    );
  }

  return {
    ...row,
    attended,
    attendanceStatus: status,
    requiredDurationSeconds: Math.round(scheduledMinutes * 60 * 0.6),
  };
};

export default { getAllSessions, getSessionById, joinSession, leaveSession };
