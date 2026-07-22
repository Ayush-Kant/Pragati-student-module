import { pool } from "../../config/db.js";

export const resolveStudentId = async (uuidId) => {
  const query = `
    SELECT
      s.id AS "studentId",
      COALESCE(u.full_name, s.full_name) AS "fullName"
    FROM auth_users au
    JOIN users u ON u.auth_user_id = au.id
    LEFT JOIN students s ON s.email = au.email
    WHERE au.uuid_id = $1
  `;

  const { rows } = await pool.query(query, [uuidId]);
  return rows[0] ?? null;
};

export const fetchEnrolledCourses = async (studentId) => {
  const query = `
    SELECT
      tc.id AS "courseId",
      tc.title AS "courseTitle",
      tc.category AS "skillTags",
      'published' AS status,
      scp.created_at AS "enrolledAt"
    FROM student_course_progress scp
    JOIN training_courses tc ON tc.id = scp.course_id
    WHERE scp.student_id = $1
    ORDER BY scp.created_at DESC
  `;

  const { rows } = await pool.query(query, [studentId]);
  return rows;
};

export const fetchLessonProgress = async (studentId) => {
  const query = `
    SELECT
      lp.lesson_id AS "lessonId",
      0 AS "watchSeconds",
      CASE WHEN lp.completed THEN 'completed' ELSE 'not_started' END AS status,
      lp.completed_at AS "updatedAt"
    FROM lesson_progress lp
    WHERE lp.student_id = $1
  `;

  const { rows } = await pool.query(query, [studentId]);
  return rows;
};

export const fetchCourseStructure = async (courseIds) => {
  if (!Array.isArray(courseIds) || courseIds.length === 0) {
    return [];
  }

  const query = `
    SELECT
      tc.id AS "courseId",
      cm.id AS "moduleId",
      cm.title AS "moduleTitle",
      cm.module_order AS "moduleOrder",
      l.id AS "lessonId",
      l.title AS "lessonTitle",
      CASE WHEN l.video_url IS NOT NULL AND l.video_url <> '' THEN 'video' ELSE 'lesson' END AS "contentType",
      CASE
        WHEN trim(l.duration) ~ '^[0-9]+$' THEN trim(l.duration)::INT
        ELSE 0
      END AS "durationSeconds",
      l.lesson_order AS "lessonOrder"
    FROM training_courses tc
    JOIN course_modules cm ON cm.course_id = tc.id
    LEFT JOIN lessons l ON l.module_id = cm.id
    WHERE tc.id = ANY($1)
    ORDER BY tc.id, cm.module_order, l.lesson_order
  `;

  const { rows } = await pool.query(query, [courseIds]);
  return rows;
};

export const getCourseProgress = async (studentId) => {
  const query = `
    SELECT
      scp.id,
      scp.student_id,
      scp.course_id,
      tc.title AS course_title,
      scp.completed_lessons,
      scp.total_lessons,
      scp.progress,
      scp.updated_at
    FROM student_course_progress scp
    JOIN training_courses tc ON tc.id = scp.course_id
    WHERE scp.student_id = $1
    ORDER BY scp.updated_at DESC;
  `;

  const { rows } = await pool.query(query, [studentId]);
  return rows;
};

export const getCourseProgressById = async (studentId, courseId) => {
  const query = `
    SELECT
      scp.id,
      scp.student_id,
      scp.course_id,
      tc.title AS course_title,
      scp.completed_lessons,
      scp.total_lessons,
      scp.progress,
      scp.updated_at
    FROM student_course_progress scp
    JOIN training_courses tc ON tc.id = scp.course_id
    WHERE scp.student_id = $1
      AND scp.course_id = $2
    LIMIT 1;
  `;

  const { rows } = await pool.query(query, [studentId, courseId]);
  return rows.length > 0 ? rows[0] : null;
};

export const updateCourseProgress = async (studentId, courseId, progress) => {
  const courseExists = await pool.query(
    `
      SELECT 1
      FROM training_courses
      WHERE id = $1
    `,
    [courseId]
  );

  if (courseExists.rows.length === 0) {
    return null;
  }

  const query = `
    INSERT INTO student_course_progress (student_id, course_id, progress, completed_lessons, total_lessons, created_at, updated_at)
    VALUES ($1, $2, $3, 0, 0, NOW(), NOW())
    ON CONFLICT (student_id, course_id)
    DO UPDATE SET progress = EXCLUDED.progress,
                  updated_at = NOW()
    RETURNING *;
  `;

  const { rows } = await pool.query(query, [studentId, courseId, progress]);
  return rows[0] ?? null;
};

export const getLearningStatistics = async (studentId) => {
  const query = `
    SELECT
      COALESCE((SELECT COUNT(*) FROM lesson_progress WHERE student_id = $1 AND completed = TRUE), 0)::INT AS completed_lessons,
      COALESCE((
        SELECT COUNT(*)
        FROM lessons l
        JOIN course_modules cm ON cm.id = l.module_id
        JOIN student_course_progress scp ON scp.course_id = cm.course_id
        WHERE scp.student_id = $1
      ), 0)::INT AS total_lessons,
      COALESCE((SELECT AVG(progress) FROM student_course_progress WHERE student_id = $1), 0)::NUMERIC AS average_progress
  `;

  const { rows } = await pool.query(query, [studentId]);
  return rows.length > 0 ? rows[0] : null;
};