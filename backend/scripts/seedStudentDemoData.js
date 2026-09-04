import "dotenv/config";
import { pool } from "../config/db.js";

const DEMO_EMAIL = "student@demo.edu";
const WATCH_URL = "https://www.youtube.com/watch?v=Ke90Tje7VS0";
const EMBED_URL = "https://www.youtube.com/embed/Ke90Tje7VS0";
const DEMO_MEETING_URL = EMBED_URL;
const WEEKLY_SESSION_HOURS = 24;

const safe = async (label, fn) => {
  try {
    return await fn();
  } catch (error) {
    console.warn(`⚠️ ${label}: ${error.message}`);
    return null;
  }
};

const tableExists = async (tableName) => {
  const result = await pool.query(
    `SELECT to_regclass($1) AS table_name`,
    [`public.${tableName}`],
  );
  return Boolean(result.rows[0]?.table_name);
};

const columnExists = async (tableName, columnName) => {
  const result = await pool.query(
    `SELECT 1
       FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = $1
        AND column_name = $2
      LIMIT 1`,
    [tableName, columnName],
  );
  return result.rowCount > 0;
};

const durationMinutes = (value) => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const text = String(value || "").trim().toLowerCase();
  const match = text.match(/(\d+(?:\.\d+)?)\s*(hours?|hrs?|h|minutes?|mins?|m)?/i);
  if (!match) return 0;
  const amount = Number(match[1]);
  const unit = match[2] || "minutes";
  return /^(hours?|hrs?|h)$/.test(unit) ? amount * 60 : amount;
};

