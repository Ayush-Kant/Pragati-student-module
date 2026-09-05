import "dotenv/config";
import { pool } from "../config/db.js";

const install = async () => {
  await pool.query(`
    CREATE OR REPLACE FUNCTION seed_student_starter_data(p_student_id INTEGER, p_user_id INTEGER)
    RETURNS VOID
    LANGUAGE plpgsql
    AS $$
    BEGIN
      IF to_regclass('public.student_profiles') IS NOT NULL THEN
        INSERT INTO student_profiles (student_id)
        VALUES (p_student_id)
        ON CONFLICT (student_id) DO NOTHING;
      END IF;

      IF to_regclass('public.student_projects') IS NOT NULL THEN
        INSERT INTO student_projects
          (student_id, title, description, objectives, requirements, deliverables,
           tech_stack, resources, evaluation_criteria, deadline, mentor_name,
           batch_name, duration_weeks, status)
        SELECT p_student_id, 'SM-09 Student Portfolio Project',
          'Starter project for validating milestones, submissions, attachments and evaluation flow.',
          '["Plan the project", "Complete milestone check-ins", "Submit a working implementation"]'::jsonb,
          '["React", "REST API integration", "Responsive UI"]'::jsonb,
          '["GitHub repository", "Deployment URL", "Project report"]'::jsonb,
          '["React", "Node.js", "PostgreSQL"]'::jsonb,
          '[{"label":"React Documentation","url":"https://react.dev"},{"label":"Node.js Documentation","url":"https://nodejs.org/docs/latest/api/"}]'::jsonb,
          '[{"id":"functionality","criterion":"Functionality & completeness","maxScore":40,"weight":40},{"id":"quality","criterion":"Code quality","maxScore":30,"weight":30},{"id":"documentation","criterion":"Documentation","maxScore":30,"weight":30}]'::jsonb,
          NOW() + INTERVAL '30 days', 'Training Mentor', 'Student Starter Batch', 4, 'NOT_STARTED'
        WHERE NOT EXISTS (
          SELECT 1 FROM student_projects
          WHERE student_id = p_student_id AND title = 'SM-09 Student Portfolio Project'
        );
      END IF;

      IF to_regclass('public.interviews') IS NOT NULL THEN
        INSERT INTO interviews
          (application_id, student_id, scheduled_at, title, interviewer_id, meeting_link,
           interview_type, result, status, attendance, feedback)
        SELECT NULL, p_student_id, v.at, v.title, NULL, v.meeting, v.type, v.result, v.status, v.attendance, v.feedback
        FROM (VALUES
          (NOW() + INTERVAL '2 days', 'Technical Interview — Full Stack', 'https://meet.google.com/mock-pragati-technical', 'Technical', 'PENDING', 'scheduled', 'pending', NULL),
          (NOW() + INTERVAL '5 days', 'Behavioral Interview — Placement Round', 'https://meet.google.com/mock-pragati-behavioral', 'Behavioral', 'PENDING', 'invited', 'pending', NULL),
          (NOW() - INTERVAL '8 days', 'Technical Interview — System Design', 'https://meet.google.com/mock-pragati-system-design', 'Technical', 'PASS', 'completed', 'present', 'Strong system-design fundamentals and clear trade-off discussion.'),
          (NOW() - INTERVAL '12 days', 'Panel Interview — Final Review', 'https://meet.google.com/mock-pragati-panel', 'Panel', 'FAIL', 'completed', 'present', 'Good effort; improve distributed systems depth and testing strategy.'),
          (NOW() - INTERVAL '16 days', 'Technical Interview — Missed Slot', 'https://meet.google.com/mock-pragati-missed', 'Technical', 'PENDING', 'completed', 'absent', 'Candidate did not attend the scheduled interview.')
        ) AS v(at, title, meeting, type, result, status, attendance, feedback)
        WHERE NOT EXISTS (
          SELECT 1 FROM interviews i WHERE i.student_id = p_student_id AND i.title = v.title
        );
      END IF;

      IF p_user_id IS NOT NULL AND to_regclass('public.notifications') IS NOT NULL THEN
        INSERT INTO notifications (user_id, title, message, type, link_url, is_read)
        SELECT p_user_id, v.title, v.message, v.type, v.link_url, v.is_read
        FROM (VALUES
          ('grade_released', 'Assignment graded', 'Your REST API assignment scored 82/100.', '/student/assignments', false),
          ('session_scheduled', 'New live session scheduled', 'React Hooks Deep Dive is scheduled for the next learning block.', '/student/sessions', false),
          ('assignment_published', 'New assignment published', 'Build a REST API has been assigned to you.', '/student/assignments', false),
          ('shortlisted', 'You have been shortlisted', 'You are shortlisted for the next placement stage.', '/student/dashboard', true),
          ('interview_invited', 'Interview invitation', 'Your Full Stack technical interview has been scheduled.', '/student/interviews', false),
          ('interview_outcome', 'Interview outcome available', 'Your latest interview outcome is ready to review.', '/student/interviews', false),
          ('platform_announcement', 'Pragati platform update', 'New student-module capabilities are now available.', '/student/notifications', true),
          ('certificate_issued', 'Certificate issued', 'Your completion certificate is now available.', '/student/certificates', false),
          ('info', 'Information notification', 'This is a seeded informational notification for UI/state testing.', '/student/notifications', false),
          ('success', 'Success notification', 'Your course milestone was completed successfully.', '/student/dashboard', true),
          ('warning', 'Warning notification', 'Your profile is missing one recommended detail.', '/student/profile', false),
          ('alert', 'Action required notification', 'Please review your upcoming interview details.', '/student/interviews', false)
        ) AS v(type, title, message, link_url, is_read)
        WHERE NOT EXISTS (
          SELECT 1 FROM notifications n
          WHERE n.user_id = p_user_id AND n.type = v.type AND n.title = v.title AND n.message = v.message
        );
      END IF;
    END;
    $$;
  `);

  await pool.query(`
    CREATE OR REPLACE FUNCTION trg_seed_student_starter_data()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    AS $$
    BEGIN
      PERFORM seed_student_starter_data(NEW.id, NEW.user_id);
      RETURN NEW;
    END;
    $$;
  `);

  await pool.query(`DROP TRIGGER IF EXISTS students_seed_starter_data ON students;`);
  await pool.query(`
    CREATE TRIGGER students_seed_starter_data
    AFTER INSERT ON students
    FOR EACH ROW
    EXECUTE FUNCTION trg_seed_student_starter_data();
  `);

  const { rows } = await pool.query(`SELECT id, user_id FROM students ORDER BY id`);
  for (const student of rows) {
    await pool.query(`SELECT seed_student_starter_data($1, $2)`, [student.id, student.user_id || null]);
  }

  console.log(`Student starter-data automation installed and backfilled ${rows.length} existing student account(s).`);
};

try {
  await install();
} catch (error) {
  console.error("[installStudentStarterData] Failed:", error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
