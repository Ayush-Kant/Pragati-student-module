import "dotenv/config";
import { pool } from "../config/db.js";

const DEMO_VIDEO_WATCH_URL = "https://www.youtube.com/watch?v=Ke90Tje7VS0";
const DEMO_VIDEO_EMBED_URL = "https://www.youtube.com/embed/Ke90Tje7VS0";
const LIVE_SESSION_DURATION = "8 hours";

const seed = async () => {
  const { rows: students } = await pool.query(
    `SELECT id, name, email
     FROM students
     ORDER BY CASE WHEN LOWER(email) = 'student@demo.edu' THEN 0 ELSE 1 END, id
     LIMIT 50`,
  );

  if (!students.length) {
    throw new Error("No students found. Register a student first, then run this seed script.");
  }

  for (const student of students) {
    const projectResult = await pool.query(
      `INSERT INTO student_projects
        (student_id, title, description, objectives, requirements, deliverables,
         tech_stack, resources, evaluation_criteria, deadline, mentor_name,
         batch_name, duration_weeks, status)
       SELECT
         $1,
         'SM-09 Student Portfolio Project',
         'Demo project for validating milestones, submissions, attachments and evaluation flow.',
         '["Plan the project", "Complete milestone check-ins", "Submit a working implementation"]'::jsonb,
         '["React", "REST API integration", "Responsive UI"]'::jsonb,
         '["GitHub repository", "Deployment URL", "Project report"]'::jsonb,
         '["React", "Node.js", "PostgreSQL"]'::jsonb,
         '[{"label":"React Documentation","url":"https://react.dev"},{"label":"Node.js Documentation","url":"https://nodejs.org/docs/latest/api/"}]'::jsonb,
         '[{"id":"functionality","criterion":"Functionality & completeness","maxScore":40,"weight":40},{"id":"quality","criterion":"Code quality","maxScore":30,"weight":30},{"id":"documentation","criterion":"Documentation","maxScore":30,"weight":30}]'::jsonb,
         NOW() + INTERVAL '30 days',
         'Training Mentor',
         'Student Demo Batch',
         4,
         'NOT_STARTED'
       WHERE NOT EXISTS (
         SELECT 1 FROM student_projects p
         WHERE p.student_id = $1 AND p.title = 'SM-09 Student Portfolio Project'
       )
       RETURNING id`,
      [student.id],
    );

    const projectId = projectResult.rows[0]?.id ?? (
      await pool.query(
        `SELECT id FROM student_projects
         WHERE student_id = $1 AND title = 'SM-09 Student Portfolio Project'
         ORDER BY id DESC LIMIT 1`,
        [student.id],
      )
    ).rows[0]?.id;

    if (!projectId) continue;

    const milestones = [
      ["Project Planning", "Define scope, repository and implementation plan.", 7, 1],
      ["Core Development", "Implement the main student project experience.", 15, 2],
      ["Testing & Review", "Test the project and resolve review feedback.", 23, 3],
      ["Final Submission", "Prepare the GitHub repository, deployment and report.", 30, 4],
    ];

    for (const [title, description, days, order] of milestones) {
      await pool.query(
        `INSERT INTO project_milestones
          (project_id, title, description, deadline, status, progress, milestone_order)
         SELECT $1, $2, $3, NOW() + ($4 * INTERVAL '1 day'), 'PENDING', 0, $5
         WHERE NOT EXISTS (
           SELECT 1 FROM project_milestones
           WHERE project_id = $1 AND milestone_order = $5
         )`,
        [projectId, title, description, days, order],
      );
    }
  }

  // Always replace the demo session so repeated seeding never preserves a
  // stale duration or stale start time from a previous run.
  await pool.query(
    `DELETE FROM session_schedules
     WHERE session_id IN (
       SELECT id FROM live_sessions WHERE title = 'Live Demo: Student Learning Session'
     )`,
  );
  await pool.query(
    `DELETE FROM session_recordings
     WHERE session_id IN (
       SELECT id FROM live_sessions WHERE title = 'Live Demo: Student Learning Session'
     )`,
  );
  await pool.query(
    `DELETE FROM session_participants
     WHERE session_id IN (
       SELECT id FROM live_sessions WHERE title = 'Live Demo: Student Learning Session'
     )`,
  );
  await pool.query(
    `DELETE FROM session_attendance
     WHERE session_id IN (
       SELECT id FROM live_sessions WHERE title = 'Live Demo: Student Learning Session'
     )`,
  );
  await pool.query(
    `DELETE FROM live_sessions
     WHERE title = 'Live Demo: Student Learning Session'`,
  );

  const liveSession = await pool.query(
    `INSERT INTO live_sessions
      (mentor_id, title, session_type, scheduled_at, trainer, date, time,
       duration, status, room_name, meeting_url)
     VALUES
      (NULL,
       'Live Demo: Student Learning Session',
       'webinar',
       NOW(),
       'Pragati Demo Trainer',
       TO_CHAR(NOW(), 'YYYY-MM-DD'),
       TO_CHAR(NOW(), 'HH24:MI'),
       $1,
       'Live',
       'pragati-live-demo',
       $2)
     RETURNING id`,
    [LIVE_SESSION_DURATION, DEMO_VIDEO_EMBED_URL],
  );

  const sessionId = liveSession.rows[0]?.id;

  if (sessionId) {
    await pool.query(
      `INSERT INTO session_schedules
        (session_id, title, trainer, date, time, duration, status)
       VALUES ($1, 'Live Demo: Student Learning Session', 'Pragati Demo Trainer',
               TO_CHAR(NOW(), 'YYYY-MM-DD'), TO_CHAR(NOW(), 'HH24:MI'), $2, 'Live')`,
      [sessionId, LIVE_SESSION_DURATION],
    );

    await pool.query(
      `INSERT INTO session_recordings
        (session_id, title, duration, recording_url)
       VALUES ($1, 'Demo session recording', '42 minutes', $2)`,
      [sessionId, DEMO_VIDEO_WATCH_URL],
    );
  }

  const [{ rows: projectCount }, { rows: sessionRows }, { rows: challengeCount }] = await Promise.all([
    pool.query(`SELECT COUNT(*)::int AS count FROM student_projects WHERE title = 'SM-09 Student Portfolio Project'`),
    pool.query(`SELECT id, scheduled_at, duration, status, meeting_url FROM live_sessions WHERE title = 'Live Demo: Student Learning Session' ORDER BY id DESC LIMIT 1`),
    pool.query(`SELECT COUNT(*)::int AS count FROM assessment_questions WHERE LOWER(type) = 'coding'`),
  ]);

  console.log(`✅ Demo students with SM-09 project: ${projectCount[0].count}`);
  console.log(`✅ Demo live session: ${sessionRows[0]?.id ?? "not created"}`);
  console.log(`   Start: ${sessionRows[0]?.scheduled_at ?? "n/a"}`);
  console.log(`   Duration: ${sessionRows[0]?.duration ?? "n/a"} (8 hours)`);
  console.log(`   Status: ${sessionRows[0]?.status ?? "n/a"}`);
  console.log(`   Meeting URL: ${sessionRows[0]?.meeting_url ?? "n/a"}`);
  console.log(`✅ Coding challenges available: ${challengeCount[0].count}`);
  console.log(`▶ Demo recording: ${DEMO_VIDEO_WATCH_URL}`);
};

try {
  await seed();
} catch (error) {
  console.error("[seedStudentDemoData] Failed:", error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