const seed = async () => {
  const { rows: students } = await pool.query(
    `SELECT id, user_id AS "userId", name, email
       FROM students
      ORDER BY CASE WHEN LOWER(email) = $1 THEN 0 ELSE 1 END, id
      LIMIT 20`,
    [DEMO_EMAIL],
  );

  if (!students.length) {
    throw new Error("No students found. Register a student first, then run this seed script.");
  }

  const demoStudent = students.find((student) => String(student.email).toLowerCase() === DEMO_EMAIL) || students[0];
  const demoStudentId = Number(demoStudent.id);
  const demoUserId = Number(demoStudent.userId) || null;

  console.log(`🎯 Primary demo student: ${demoStudent.name} (${demoStudent.email}) [student_id=${demoStudentId}]`);

  // ---------------------------------------------------------------------------
  // SM-01/02 — auth/onboarding + complete profile fixture
  // ---------------------------------------------------------------------------
  await safe("student profile", async () => {
    if (!(await tableExists("student_profiles"))) return;
    await pool.query(
      `INSERT INTO student_profiles
         (student_id, bio, gender, date_of_birth, address_line1, city, state, country,
          pincode, alternate_phone, alternate_email, profile_completeness)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       ON CONFLICT (student_id) DO UPDATE SET
         bio = EXCLUDED.bio,
         gender = EXCLUDED.gender,
         date_of_birth = EXCLUDED.date_of_birth,
         address_line1 = EXCLUDED.address_line1,
         city = EXCLUDED.city,
         state = EXCLUDED.state,
         country = EXCLUDED.country,
         pincode = EXCLUDED.pincode,
         alternate_phone = EXCLUDED.alternate_phone,
         alternate_email = EXCLUDED.alternate_email,
         profile_completeness = EXCLUDED.profile_completeness,
         updated_at = NOW()`,
      [
        demoStudentId,
        "Full-stack developer in training. Building production-ready React, Node.js and PostgreSQL applications.",
        "Prefer not to say",
        "2003-06-15",
        "42 Student Avenue",
        "Hyderabad",
        "Telangana",
        "India",
        "500032",
        "+91-9000000001",
        "student.alt@demo.edu",
        96,
      ],
    );
  });

  await safe("student academic details", async () => {
    if (!(await tableExists("student_academic_details"))) return;
    const columns = [
      "institution_name", "department", "course", "degree", "semester", "graduation_year",
      "cgpa", "enrollment_number", "admission_year", "academic_email",
    ];
    const present = [];
    for (const column of columns) {
      if (await columnExists("student_academic_details", column)) present.push(column);
    }
    if (!present.length) return;
    const values = {
      institution_name: "Pragati Institute of Technology",
      department: "Computer Science & Engineering",
      course: "B.Tech Computer Science",
      degree: "B.Tech",
      semester: 7,
      graduation_year: 2027,
      cgpa: 8.7,
      enrollment_number: "PRG-DEMO-2023-001",
      admission_year: 2023,
      academic_email: "ayush.student@college.demo",
    };
    // student_academic_details has existed in multiple migrations; detect its natural key.
    if (await columnExists("student_academic_details", "student_id")) {
      const names = ["student_id", ...present];
      const params = names.map((_, index) => `$${index + 1}`);
      const args = names.map((name) => name === "student_id" ? demoStudentId : values[name]);
      await pool.query(
        `INSERT INTO student_academic_details (${names.join(", ")})
         VALUES (${params.join(", ")})
         ON CONFLICT (student_id) DO UPDATE SET ${present.map((name) => `${name} = EXCLUDED.${name}`).join(", ")}`,
        args,
      );
    }
  });

  await safe("student skills/social/resume/certifications", async () => {
    if (await tableExists("student_skills")) {
      const skills = [
        ["React", "Advanced", "Frontend"],
        ["Node.js", "Intermediate", "Backend"],
        ["PostgreSQL", "Intermediate", "Database"],
        ["Python", "Intermediate", "Programming"],
        ["Java", "Beginner", "Programming"],
        ["Communication", "Advanced", "Professional"],
      ];
      for (const [name, level, category] of skills) {
        if (await columnExists("student_skills", "skill_name")) {
          await pool.query(
            `INSERT INTO student_skills (student_id, skill_name, skill_level, category)
             VALUES ($1, $2, $3, $4)`,
            [demoStudentId, name, level, category],
          ).catch(() => undefined);
        }
      }
    }

    if (await tableExists("student_social_links")) {
      await pool.query(
        `INSERT INTO student_social_links (student_id, linkedin_url, github_url, portfolio_url, twitter_url, website_url)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (student_id) DO UPDATE SET
           linkedin_url = EXCLUDED.linkedin_url,
           github_url = EXCLUDED.github_url,
           portfolio_url = EXCLUDED.portfolio_url,
           twitter_url = EXCLUDED.twitter_url,
           website_url = EXCLUDED.website_url,
           updated_at = NOW()`,
        [
          demoStudentId,
          "https://www.linkedin.com/in/pragati-demo-student",
          "https://github.com/pragati-demo-student",
          "https://portfolio.demo.student.example",
          "https://x.com/pragati_demo_student",
          "https://student.demo.example",
        ],
      );
    }

    if (await tableExists("student_resumes")) {
      await pool.query(
        `INSERT INTO student_resumes (student_id, resume_url, file_name, file_size, mime_type)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (student_id) DO UPDATE SET
           resume_url = EXCLUDED.resume_url,
           file_name = EXCLUDED.file_name,
           file_size = EXCLUDED.file_size,
           mime_type = EXCLUDED.mime_type,
           updated_at = NOW()`,
        [demoStudentId, "https://example.com/demo-resume.pdf", "student-demo-resume.pdf", 184320, "application/pdf"],
      );
    }

    if (await tableExists("student_certifications")) {
      await pool.query(
        `INSERT INTO student_certifications
           (student_id, name, issuing_organization, issue_date, expiry_date, credential_id, credential_url)
         SELECT $1, $2, $3, $4, $5, $6, $7
         WHERE NOT EXISTS (
           SELECT 1 FROM student_certifications
            WHERE student_id = $1 AND credential_id = $6
         )`,
        [demoStudentId, "AWS Cloud Practitioner", "Amazon Web Services", "2025-10-15", "2028-10-15", "AWS-DEMO-001", "https://example.com/cert/AWS-DEMO-001"],
      );
      await pool.query(
        `INSERT INTO student_certifications
           (student_id, name, issuing_organization, issue_date, credential_id, credential_url)
         SELECT $1, $2, $3, $4, $5, $6
         WHERE NOT EXISTS (
           SELECT 1 FROM student_certifications
            WHERE student_id = $1 AND credential_id = $5
         )`,
        [demoStudentId, "PostgreSQL Fundamentals", "Pragati Academy", "2026-01-20", "PG-DEMO-002", "https://example.com/cert/PG-DEMO-002"],
      );
    }
  });

  await safe("onboarding state", async () => {
    if (await columnExists("students", "onboarding_step")) {
      await pool.query(`UPDATE students SET onboarding_step = 4 WHERE id = $1`, [demoStudentId]);
    }
    if (demoUserId && await columnExists("users", "last_active_at")) {
      await pool.query(`UPDATE users SET last_active_at = NOW() WHERE id = $1`, [demoUserId]);
    }
  });

  // ---------------------------------------------------------------------------
  // SM-04 — course/module/lesson/resources/progress/notes
  // ---------------------------------------------------------------------------
  let courseIds = [];
  await safe("learning content", async () => {
    if (!(await tableExists("training_courses"))) return;
    const courseTitles = [
      "MERN Stack Foundations",
      "Data Structures & Algorithms",
      "Placement Readiness Bootcamp",
      "QA Scenario: Archived Course",
    ];
    for (const title of courseTitles) {
      const result = await pool.query(
        `SELECT id FROM training_courses WHERE title = $1 LIMIT 1`,
        [title],
      );
      if (result.rows[0]) courseIds.push(result.rows[0].id);
    }

    const firstCourse = courseIds[0];
    if (!firstCourse || !(await tableExists("course_modules"))) return;

    const modules = await pool.query(
      `SELECT id, title, module_order FROM course_modules WHERE course_id = $1 ORDER BY module_order`,
      [firstCourse],
    );
    if (!(await tableExists("learning_resources"))) return;

    const lessons = await pool.query(
      `SELECT l.id, l.title, l.duration
         FROM lessons l
         JOIN course_modules m ON m.id = l.module_id
        WHERE m.course_id = $1
        ORDER BY m.module_order, l.lesson_order`,
      [firstCourse],
    );

    const resourceTypes = [
      ["React reference article", "article", "https://react.dev/learn"],
      ["Architecture checklist PDF", "pdf", "https://example.com/resources/architecture-checklist.pdf"],
      ["Lesson cheat sheet", "document", "https://example.com/resources/lesson-cheatsheet.docx"],
      ["Supplementary video", "video", WATCH_URL],
    ];
    for (const lesson of lessons.rows) {
      for (const [title, type, url] of resourceTypes) {
        await pool.query(
          `INSERT INTO learning_resources (lesson_id, title, resource_type, file_url, mime_type, file_size_bytes, storage_key)
           SELECT $1, $2, $3, $4, $5, $6, $7
           WHERE NOT EXISTS (
             SELECT 1 FROM learning_resources WHERE lesson_id = $1 AND title = $2
           )`,
          [lesson.id, title, type, url, type === "pdf" ? "application/pdf" : "text/html", 40960, `demo/${lesson.id}/${title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`],
        ).catch(() => undefined);
      }
    }

    if (await tableExists("student_course_progress")) {
      const total = lessons.rowCount;
      await pool.query(
        `INSERT INTO student_course_progress (student_id, course_id, completed_lessons, total_lessons, progress)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (student_id, course_id) DO UPDATE SET
           completed_lessons = EXCLUDED.completed_lessons,
           total_lessons = EXCLUDED.total_lessons,
           progress = EXCLUDED.progress,
           updated_at = NOW()`,
        [demoStudentId, firstCourse, Math.max(0, total - 2), total, total ? Math.round(((total - 2) / total) * 100) : 0],
      );
    }

    if (await tableExists("lesson_progress")) {
      for (const [index, lesson] of lessons.rows.entries()) {
        const totalSeconds = Math.max(300, Math.round(Number.parseFloat(String(lesson.duration || "20")) * 60) || 1200);
        const pct = index < lessons.rowCount - 2 ? 100 : index === lessons.rowCount - 2 ? 62 : 8;
        const watched = Math.floor(totalSeconds * pct / 100);
        await pool.query(
          `INSERT INTO lesson_progress
             (student_id, lesson_id, completed, completed_at, watched_seconds, total_seconds, progress_pct, last_viewed_at)
           VALUES ($1, $2, $3, CASE WHEN $3 THEN NOW() ELSE NULL END, $4, $5, $6, NOW())
           ON CONFLICT (student_id, lesson_id) DO UPDATE SET
             completed = EXCLUDED.completed,
             completed_at = EXCLUDED.completed_at,
             watched_seconds = EXCLUDED.watched_seconds,
             total_seconds = EXCLUDED.total_seconds,
             progress_pct = EXCLUDED.progress_pct,
             last_viewed_at = EXCLUDED.last_viewed_at,
             updated_at = NOW()`,
          [demoStudentId, lesson.id, pct >= 80, watched, totalSeconds, pct],
        );
      }
    }

    if (await tableExists("student_notes") && lessons.rows.length) {
      await pool.query(
        `INSERT INTO student_notes (student_id, lesson_id, note_text, timestamp_seconds)
         SELECT $1, $2, $3, $4
         WHERE NOT EXISTS (
           SELECT 1 FROM student_notes WHERE student_id = $1 AND lesson_id = $2 AND note_text = $3
         )`,
        [demoStudentId, lessons.rows[0].id, "Remember to keep validation in the service layer and return predictable errors.", 420],
      );
      if (lessons.rows[1]) {
        await pool.query(
          `INSERT INTO student_notes (student_id, lesson_id, note_text, timestamp_seconds)
           SELECT $1, $2, $3, $4
           WHERE NOT EXISTS (
             SELECT 1 FROM student_notes WHERE student_id = $1 AND lesson_id = $2 AND note_text = $3
           )`,
          [demoStudentId, lessons.rows[1].id, "Follow-up: compare effect dependencies with memoization trade-offs.", 780],
        );
      }
    }
  });

  // ---------------------------------------------------------------------------
  // SM-05 — seven 24-hour sessions, one per day, plus historical attendance QA
  // ---------------------------------------------------------------------------
  const weeklySessionIds = [];
  await safe("weekly live sessions", async () => {
    if (!(await tableExists("live_sessions"))) return;

    const oldWeekly = await pool.query(
      `SELECT id FROM live_sessions WHERE title LIKE 'SM-05 Weekly QA Session %' ORDER BY id`,
    );
    for (const row of oldWeekly.rows) {
      await pool.query(`DELETE FROM session_schedules WHERE session_id = $1`, [row.id]).catch(() => undefined);
      await pool.query(`DELETE FROM session_recordings WHERE session_id = $1`, [row.id]).catch(() => undefined);
      await pool.query(`DELETE FROM session_participants WHERE session_id = $1`, [row.id]).catch(() => undefined);
      await pool.query(`DELETE FROM session_attendance WHERE session_id = $1`, [row.id]).catch(() => undefined);
      await pool.query(`DELETE FROM live_sessions WHERE id = $1`, [row.id]);
    }

    for (let day = 0; day < 7; day += 1) {
      const scheduledAt = new Date(Date.now() + day * 24 * 60 * 60 * 1000);
      const date = scheduledAt.toISOString().slice(0, 10);
      const time = scheduledAt.toISOString().slice(11, 16);
      const title = `SM-05 Weekly QA Session ${day + 1} - ${date}`;
      const result = await pool.query(
        `INSERT INTO live_sessions
           (mentor_id, title, session_type, scheduled_at, trainer, date, time, duration,
            status, room_name, meeting_url)
         VALUES (NULL, $1, $2, $3, $4, $5, $6, $7,
                 CASE WHEN $8 = 0 THEN 'Live' ELSE 'Upcoming' END,
                 $9, $10)
         RETURNING id`,
        [
          title,
          ["webinar", "workshop", "mentor_qna", "guest_lecture", "mock_interview", "career_talk", "project_review"][day],
          scheduledAt.toISOString(),
          ["Pragati Demo Trainer", "Asha Mentor", "Rahul Mentor", "Meera Mentor", "Placement Panel", "Industry Guest", "Capstone Mentor"][day],
          date,
          time,
          `${WEEKLY_SESSION_HOURS} hours`,
          day,
          `pragati-weekly-${day + 1}`,
          DEMO_MEETING_URL,
        ],
      );
      const sessionId = result.rows[0]?.id;
      if (!sessionId) continue;
      weeklySessionIds.push(sessionId);

      if (await tableExists("session_schedules")) {
        await pool.query(
          `INSERT INTO session_schedules (session_id, title, trainer, date, time, duration, status)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [sessionId, title, ["Pragati Demo Trainer", "Asha Mentor", "Rahul Mentor", "Meera Mentor", "Placement Panel", "Industry Guest", "Capstone Mentor"][day], date, time, `${WEEKLY_SESSION_HOURS} hours`, day === 0 ? "Live" : "Scheduled"],
        );
      }
      if (await tableExists("session_recordings")) {
        await pool.query(
          `INSERT INTO session_recordings (session_id, title, duration, recording_url)
           VALUES ($1, $2, $3, $4)`,
          [sessionId, `${title} recording`, "42 minutes", WATCH_URL],
        );
      }
    }

    // Two short historical sessions give predictable Past/Present/Absent states and
    // exercise the 60% attendance rule without altering the 7-session weekly fixture.
    const historical = [
      { daysAgo: 1, minutes: 60, attended: true, durationSeconds: 42 * 60, type: "webinar", title: "SM-05 Attendance QA - Present at 70%" },
      { daysAgo: 2, minutes: 90, attended: false, durationSeconds: 20 * 60, type: "workshop", title: "SM-05 Attendance QA - Absent below 60%" },
    ];
    for (const item of historical) {
      const scheduledAt = new Date(Date.now() - item.daysAgo * 24 * 60 * 60 * 1000);
      const date = scheduledAt.toISOString().slice(0, 10);
      const time = scheduledAt.toISOString().slice(11, 16);
      const exists = await pool.query(`SELECT id FROM live_sessions WHERE title = $1 LIMIT 1`, [item.title]);
      const sessionId = exists.rows[0]?.id || (await pool.query(
        `INSERT INTO live_sessions
           (mentor_id, title, session_type, scheduled_at, trainer, date, time, duration, status, room_name, meeting_url)
         VALUES (NULL, $1, $2, $3, 'Attendance QA Mentor', $4, $5, $6, 'Completed', $7, $8)
         RETURNING id`,
        [item.title, item.type, scheduledAt.toISOString(), date, time, `${item.minutes} minutes`, `pragati-attendance-${item.daysAgo}`, DEMO_MEETING_URL],
      )).then((r) => r.rows[0]?.id);

      if (!sessionId) continue;
      const required = Math.round(item.minutes * 60 * 0.6);
      const duration = item.durationSeconds;
      if (demoUserId && await tableExists("session_participants")) {
        await pool.query(
          `INSERT INTO session_participants
             (session_id, student_id, joined_at, left_at, duration_seconds)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (session_id, student_id) DO UPDATE SET
             joined_at = EXCLUDED.joined_at,
             left_at = EXCLUDED.left_at,
             duration_seconds = EXCLUDED.duration_seconds`,
          [sessionId, demoUserId, new Date(scheduledAt.getTime() + 2 * 60 * 1000), new Date(scheduledAt.getTime() + 2 * 60 * 1000 + duration * 1000), duration],
        );
      }
      if (demoUserId && await tableExists("session_attendance")) {
        await pool.query(
          `INSERT INTO session_attendance
             (session_id, student_id, attended, attended_at, status, join_timestamp, leave_timestamp, duration_seconds)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           ON CONFLICT (session_id, student_id) DO UPDATE SET
             attended = EXCLUDED.attended,
             attended_at = EXCLUDED.attended_at,
             status = EXCLUDED.status,
             join_timestamp = EXCLUDED.join_timestamp,
             leave_timestamp = EXCLUDED.leave_timestamp,
             duration_seconds = EXCLUDED.duration_seconds,
             updated_at = NOW()`,
          [sessionId, demoUserId, item.attended && duration >= required, item.attended ? scheduledAt : null, item.attended ? "Present" : "Absent", new Date(scheduledAt.getTime() + 2 * 60 * 1000), new Date(scheduledAt.getTime() + 2 * 60 * 1000 + duration * 1000), duration],
        );
      }
    }
  });

  // ---------------------------------------------------------------------------
  // Shared recruitment-drive fixture used by dashboard/interview/certificate APIs
  // ---------------------------------------------------------------------------
  let driveId = null;
  let companyId = null;
  await safe("demo company + recruitment drive", async () => {
    if (!(await tableExists("companies")) || !(await tableExists("recruitment_drives"))) return;

    const company = await pool.query(`SELECT id FROM companies WHERE name = 'Pragati Demo Technologies' LIMIT 1`);
    companyId = company.rows[0]?.id;
    if (!companyId) {
      const created = await pool.query(
        `INSERT INTO companies (name, email, industry, size, location, website, description, status, verification_status)
         VALUES ('Pragati Demo Technologies', 'company@demo.pragati.local', 'Software', '201-500', 'Hyderabad', 'https://example.com', 'Synthetic company fixture for student-module testing.', 'approved', 'approved')
         RETURNING id`,
      );
      companyId = created.rows[0]?.id;
    }

    const drive = await pool.query(
      `SELECT id FROM recruitment_drives WHERE title = 'SM Demo Full-Stack Recruitment Drive' LIMIT 1`,
    );
    driveId = drive.rows[0]?.id;
    if (!driveId) {
      const result = await pool.query(
        `INSERT INTO recruitment_drives
           (company_id, title, status, current_stage, min_gpa, required_skills, max_openings,
            application_deadline, job_title, department, salary_package, work_mode, location, deadline, frozen)
         VALUES ($1, 'SM Demo Full-Stack Recruitment Drive', 'active', 'training', 7.0,
                 ARRAY['React','Node.js','SQL'], 20, NOW() + INTERVAL '14 days',
                 'Junior Full Stack Developer', 'Engineering', '8-12 LPA', 'Hybrid', 'Hyderabad',
                 NOW() + INTERVAL '14 days', FALSE)
         RETURNING id`,
        [companyId],
      );
      driveId = result.rows[0]?.id;
    }

    if (!driveId) return;

    if (demoUserId && await tableExists("drive_enrollments")) {
      await pool.query(
        `INSERT INTO drive_enrollments (student_id, drive_id)
         VALUES ($1, $2)
         ON CONFLICT (student_id, drive_id) DO NOTHING`,
        [demoUserId, driveId],
      );
    }

    if (await tableExists("student_drive_progress")) {
      const progressValues = [
        ["application", "applied", 0, 0, 70],
        ["screening", "tested", 1, 85, 72],
        ["training", "trained", 3, 76, 78],
        ["shortlist", "trained", 5, 88, 84],
        ["interviews", "trained", 7, 91, 90],
      ];
      // Keep the demo student's main drive in the training stage while peers get other states.
      await pool.query(
        `INSERT INTO student_drive_progress
          (student_id, drive_id, college_id, company_id, current_stage, stage, assessment_score, training_completion, stage_updated_at)
         SELECT $1, $2, NULL, $3, 'training', 'trained', 88, 76, NOW()
         WHERE NOT EXISTS (SELECT 1 FROM student_drive_progress WHERE student_id = $1 AND drive_id = $2)`,
        [demoStudentId, driveId, companyId],
      ).catch(async () => {
        await pool.query(
          `INSERT INTO student_drive_progress (student_id, drive_id, college_id, company_id, stage)
           VALUES ($1, $2, NULL, $3, 'tested')
           ON CONFLICT (student_id, drive_id) DO NOTHING`,
          [demoUserId || demoStudentId, driveId, companyId],
        ).catch(() => undefined);
      });
    }
  });

  // ---------------------------------------------------------------------------
  // SM-06 — assignments: pending/submitted/late/graded + link/file/both
  // ---------------------------------------------------------------------------
  await safe("assignment scenarios", async () => {
    if (!(await tableExists("assignments"))) return;
    const assignmentSeeds = [
      ["SM-06 Pending Assignment", "REST API Validation", "pending", 100, "both", 7, 0, 0],
      ["SM-06 Graded File Assignment", "PostgreSQL", "graded", 100, "file", -3, 0, 0],
      ["SM-06 Late Submission Assignment", "React Debugging", "submitted", 100, "link", -8, 2, 10],
      ["SM-06 Resubmission Assignment", "Node.js API Testing", "submitted", 100, "both", 5, 0, 0],
    ];

    for (const [title, subject, scenario, marks, submissionType, dueOffset, graceDays, penalty] of assignmentSeeds) {
      const existing = await pool.query(`SELECT id FROM assignments WHERE title = $1 LIMIT 1`, [title]);
      let assignmentId = existing.rows[0]?.id;
      if (!assignmentId) {
        const result = await pool.query(
          `INSERT INTO assignments
             (student_id, title, subject, description, due_date, total_marks, status, submission_type,
              grace_days, penalty_per_day, allow_resubmission, max_resubmissions)
           VALUES ($1, $2, $3, $4, CURRENT_DATE + $5, $6, $7, $8, $9, $10, TRUE, 3)
           RETURNING id`,
          [demoStudentId, title, subject, `Synthetic ${scenario} scenario for SM-06 validation.`, dueOffset, marks, scenario === "pending" ? "Open" : "Closed", submissionType, graceDays, penalty],
        );
        assignmentId = result.rows[0]?.id;
      }
      if (!assignmentId || !(await tableExists("assignment_submissions"))) continue;

      const submitted = scenario !== "pending";
      if (submitted) {
        await pool.query(
          `INSERT INTO assignment_submissions
             (assignment_id, student_id, content, file_url, status, submitted_at, submitted_file_name,
              submitted_file_type, late_days, late_penalty, attempt_number)
           VALUES ($1, $2, $3, $4, $5, NOW(), $6, $7, $8, $9, $10)
           ON CONFLICT (assignment_id, student_id) DO UPDATE SET
             content = EXCLUDED.content,
             file_url = EXCLUDED.file_url,
             status = EXCLUDED.status,
             submitted_at = EXCLUDED.submitted_at,
             submitted_file_name = EXCLUDED.submitted_file_name,
             submitted_file_type = EXCLUDED.submitted_file_type,
             late_days = EXCLUDED.late_days,
             late_penalty = EXCLUDED.late_penalty,
             attempt_number = EXCLUDED.attempt_number`,
          [
            assignmentId,
            demoStudentId,
            submissionType === "link" ? "https://docs.google.com/document/d/demo-assignment" : "Completed implementation and notes.",
            submissionType === "file" || submissionType === "both" ? "https://example.com/uploads/demo-assignment.zip" : null,
            scenario === "graded" ? "Submitted" : scenario === "submitted" ? "Submitted" : "Late",
            submissionType === "file" || submissionType === "both" ? "sm06-demo-submission.zip" : null,
            submissionType === "file" || submissionType === "both" ? "application/zip" : "text/uri-list",
            scenario === "submitted" && dueOffset < 0 ? 2 : 0,
            scenario === "submitted" && dueOffset < 0 ? 20 : 0,
            scenario === "graded" ? 1 : 2,
          ],
        ).catch(() => undefined);
      }

      if (scenario === "graded" && await tableExists("assignment_feedback")) {
        await pool.query(
          `INSERT INTO assignment_feedback (assignment_id, student_id, remarks, grade, inline_comments)
           VALUES ($1, $2, $3, $4, $5::jsonb)
           ON CONFLICT (assignment_id, student_id) DO UPDATE SET remarks = EXCLUDED.remarks, grade = EXCLUDED.grade, inline_comments = EXCLUDED.inline_comments`,
          [assignmentId, demoStudentId, "Strong API structure. Improve validation edge-case coverage.", "82", JSON.stringify([{ line: 18, comment: "Consider validating an empty payload." }])],
        ).catch(() => undefined);
      }
      if (scenario === "graded" && await tableExists("assignment_grades")) {
        await pool.query(
          `INSERT INTO assignment_grades (assignment_id, student_id, score, remarks)
           VALUES ($1, $2, 82, $3)
           ON CONFLICT (assignment_id, student_id) DO UPDATE SET score = EXCLUDED.score, remarks = EXCLUDED.remarks`,
          [assignmentId, demoStudentId, "Good implementation; add more negative-path tests."],
        ).catch(() => undefined);
      }
    }
  });

  // ---------------------------------------------------------------------------
  // SM-07 — all four question types + submitted/auto-submitted/expired attempts
  // ---------------------------------------------------------------------------
  let assessmentIds = [];
  await safe("assessment scenarios", async () => {
    if (!(await tableExists("assessments")) || !(await tableExists("assessment_questions"))) return;

    const assessmentSeed = [
      ["SM-07 All Types Demo", "MCQ", "Medium", 20, 40, 2, true, "active"],
      ["SM-07 Auto Submit Scenario", "MCQ", "Easy", 10, 20, 1, false, "active"],
      ["SM-07 Expired Scenario", "MCQ", "Hard", 15, 30, 1, true, "active"],
      ["SM-07 In Progress Scenario", "MCQ", "Medium", 30, 30, 1, false, "active"],
    ];
    for (const [title, type, difficulty, minutes, marks, attempts, review, status] of assessmentSeed) {
      let id = (await pool.query(`SELECT id FROM assessments WHERE title = $1 LIMIT 1`, [title])).rows[0]?.id;
      if (!id) {
        id = (await pool.query(
          `INSERT INTO assessments
             (title, type, difficulty, time_limit_minutes, total_marks, status, max_attempts,
              review_enabled, review_available_at, shuffle_questions, shuffle_options, passing_percentage, published_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), TRUE, TRUE, 40, NOW())
           RETURNING id`,
          [title, type, difficulty, minutes, marks, status, attempts, review],
        )).rows[0]?.id;
      }
      if (id) assessmentIds.push(id);
    }

    const allTypesId = (await pool.query(`SELECT id FROM assessments WHERE title = 'SM-07 All Types Demo' LIMIT 1`)).rows[0]?.id;
    if (allTypesId) {
      const questions = [
        ["MCQ", "Which HTTP method conventionally creates a resource?", ["GET", "POST", "PUT", "DELETE"], 2, "2", "POST creates a new resource in the usual REST convention.", 10],
        ["TRUE_FALSE", "Props should be treated as read-only inputs by a React child component.", ["True", "False"], null, "true", "Props flow into a child and should not be mutated by the child.", 10],
        ["FILL_BLANK", "The array transformation method is ____. ", null, null, JSON.stringify(["map"]), "Array.prototype.map produces a new transformed array.", 10],
        ["MATCH", "Match each layer to its responsibility.", { left: ["Route", "Controller", "Service", "Model"], right: ["Request orchestration", "HTTP transport", "Business logic", "SQL/data access"] }, null, JSON.stringify({ Route: "Request orchestration", Controller: "HTTP transport", Service: "Business logic", Model: "SQL/data access" }), "Each layer owns a distinct architectural concern.", 10],
      ];
      for (const [type, text, options, correctOption, correctAnswer, explanation, marks] of questions) {
        await pool.query(
          `INSERT INTO assessment_questions
             (assessment_id, type, question_text, options, correct_option, correct_answer, explanation, marks)
           SELECT $1, $2, $3, $4::jsonb, $5, $6::jsonb, $7, $8
           WHERE NOT EXISTS (SELECT 1 FROM assessment_questions WHERE assessment_id = $1 AND question_text = $3)`,
          [allTypesId, type, text, options == null ? null : JSON.stringify(options), correctOption, correctAnswer, explanation, marks],
        ).catch(() => undefined);
      }
    }

    if (await tableExists("assessment_assignments") && driveId) {
      for (const id of assessmentIds) {
        await pool.query(
          `INSERT INTO assessment_assignments (assessment_id, drive_id)
           SELECT $1, $2
           WHERE NOT EXISTS (SELECT 1 FROM assessment_assignments WHERE assessment_id = $1 AND drive_id = $2)`,
          [id, driveId],
        ).catch(() => undefined);
      }
    }

    if (await tableExists("student_assessment_attempts") && allTypesId) {
      const questionRows = await pool.query(
        `SELECT id FROM assessment_questions WHERE assessment_id = $1 ORDER BY id`,
        [allTypesId],
      );
      const scenarios = [
        [1, "submitted", 82, 82, 2],
        [2, "auto_submitted", 67, 67, 1],
        [3, "expired", null, null, 0],
      ];
      for (const [attemptNumber, status, score, percentage, tabSwitches] of scenarios) {
        const started = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
        const expires = new Date(started.getTime() + 20 * 60 * 1000);
        const submittedAt = status === "expired" ? null : new Date(started.getTime() + 17 * 60 * 1000);
        await pool.query(
          `INSERT INTO student_assessment_attempts
             (assessment_id, student_id, attempt_number, status, started_at, expires_at, submitted_at,
              score, total_marks, percentage, passed, tab_switch_count)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 40, $9, $10, $11)
           ON CONFLICT (assessment_id, student_id, attempt_number) DO UPDATE SET
             status = EXCLUDED.status,
             submitted_at = EXCLUDED.submitted_at,
             score = EXCLUDED.score,
             percentage = EXCLUDED.percentage,
             passed = EXCLUDED.passed,
             tab_switch_count = EXCLUDED.tab_switch_count`,
          [allTypesId, demoStudentId, attemptNumber, status, started, expires, submittedAt, score, percentage, score == null ? null : score >= 40, tabSwitches],
        );
      }
    }
  });

  // ---------------------------------------------------------------------------
  // SM-08 — coding challenge types: Easy/Medium/Hard, all languages + verdicts
  // ---------------------------------------------------------------------------
  let codingChallengeIds = [];
  await safe("coding challenge scenarios", async () => {
    if (!(await tableExists("assessments")) || !(await tableExists("coding_test_cases"))) return;
    const seeds = [
      ["SM-08 Coding Easy - Two Sum", "Easy", 30, 100],
      ["SM-08 Coding Medium - Sliding Window", "Medium", 45, 100],
      ["SM-08 Coding Hard - Graph DP", "Hard", 60, 100],
    ];
    for (const [title, difficulty, minutes, marks] of seeds) {
      let id = (await pool.query(`SELECT id FROM assessments WHERE title = $1 LIMIT 1`, [title])).rows[0]?.id;
      if (!id) {
        id = (await pool.query(
          `INSERT INTO assessments
             (title, type, difficulty, time_limit_minutes, total_marks, status, start_at, due_at, published_at,
              max_attempts, review_enabled, passing_percentage, memory_limit_mb)
           VALUES ($1, 'Coding', $2, $3, $4, 'active', NOW() - INTERVAL '1 hour', NOW() + INTERVAL '14 days', NOW(), 1, FALSE, 40, 256)
           RETURNING id`,
          [title, difficulty, minutes, marks],
        )).rows[0]?.id;
      }
      if (!id) continue;
      codingChallengeIds.push(id);
      const cases = [
        ["[2,7,11,15]\n9", "[0,1]", false, 25],
        ["[3,2,4]\n6", "[1,2]", false, 25],
        ["[1,5,9,12]\n10", "[1,2]", true, 25],
        ["[-4,-1,-7]", "-1", true, 25],
      ];
      for (const [input, output, hidden, weight] of cases) {
        await pool.query(
          `INSERT INTO coding_test_cases (challenge_id, input, expected_output, is_hidden, weight_pct, time_limit_ms)
           SELECT $1, $2, $3, $4, $5, 2000
           WHERE NOT EXISTS (SELECT 1 FROM coding_test_cases WHERE challenge_id = $1 AND input = $2)`,
          [id, input, output, hidden, weight],
        );
      }
      if (await tableExists("coding_languages")) {
        for (const [languageId, languageName] of [[63, "javascript"], [71, "python"], [62, "java"], [54, "cpp"]]) {
          await pool.query(
            `INSERT INTO coding_languages (challenge_id, language_id, language_name)
             SELECT $1, $2, $3
             WHERE NOT EXISTS (SELECT 1 FROM coding_languages WHERE challenge_id = $1 AND language_id = $2)`,
            [id, languageId, languageName],
          );
        }
      }
    }

    if (demoUserId && await tableExists("challenge_submissions") && codingChallengeIds.length) {
      const demoCodes = [
        [63, "function twoSum(nums,target){return [0,1];}", 100, "Accepted", 4, 4, "final", true, 720],
        [71, "def solve():\n    return None", 50, "Wrong Answer", 2, 4, "run", false, 180],
        [62, "class Main { public static void main(String[] a) {} }", 25, "Time Limit Exceeded", 1, 4, "run", false, 420],
        [54, "#include <bits/stdc++.h>\nint main(){}", 0, "Runtime Error", 0, 4, "run", false, 90],
      ];
      for (let i = 0; i < demoCodes.length; i += 1) {
        const challengeId = codingChallengeIds[i % codingChallengeIds.length];
        const [languageId, sourceCode, score, verdict, passed, total, submissionType, isFinal, solveTime] = demoCodes[i];
        if (isFinal) {
          await pool.query(
            `DELETE FROM challenge_submissions WHERE student_id = $1 AND challenge_id = $2 AND is_final = TRUE AND submission_type = 'final'`,
            [demoUserId, challengeId],
          ).catch(() => undefined);
        }
        await pool.query(
          `INSERT INTO challenge_submissions
             (student_id, challenge_id, language_id, source_code, total_score, execution_time_ms,
              judge0_verdict, passed_test_cases, total_test_cases, submission_type, is_final, solve_time_seconds)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
          [demoUserId, challengeId, languageId, sourceCode, score, solveTime, verdict, passed, total, submissionType, isFinal, solveTime],
        );
      }
    }
  });

  // ---------------------------------------------------------------------------
  // SM-09 — project states, milestone states, final versions, rubric feedback
  // ---------------------------------------------------------------------------
  await safe("project scenarios", async () => {
    if (!(await tableExists("student_projects"))) return;
    const projectSeeds = [
      ["SM-09 Project - Not Started", "NOT_STARTED", 14],
      ["SM-09 Project - In Progress", "IN_PROGRESS", 21],
      ["SM-09 Project - Submitted", "SUBMITTED", 28],
      ["SM-09 Project - Graded", "COMPLETED", 35],
    ];
    for (const [title, status, days] of projectSeeds) {
      let projectId = (await pool.query(`SELECT id FROM student_projects WHERE student_id = $1 AND title = $2 LIMIT 1`, [demoStudentId, title])).rows[0]?.id;
      if (!projectId) {
        projectId = (await pool.query(
          `INSERT INTO student_projects
             (student_id, title, description, objectives, requirements, deliverables, tech_stack, resources,
              evaluation_criteria, deadline, status, mentor_name, batch_name, duration_weeks)
           VALUES ($1, $2, $3, $4::jsonb, $5::jsonb, $6::jsonb, $7::jsonb, $8::jsonb, $9::jsonb,
                   NOW() + $10 * INTERVAL '1 day', $11, 'Training Mentor', 'Student Demo Batch', 6)
           RETURNING id`,
          [
            demoStudentId,
            title,
            `Synthetic ${status} project scenario for SM-09 testing.`,
            JSON.stringify(["Define scope", "Implement core feature", "Validate deployment"]),
            JSON.stringify(["React", "REST API", "Responsive UI"]),
            JSON.stringify(["GitHub URL", "Deployment URL", "PDF report"]),
            JSON.stringify(["React", "Node.js", "PostgreSQL"]),
            JSON.stringify([{ label: "React docs", url: "https://react.dev" }]),
            JSON.stringify([
              { id: "functionality", criterion: "Functionality", maxScore: 40, weight: 40 },
              { id: "quality", criterion: "Code Quality", maxScore: 30, weight: 30 },
              { id: "documentation", criterion: "Documentation", maxScore: 30, weight: 30 },
            ]),
            days,
            status,
          ],
        )).rows[0]?.id;
      }
      if (!projectId) continue;

      if (await tableExists("project_milestones")) {
        const milestoneStates = [
          ["Planning", "COMPLETED", 100, 7],
          ["Core Development", status === "NOT_STARTED" ? "PENDING" : "IN_PROGRESS", status === "NOT_STARTED" ? 0 : 65, 14],
          ["Testing & Review", status === "COMPLETED" ? "COMPLETED" : "PENDING", status === "COMPLETED" ? 100 : 0, 21],
          ["Final Submission", status === "SUBMITTED" || status === "COMPLETED" ? "SUBMITTED" : "PENDING", status === "SUBMITTED" || status === "COMPLETED" ? 100 : 0, 28],
        ];
        for (let i = 0; i < milestoneStates.length; i += 1) {
          const [title, milestoneStatus, progress, offset] = milestoneStates[i];
          await pool.query(
            `INSERT INTO project_milestones (project_id, title, description, deadline, status, progress, milestone_order)
             VALUES ($1, $2, $3, NOW() + $4 * INTERVAL '1 day', $5, $6, $7)
             ON CONFLICT (project_id, milestone_order) DO UPDATE SET
               status = EXCLUDED.status,
               progress = EXCLUDED.progress,
               deadline = EXCLUDED.deadline`,
            [projectId, title, `Synthetic milestone ${i + 1} for ${status}.`, offset, milestoneStatus, progress, i + 1],
          );
        }
      }

      if ((status === "SUBMITTED" || status === "COMPLETED") && await tableExists("project_submissions")) {
        await pool.query(
          `INSERT INTO project_submissions
             (project_id, student_id, version, github_url, deployment_url, description, documentation,
              report_url, additional_comments, status, feedback, report_mime_type, report_size_bytes)
           VALUES ($1, $2, 1, $3, $4, $5, $6, $7, $8, $9, $10, 'application/pdf', 245760)
           ON CONFLICT (project_id, version) DO UPDATE SET
             github_url = EXCLUDED.github_url,
             deployment_url = EXCLUDED.deployment_url,
             status = EXCLUDED.status,
             feedback = EXCLUDED.feedback`,
          [projectId, demoStudentId, "https://github.com/pragati-demo/student-project", "https://demo-project.example.com", "Final submission fixture", "README and deployment notes", "https://example.com/reports/project-report.pdf", "Ready for mentor review", status === "COMPLETED" ? "APPROVED" : "SUBMITTED", status === "COMPLETED" ? "Strong submission. Add broader automated test coverage." : null],
        ).catch(() => undefined);
      }

      if (status === "COMPLETED" && await tableExists("project_evaluations")) {
        await pool.query(
          `INSERT INTO project_evaluations
             (project_id, score, status, criteria, strengths, improvements, feedback)
           VALUES ($1, 88, 'EVALUATED', $2::jsonb, $3::jsonb, $4::jsonb, $5)
           ON CONFLICT (project_id) DO UPDATE SET
             score = EXCLUDED.score,
             status = EXCLUDED.status,
             criteria = EXCLUDED.criteria,
             strengths = EXCLUDED.strengths,
             improvements = EXCLUDED.improvements,
             feedback = EXCLUDED.feedback,
             evaluated_at = NOW()`,
          [
            projectId,
            JSON.stringify([{ criterion: "Functionality", score: 36 }, { criterion: "Code Quality", score: 26 }, { criterion: "Documentation", score: 26 }]),
            JSON.stringify(["Clean UI", "Good service separation"]),
            JSON.stringify(["Add integration tests", "Document error cases"]),
            "Very good capstone. Prioritize testing depth next.",
          ],
        ).catch(() => undefined);
      }
    }

    if (await tableExists("project_milestone_submissions")) {
      const milestones = await pool.query(
        `SELECT p.id AS project_id, m.id AS milestone_id
           FROM student_projects p
           JOIN project_milestones m ON m.project_id = p.id
          WHERE p.student_id = $1 AND p.title = 'SM-09 Project - In Progress'
          ORDER BY m.milestone_order
          LIMIT 2`,
        [demoStudentId],
      );
      for (const milestone of milestones.rows) {
        await pool.query(
          `INSERT INTO project_milestone_submissions
             (project_id, milestone_id, student_id, github_url, deployed_url, progress_notes, status, feedback)
           VALUES ($1, $2, $3, 'https://github.com/pragati-demo/student-project', 'https://demo-project.example.com', $4, 'SUBMITTED', $5)
           ON CONFLICT (student_id, milestone_id) DO UPDATE SET
             progress_notes = EXCLUDED.progress_notes,
             feedback = EXCLUDED.feedback,
             status = EXCLUDED.status,
             updated_at = NOW()`,
          [milestone.project_id, milestone.milestone_id, demoStudentId, "Implemented the current milestone and documented blockers.", "Looks good. Continue with the next checkpoint."],
        );
      }
    }
  });

  // ---------------------------------------------------------------------------
  // SM-10 — analytics source data: per-type activity submissions + XP/rank
  // ---------------------------------------------------------------------------
  await safe("performance analytics source data", async () => {
    if (await tableExists("activity_submissions")) {
      const types = [
        ["JS Fundamentals Quiz", "quiz", 82, "graded"],
        ["REST API Assignment", "assignment", 74, "graded"],
        ["Two Sum Coding Challenge", "coding", 68, "graded"],
        ["Placement Case Study", "casestudy", 79, "graded"],
        ["Capstone Project", "project", 88, "graded"],
      ];
      for (const [title, type, score, status] of types) {
        // Canonical SM-07/09 tables require assessment_id/attempt_id for some databases.
        // Start with the legacy-compatible shape and fall back to the newer schema.
        await pool.query(
          `INSERT INTO activity_submissions (student_id, drive_id, activity_title, activity_type, status, score, submitted_at)
           SELECT $1, $2, $3, $4, $5, $6, NOW() - $7 * INTERVAL '1 day'
           WHERE NOT EXISTS (
             SELECT 1 FROM activity_submissions
              WHERE student_id = $1 AND activity_title = $3
           )`,
          [demoUserId || demoStudentId, driveId, title, type, status, score, Math.max(1, types.indexOf(types.find((item) => item[0] === title)) + 2)],
        ).catch(() => undefined);
      }
    }
    if (demoUserId && await tableExists("student_progress") && driveId) {
      const supportsXp = await columnExists("student_progress", "xp_total");
      const supportsOverall = await columnExists("student_progress", "overall_score");
      if (supportsXp || supportsOverall) {
        const sets = [];
        const values = [demoUserId, driveId];
        if (supportsXp) { values.push(340); sets.push(`xp_total = $${values.length}`); }
        if (supportsOverall) { values.push(74.2); sets.push(`overall_score = $${values.length}`); }
        if (sets.length) {
          await pool.query(
            `UPDATE student_progress SET ${sets.join(", ")} WHERE student_id = $1 AND drive_id = $2`,
            values,
          );
        }
      }
    }
  });

  // ---------------------------------------------------------------------------
  // SM-11 — interview pipeline scenarios: invited, confirmed, completed outcomes
  // ---------------------------------------------------------------------------
  await safe("interview scenarios", async () => {
    if (!(await tableExists("interviews"))) return;
    const interviewColumns = await pool.query(
      `SELECT column_name FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'interviews'`,
    );
    const available = new Set(interviewColumns.rows.map((row) => row.column_name));
    const insertInterview = async (scenario, status, offsetDays, outcome) => {
      if (!demoStudentId || (available.has("student_id") === false)) return;
      const fields = ["student_id"];
      const placeholders = ["$1"];
      const values = [demoStudentId];
      const put = (column, value) => {
        if (!available.has(column)) return;
        fields.push(column);
        values.push(value);
        placeholders.push(`$${values.length}`);
      };
      put("drive_id", driveId);
      put("title", `SM-11 ${scenario}`);
      put("company_name", "Pragati Demo Technologies");
      put("scheduled_at", new Date(Date.now() + offsetDays * 24 * 60 * 60 * 1000).toISOString());
      put("format", "video");
      put("status", status);
      put("interview_type", "TECHNICAL");
      put("meeting_link", "https://meet.example.com/pragati-demo-interview");
      put("join_url", "https://meet.example.com/pragati-demo-interview");
      put("outcome", outcome);
      if (fields.length > 1) {
        const query = `INSERT INTO interviews (${fields.join(",")}) VALUES (${placeholders.join(",")})`;
        await pool.query(query, values).catch(() => undefined);
      }
    };
    await insertInterview("Invited Scenario", "INVITED", 2, null);
    await insertInterview("Confirmed Scenario", "CONFIRMED", 4, null);
    await insertInterview("Selected Outcome Scenario", "COMPLETED", -5, "SELECTED");
    await insertInterview("Rejected Outcome Scenario", "COMPLETED", -3, "REJECTED");
    await insertInterview("Waitlisted Outcome Scenario", "COMPLETED", -2, "WAITLISTED");
  });

  // SM-11 placement-intelligence companion tables.
  await safe("placement intelligence scenarios", async () => {
    if (!(await tableExists("job_applications"))) return;
    const applications = [
      ["TechCorp", "Junior Full Stack Developer", "SHORTLISTED"],
      ["InnovateX", "Backend Engineer Intern", "APPLIED"],
      ["DataWorks", "Software Engineer", "REJECTED"],
      ["CloudNine", "Frontend Engineer", "SELECTED"],
    ];
    for (const [company, title, status] of applications) {
      await pool.query(
        `INSERT INTO job_applications (student_id, company_name, job_title, job_id, status, applied_date, notes, history)
         SELECT $1, $2, $3, $4, $5, NOW() - INTERVAL '5 days', $6, jsonb_build_array(jsonb_build_object('status', $5, 'changedAt', NOW()::text))
         WHERE NOT EXISTS (SELECT 1 FROM job_applications WHERE student_id = $1 AND company_name = $2 AND job_title = $3)`,
        [demoStudentId, company, title, `${company.toUpperCase().slice(0, 4)}-DEMO-01`, status, `SM-11/placement ${status.toLowerCase()} scenario.`],
      );
    }

    if (await tableExists("placement_interviews")) {
      const rows = await pool.query(`SELECT id, company_name, job_title FROM job_applications WHERE student_id = $1 ORDER BY id LIMIT 3`, [demoStudentId]);
      for (const [index, application] of rows.rows.entries()) {
        await pool.query(
          `INSERT INTO placement_interviews
             (student_id, application_id, company_name, job_title, date_time, location, type, status, feedback, score)
           SELECT $1, $2, $3, $4, NOW() + $5 * INTERVAL '1 day', $6, $7, $8, $9, $10
           WHERE NOT EXISTS (SELECT 1 FROM placement_interviews WHERE student_id = $1 AND application_id = $2)`,
          [demoStudentId, application.id, application.company_name, application.job_title, index - 1, index === 2 ? "Office - Hyderabad" : "Online", ["TECHNICAL", "HR", "MANAGERIAL"][index], index === 2 ? "COMPLETED" : "SCHEDULED", index === 2 ? "Good communication and structured thinking." : null, index === 2 ? 86 : null],
        );
      }
    }
  });

  // ---------------------------------------------------------------------------
  // SM-12 — notification event types + read/unread distribution + preferences
  // ---------------------------------------------------------------------------
  await safe("notification scenarios", async () => {
    if (!(await tableExists("notifications")) || !demoUserId) return;
    const notificationTypes = [
      ["grade_released", "Assignment Graded", "Your REST API assignment scored 82/100.", "success", false],
      ["session_scheduled", "New live session scheduled", "A mentor session starts tomorrow.", "info", false],
      ["assignment_published", "New assignment", "A new React debugging assignment is available.", "info", true],
      ["shortlisted", "You were shortlisted", "TechCorp moved your application to shortlisted.", "success", false],
      ["interview_invited", "Interview invitation", "Your technical interview invitation is ready.", "info", false],
      ["interview_outcome", "Interview outcome", "Your interview outcome has been published.", "success", true],
      ["platform_announcement", "Platform announcement", "Pragati will be unavailable for maintenance this weekend.", "warning", true],
      ["certificate_issued", "Certificate issued", "Congratulations — your Pragati certificate is ready.", "success", false],
    ];
    for (const [typeKey, title, message, type, read] of notificationTypes) {
      await pool.query(
        `INSERT INTO notifications (student_auth_user_id, user_id, title, message, type, link_url, is_read, created_at)
         SELECT NULL, $1, $2, $3, $4, $5, $6, NOW() - $7 * INTERVAL '1 hour'
         WHERE NOT EXISTS (SELECT 1 FROM notifications WHERE user_id = $1 AND title = $2)`,
        [demoUserId, title, message, type, `/student/${typeKey}`, read, notificationTypes.findIndex((item) => item[0] === typeKey) + 1],
      ).catch(() => undefined);
    }

    if (await tableExists("notification_preferences")) {
      for (const [typeKey] of notificationTypes) {
        await pool.query(
          `INSERT INTO notification_preferences (student_id, notification_type, in_app, email, push)
           VALUES ($1, $2, TRUE, TRUE, TRUE)
           ON CONFLICT (student_id, notification_type) DO UPDATE SET in_app = TRUE, email = TRUE, push = TRUE, updated_at = NOW()`,
          [demoStudentId, typeKey],
        ).catch(() => undefined);
      }
    }

    if (await tableExists("student_notification_preferences")) {
      await pool.query(
        `INSERT INTO student_notification_preferences
           (student_id, in_app, email, push, assignment_reminders, assessment_reminders, interview_updates, session_reminders, weekly_digest)
         VALUES ($1, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE)
         ON CONFLICT (student_id) DO UPDATE SET
           in_app = TRUE, email = TRUE, push = TRUE, assignment_reminders = TRUE,
           assessment_reminders = TRUE, interview_updates = TRUE, session_reminders = TRUE,
           weekly_digest = TRUE, updated_at = NOW()`,
        [demoStudentId],
      ).catch(() => undefined);
    }
  });

  // ---------------------------------------------------------------------------
  // SM-13 — certificate states: earned + revoked-style record without violating uniqueness
  // ---------------------------------------------------------------------------
  await safe("certificate scenarios", async () => {
    if (!(await tableExists("certificates")) || !demoUserId) return;
    if (driveId) {
      await pool.query(
        `INSERT INTO certificates (student_id, drive_id, certificate_url, score, issued_at, revoked)
         SELECT $1, $2, 'https://example.com/certificates/pragati-demo-earned.pdf', 88.5, NOW() - INTERVAL '10 days', FALSE
         WHERE NOT EXISTS (SELECT 1 FROM certificates WHERE student_id = $1 AND drive_id = $2)`,
        [demoUserId, driveId],
      ).catch(() => undefined);
    }
    // A revoked certificate uses a second synthetic drive when the schema allows it.
    if (driveId) {
      const secondDrive = await pool.query(`SELECT id FROM recruitment_drives WHERE title = 'SM Demo Completed Drive' LIMIT 1`);
      let revokedDriveId = secondDrive.rows[0]?.id;
      if (!revokedDriveId && companyId) {
        revokedDriveId = (await pool.query(
          `INSERT INTO recruitment_drives (company_id, title, status, current_stage, max_openings, deadline)
           VALUES ($1, 'SM Demo Completed Drive', 'completed', 'selection', 10, NOW() - INTERVAL '5 days')
           RETURNING id`,
          [companyId],
        )).rows[0]?.id;
      }
      if (revokedDriveId) {
        await pool.query(
          `INSERT INTO certificates (student_id, drive_id, certificate_url, score, issued_at, revoked, revoked_at)
           SELECT $1, $2, 'https://example.com/certificates/pragati-demo-revoked.pdf', 62, NOW() - INTERVAL '30 days', TRUE, NOW() - INTERVAL '4 days'
           WHERE NOT EXISTS (SELECT 1 FROM certificates WHERE student_id = $1 AND drive_id = $2)`,
          [demoUserId, revokedDriveId],
        ).catch(() => undefined);
      }
    }
  });

  // ---------------------------------------------------------------------------
  // Final diagnostics — makes the seed self-checking instead of silently claiming
  // coverage. Counts are intentionally scoped to the synthetic demo prefixes.
  // ---------------------------------------------------------------------------
  const counts = {};
  const checks = [
    ["weeklySessions", `SELECT COUNT(*)::int AS count FROM live_sessions WHERE title LIKE 'SM-05 Weekly QA Session %'`],
    ["assignments", `SELECT COUNT(*)::int AS count FROM assignments WHERE title LIKE 'SM-06 %'`],
    ["assessments", `SELECT COUNT(*)::int AS count FROM assessments WHERE title LIKE 'SM-07 %'`],
    ["codingChallenges", `SELECT COUNT(*)::int AS count FROM assessments WHERE title LIKE 'SM-08 %'`],
    ["projects", `SELECT COUNT(*)::int AS count FROM student_projects WHERE student_id = $1 AND title LIKE 'SM-09 %'`],
    ["notifications", `SELECT COUNT(*)::int AS count FROM notifications WHERE user_id = $1 AND (title LIKE '%assignment%' OR title LIKE '%session%' OR title LIKE '%Interview%' OR title LIKE '%Certificate%' OR title LIKE '%shortlisted%' OR title LIKE '%announcement%' OR title LIKE '%Graded%')`],
  ];
  for (const [name, query] of checks) {
    const params = query.includes("$1") ? [demoUserId || demoStudentId] : [];
    const result = await safe(`count ${name}`, () => pool.query(query, params));
    counts[name] = result?.rows?.[0]?.count ?? 0;
  }

  console.log("\n✅ Student Demo seed completed");
  console.log(`   Primary student: ${demoStudent.name} / ${demoStudent.email}`);
  console.log(`   Weekly SM-05 sessions: ${counts.weeklySessions} (expected 7 × 24 hours)`);
  console.log(`   SM-06 assignment scenarios: ${counts.assignments}`);
  console.log(`   SM-07 assessment scenarios: ${counts.assessments}`);
  console.log(`   SM-08 coding challenge scenarios: ${counts.codingChallenges}`);
  console.log(`   SM-09 project scenarios: ${counts.projects}`);
  console.log(`   SM-12 notifications: ${counts.notifications}`);
  console.log(`   Demo recording: ${WATCH_URL}`);
  console.log("   Note: SM-01 Firebase login/refresh itself still requires a real Firebase-authenticated browser session; the seed covers its persistent student/onboarding state.");
};

try {
  await seed();
} catch (error) {
  console.error("[seedStudentDemoData] Failed:", error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
