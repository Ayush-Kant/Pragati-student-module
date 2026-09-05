import "dotenv/config";
import { pool } from "../config/db.js";

const STARTER_INTERVIEWS = [
  ["Technical Interview — Full Stack", "Technical", "scheduled", "PENDING", "pending", 2, "https://meet.google.com/mock-pragati-technical", null],
  ["Behavioral Interview — Placement Round", "Behavioral", "invited", "PENDING", "pending", 5, "https://meet.google.com/mock-pragati-behavioral", null],
  ["HR Interview — Culture & Values", "HR", "scheduled", "PENDING", "pending", 7, "https://meet.google.com/mock-pragati-hr", null],
  ["Technical Interview — System Design", "Technical", "completed", "PASS", "present", -8, "https://meet.google.com/mock-pragati-system-design", "Strong system-design fundamentals and clear trade-off discussion."],
  ["Panel Interview — Final Review", "Panel", "completed", "FAIL", "present", -12, "https://meet.google.com/mock-pragati-panel", "Good effort; improve distributed systems depth and testing strategy."],
  ["Technical Interview — Missed Slot", "Technical", "completed", "PENDING", "absent", -16, "https://meet.google.com/mock-pragati-missed", "Candidate did not attend the scheduled interview."],
];

const STARTER_NOTIFICATIONS = [
  ["grade_released", "Assignment graded", "Your REST API assignment scored 82/100.", "/student/assignments", false],
  ["session_scheduled", "New live session scheduled", "React Hooks Deep Dive is scheduled for the next learning block.", "/student/sessions", false],
  ["assignment_published", "New assignment published", "Build a REST API has been assigned to you.", "/student/assignments", false],
  ["shortlisted", "You have been shortlisted", "You are shortlisted for the next placement stage.", "/student/dashboard", true],
  ["interview_invited", "Interview invitation", "Your Full Stack technical interview has been scheduled.", "/student/interviews", false],
  ["interview_outcome", "Interview outcome available", "Your latest interview outcome is ready to review.", "/student/interviews", false],
  ["platform_announcement", "Pragati platform update", "New student-module capabilities are now available.", "/student/notifications", true],
  ["certificate_issued", "Certificate issued", "Your completion certificate is now available.", "/student/certificates", false],
  ["info", "Information notification", "This is a seeded informational notification for UI/state testing.", "/student/notifications", false],
  ["success", "Success notification", "Your course milestone was completed successfully.", "/student/dashboard", true],
  ["warning", "Warning notification", "Your profile is missing one recommended detail.", "/student/profile", false],
  ["alert", "Action required notification", "Please review your upcoming interview details.", "/student/interviews", false],
];

const tableExists = async (tableName) => {
  const result = await pool.query(`SELECT to_regclass($1) AS table_name`, [`public.${tableName}`]);
  return Boolean(result.rows[0]?.table_name);
};

