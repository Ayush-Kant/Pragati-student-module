import { pool } from "../../../config/db.js";
import notificationService from "../../../services/notification.service.js";
import {
  liveSessionSeedData,
  attendanceSeedData,
  recordingSeedData,
  participantSeedData,
  scheduleSeedData,
} from "../seeders/liveSessionSeedData.js";

const createLiveSessionTablesQuery = `
  CREATE TABLE IF NOT EXISTS live_sessions (
    id SERIAL PRIMARY KEY,
    mentor_id INTEGER,
    title VARCHAR(255) NOT NULL,
    session_type VARCHAR(50) NOT NULL DEFAULT 'webinar',
    scheduled_at TIMESTAMP WITH TIME ZONE,
    trainer VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    time VARCHAR(50) NOT NULL,
    duration VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Upcoming',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT live_sessions_session_type_chk CHECK (session_type IN ('webinar', 'interactive', 'qa')),
    CONSTRAINT live_sessions_status_chk CHECK (status IN ('Upcoming', 'Scheduled', 'Live', 'Completed'))
  );

  ALTER TABLE live_sessions
  ADD COLUMN IF NOT EXISTS mentor_id INTEGER,
  ADD COLUMN IF NOT EXISTS session_type VARCHAR(50) NOT NULL DEFAULT 'webinar',
  ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS trainer VARCHAR(255),
  ADD COLUMN IF NOT EXISTS date DATE,
  ADD COLUMN IF NOT EXISTS time VARCHAR(50),
  ADD COLUMN IF NOT EXISTS duration VARCHAR(50),
  ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Upcoming',
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

  DO $$ BEGIN
    ALTER TABLE live_sessions ADD CONSTRAINT live_sessions_status_chk CHECK (status IN ('Upcoming', 'Scheduled', 'Live', 'Completed'));
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $$;

  DO $$
  BEGIN
    IF EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'live_sessions'
        AND column_name = 'session_date'
    ) THEN
      UPDATE live_sessions
      SET date = COALESCE(date, session_date),
          time = COALESCE(time, session_time),
          session_type = COALESCE(session_type, 'webinar')
      WHERE id IS NOT NULL;
    END IF;
  END $$;

  CREATE TABLE IF NOT EXISTS session_attendance (
    id SERIAL PRIMARY KEY,
    session_id INTEGER NOT NULL REFERENCES live_sessions(id) ON DELETE CASCADE,
    student_id INTEGER NOT NULL,
    attended BOOLEAN NOT NULL DEFAULT FALSE,
    attended_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) NOT NULL DEFAULT 'Absent',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT session_attendance_status_chk CHECK (status IN ('Present', 'Absent', 'Late', 'Excused')),
    UNIQUE(session_id, student_id)
  );

  ALTER TABLE session_attendance
  ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Absent',
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

  CREATE TABLE IF NOT EXISTS session_participants (
    id SERIAL PRIMARY KEY,
    session_id INTEGER NOT NULL REFERENCES live_sessions(id) ON DELETE CASCADE,
    student_id INTEGER NOT NULL,
    joined_at TIMESTAMP WITH TIME ZONE,
    left_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(session_id, student_id)
  );

  CREATE TABLE IF NOT EXISTS session_recordings (
    id SERIAL PRIMARY KEY,
    session_id INTEGER NOT NULL REFERENCES live_sessions(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    duration VARCHAR(50),
    recording_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS session_schedules (
    id SERIAL PRIMARY KEY,
    session_id INTEGER REFERENCES live_sessions(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    trainer VARCHAR(255),
    date DATE,
    time VARCHAR(50),
    duration VARCHAR(50),
    status VARCHAR(50) DEFAULT 'Scheduled',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT session_schedules_status_chk CHECK (status IN ('Scheduled', 'Upcoming', 'Live', 'Completed'))
  );

  ALTER TABLE session_schedules
  ADD COLUMN IF NOT EXISTS title VARCHAR(255),
  ADD COLUMN IF NOT EXISTS trainer VARCHAR(255),
  ADD COLUMN IF NOT EXISTS date DATE,
  ADD COLUMN IF NOT EXISTS time VARCHAR(50),
  ADD COLUMN IF NOT EXISTS duration VARCHAR(50),
  ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Scheduled',
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

  CREATE INDEX IF NOT EXISTS idx_live_sessions_status_scheduled_at ON live_sessions (status, scheduled_at);
  CREATE INDEX IF NOT EXISTS idx_session_attendance_session_id ON session_attendance (session_id);
  CREATE INDEX IF NOT EXISTS idx_session_attendance_student_id ON session_attendance (student_id);
  CREATE INDEX IF NOT EXISTS idx_session_participants_session_id ON session_participants (session_id);
  CREATE INDEX IF NOT EXISTS idx_session_recordings_session_id ON session_recordings (session_id);
  CREATE INDEX IF NOT EXISTS idx_session_schedules_status_date ON session_schedules (status, date);
`;