export const seedStudentStarterData = async (studentId, userId = null) => {
  const studentResult = await pool.query(
    `SELECT id, user_id, name, email FROM students WHERE id = $1 LIMIT 1`,
    [studentId],
  );
  if (!studentResult.rows[0]) throw new Error(`Student ${studentId} was not found.`);

  const resolvedUserId = userId ?? studentResult.rows[0].user_id ?? null;

  if (await tableExists("student_profiles")) {
    await pool.query(`
      INSERT INTO student_profiles (student_id)
      VALUES ($1)
      ON CONFLICT (student_id) DO NOTHING
    `, [studentId]);
  }

  if (await tableExists("student_projects")) {
    let projectId = (await pool.query(
      `SELECT id FROM student_projects WHERE student_id = $1 AND title = 'SM-09 Student Portfolio Project' ORDER BY id DESC LIMIT 1`,
      [studentId],
    )).rows[0]?.id;

    if (!projectId) {
      projectId = (await pool.query(`
        INSERT INTO student_projects
          (student_id, title, description, objectives, requirements, deliverables,
           tech_stack, resources, evaluation_criteria, deadline, mentor_name,
           batch_name, duration_weeks, status)
        VALUES
          ($1, 'SM-09 Student Portfolio Project',
           'Starter project for validating milestones, submissions, attachments and evaluation flow.',
           '["Plan the project", "Complete milestone check-ins", "Submit a working implementation"]'::jsonb,
           '["React", "REST API integration", "Responsive UI"]'::jsonb,
           '["GitHub repository", "Deployment URL", "Project report"]'::jsonb,
           '["React", "Node.js", "PostgreSQL"]'::jsonb,
           '[{"label":"React Documentation","url":"https://react.dev"},{"label":"Node.js Documentation","url":"https://nodejs.org/docs/latest/api/"}]'::jsonb,
           '[{"id":"functionality","criterion":"Functionality & completeness","maxScore":40,"weight":40},{"id":"quality","criterion":"Code quality","maxScore":30,"weight":30},{"id":"documentation","criterion":"Documentation","maxScore":30,"weight":30}]'::jsonb,
           NOW() + INTERVAL '30 days', 'Training Mentor', 'Student Starter Batch', 4, 'NOT_STARTED')
        RETURNING id`,
        [studentId],
      )).rows[0]?.id;
    }

    if (projectId && await tableExists("project_milestones")) {
      await pool.query(`
        INSERT INTO project_milestones (project_id, title, description, deadline, status, progress, milestone_order)
        SELECT $1, milestone.title, milestone.description, NOW() + milestone.days * INTERVAL '1 day', 'PENDING', 0, milestone.milestone_order
        FROM (VALUES
          ('Project Planning', 'Define scope, repository and implementation plan.', 7, 1),
          ('Core Development', 'Implement the main student project experience.', 15, 2),
          ('Testing & Review', 'Test the project and resolve review feedback.', 23, 3),
          ('Final Submission', 'Prepare the GitHub repository, deployment and report.', 30, 4)
        ) AS milestone(title, description, days, milestone_order)
        WHERE NOT EXISTS (
          SELECT 1 FROM project_milestones pm
          WHERE pm.project_id = $1 AND pm.milestone_order = milestone.milestone_order
        )
      `, [projectId]);
    }
  }

  if (await tableExists("interviews")) {
    for (const [title, interviewType, status, result, attendance, dayOffset, meetingLink, feedback] of STARTER_INTERVIEWS) {
      await pool.query(`
        INSERT INTO interviews
          (application_id, student_id, scheduled_at, title, interviewer_id, meeting_link,
           interview_type, result, status, attendance, feedback)
        SELECT NULL, $1, NOW() + ($2 * INTERVAL '1 day'), $3, NULL, $4, $5, $6, $7, $8, $9
        WHERE NOT EXISTS (
          SELECT 1 FROM interviews WHERE student_id = $1 AND title = $3
        )
      `, [studentId, dayOffset, title, meetingLink, interviewType, result, status, attendance, feedback]);
    }
  }

  if (resolvedUserId && await tableExists("notifications")) {
    for (const [type, title, message, linkUrl, isRead] of STARTER_NOTIFICATIONS) {
      await pool.query(`
        INSERT INTO notifications (user_id, title, message, type, link_url, is_read)
        SELECT $1, $2, $3, $4, $5, $6
        WHERE NOT EXISTS (
          SELECT 1 FROM notifications
          WHERE user_id = $1 AND type = $4 AND title = $2 AND message = $3
        )
      `, [resolvedUserId, title, message, type, linkUrl, isRead]);
    }
  }

  return {
    studentId: Number(studentId),
    userId: resolvedUserId ? Number(resolvedUserId) : null,
    name: studentResult.rows[0].name,
    email: studentResult.rows[0].email,
  };
};

export const seedAllStudentsStarterData = async () => {
  const { rows } = await pool.query(`SELECT id, user_id FROM students ORDER BY id`);
  for (const student of rows) await seedStudentStarterData(student.id, student.user_id);
  console.log(`Starter data verified for ${rows.length} student account(s).`);
};