export const createLiveSessionTables = async () => {
  await pool.query(createLiveSessionTablesQuery);
};

const notifyStudentsForSessions = async (sessionIds) => {
  if (!sessionIds.length) return;
  const { rows } = await pool.query(
    `SELECT id, title, trainer, scheduled_at AS "scheduledAt"
     FROM live_sessions WHERE id = ANY($1::int[])`,
    [sessionIds],
  );

  const students = await pool.query(`SELECT id FROM students WHERE user_id IS NOT NULL`);
  if (!students.rows.length) return;

  for (const session of rows) {
    try {
      await notificationService.sendNotificationToStudents({
        studentIds: students.rows.map((student) => Number(student.id)),
        title: 'New live session scheduled',
        message: `${session.title} with ${session.trainer} is scheduled for ${new Date(session.scheduledAt).toLocaleString()}.`,
        type: notificationService.NOTIFICATION_TYPES.SESSION_SCHEDULED,
        linkUrl: `/student/sessions/${session.id}`,
      });
    } catch (error) {
      console.error('[liveSession] Failed to dispatch session notifications:', error.message);
    }
  }
};

export const seedLiveSessionData = async () => {
  const sessionCount = await pool.query("SELECT COUNT(*)::int AS count FROM live_sessions");
  if (sessionCount.rows[0].count > 0) return;

  const createdSessionIds = [];
  const createdSessions = await pool.query(
    `INSERT INTO live_sessions (title, trainer, date, time, duration, status, session_type, scheduled_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING id`,
    [liveSessionSeedData[0].title, liveSessionSeedData[0].trainer, liveSessionSeedData[0].date, liveSessionSeedData[0].time, liveSessionSeedData[0].duration, liveSessionSeedData[0].status, liveSessionSeedData[0].session_type, liveSessionSeedData[0].scheduled_at],
  );
  const firstSessionId = createdSessions.rows[0]?.id;
  if (firstSessionId) createdSessionIds.push(firstSessionId);

  if (firstSessionId) {
    const userTableCheck = await pool.query("SELECT to_regclass('public.users') AS table_name");
    const usersTableExists = Boolean(userTableCheck.rows[0]?.table_name);
    if (usersTableExists) {
      const studentCheck = await pool.query("SELECT EXISTS (SELECT 1 FROM users WHERE id = $1) AS exists", [attendanceSeedData[0].studentId]);
      if (studentCheck.rows[0]?.exists) {
        await pool.query(
          `INSERT INTO session_attendance (session_id, student_id, attended, status)
           VALUES ($1, $2, true, $3) ON CONFLICT (session_id, student_id) DO NOTHING`,
          [firstSessionId, attendanceSeedData[0].studentId, attendanceSeedData[0].status],
        );
      }
      const participantCheck = await pool.query("SELECT EXISTS (SELECT 1 FROM users WHERE id = $1) AS exists", [participantSeedData[0].studentId]);
      if (participantCheck.rows[0]?.exists) {
        await pool.query(
          `INSERT INTO session_participants (session_id, student_id, joined_at, left_at)
           VALUES ($1, $2, NOW(), NULL) ON CONFLICT (session_id, student_id) DO NOTHING`,
          [firstSessionId, participantSeedData[0].studentId],
        );
      }
    }
    await pool.query(
      `INSERT INTO session_recordings (session_id, title, duration, recording_url)
       VALUES ($1, $2, $3, $4)`,
      [firstSessionId, recordingSeedData[0].title, recordingSeedData[0].duration, recordingSeedData[0].recordingUrl],
    );
  }

  for (const schedule of scheduleSeedData) {
    await pool.query(
      `INSERT INTO session_schedules (session_id, title, trainer, date, time, duration, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [firstSessionId, schedule.title, schedule.trainer, schedule.date, schedule.time, schedule.duration, schedule.status],
    );
  }

  for (const session of liveSessionSeedData.slice(1)) {
    const result = await pool.query(
      `INSERT INTO live_sessions (title, trainer, date, time, duration, status, session_type, scheduled_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
      [session.title, session.trainer, session.date, session.time, session.duration, session.status, session.session_type, session.scheduled_at],
    );
    if (result.rows[0]?.id) createdSessionIds.push(result.rows[0].id);
  }

  await notifyStudentsForSessions(createdSessionIds);
};

export const initializeLiveSessionModule = async () => {
  await createLiveSessionTables();
  await seedLiveSessionData();
};

export default initializeLiveSessionModule;
