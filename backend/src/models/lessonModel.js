import { pool } from "../../config/db.js";

export const getLessons = async (moduleId, studentId) => {
  const moduleExists = await pool.query(
    `
      SELECT 1
      FROM course_modules
      WHERE id = $1
    `,
    [moduleId]
  );

  if (moduleExists.rows.length === 0) {
    return null;
  }

  const query = `
    SELECT
      l.id,
      l.title,
      l.description,
      l.video_url,
      l.duration,
      l.lesson_order,
      l.created_at,
      l.updated_at,
      COUNT(lr.id)::INT AS resource_count,
      lp.completed,
      lp.completed_at
    FROM lessons l
    LEFT JOIN learning_resources lr ON lr.lesson_id = l.id
    LEFT JOIN lesson_progress lp ON lp.lesson_id = l.id AND lp.student_id = $2
    WHERE l.module_id = $1
    GROUP BY l.id, lp.completed, lp.completed_at
    ORDER BY l.lesson_order, l.id;
  `;

  const { rows } = await pool.query(query, [moduleId, studentId]);
  return rows;
};

export const getLessonById = async (lessonId, studentId) => {
  const query = `
    SELECT
      l.id,
      l.title,
      l.description,
      l.video_url,
      l.duration,
      l.lesson_order,
      l.created_at,
      l.updated_at,
      COUNT(lr.id)::INT AS resource_count,
      lp.completed,
      lp.completed_at
    FROM lessons l
    LEFT JOIN learning_resources lr ON lr.lesson_id = l.id
    LEFT JOIN lesson_progress lp ON lp.lesson_id = l.id AND lp.student_id = $2
    WHERE l.id = $1
    GROUP BY l.id, lp.completed, lp.completed_at;
  `;

  const { rows } = await pool.query(query, [lessonId, studentId]);
  return rows.length > 0 ? rows[0] : null;
};

export const getLessonsByCourse = async (courseId, studentId) => {
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
    SELECT
      l.id,
      l.module_id,
      l.title,
      l.description,
      l.video_url,
      l.duration,
      l.lesson_order,
      l.created_at,
      l.updated_at,
      COUNT(lr.id)::INT AS resource_count,
      lp.completed,
      lp.completed_at
    FROM lessons l
    JOIN course_modules cm ON cm.id = l.module_id
    LEFT JOIN learning_resources lr ON lr.lesson_id = l.id
    LEFT JOIN lesson_progress lp ON lp.lesson_id = l.id AND lp.student_id = $2
    WHERE cm.course_id = $1
    GROUP BY l.id, l.module_id, lp.completed, lp.completed_at
    ORDER BY cm.module_order, l.lesson_order, l.id;
  `;

  const { rows } = await pool.query(query, [courseId, studentId]);
  return rows;
};

export const updateLessonProgress = async (lessonId, studentId, completed) => {
  const lessonInfoQuery = `
    SELECT
      l.id,
      cm.course_id
    FROM lessons l
    JOIN course_modules cm ON cm.id = l.module_id
    WHERE l.id = $1
  `;

  const { rows: lessonInfoRows } = await pool.query(lessonInfoQuery, [lessonId]);
  const lessonInfo = lessonInfoRows.length > 0 ? lessonInfoRows[0] : null;

  if (!lessonInfo) {
    return null;
  }

  const upsertQuery = `
    INSERT INTO lesson_progress (student_id, lesson_id, completed, completed_at)
    VALUES ($1, $2, $3, CASE WHEN $3 THEN NOW() ELSE NULL END)
    ON CONFLICT (student_id, lesson_id)
    DO UPDATE SET completed = EXCLUDED.completed,
                  completed_at = CASE WHEN EXCLUDED.completed THEN COALESCE(lesson_progress.completed_at, NOW()) ELSE NULL END
    RETURNING *;
  `;

  const { rows: progressRows } = await pool.query(upsertQuery, [studentId, lessonId, completed]);
  const progressRow = progressRows[0] ?? null;

  if (!progressRow) {
    return null;
  }

  const courseQuery = `
    totals AS (
      SELECT course_id, COUNT(*)::INT AS total_lessons
      FROM lessons l
      JOIN course_modules cm ON cm.id = l.module_id
      WHERE cm.course_id = $3
      GROUP BY course_id
    ),
    completed_totals AS (
      SELECT cm.course_id, COUNT(*)::INT AS completed_lessons
      FROM lesson_progress lp
      JOIN lessons l ON l.id = lp.lesson_id
      JOIN course_modules cm ON cm.id = l.module_id
      WHERE lp.student_id = $2 AND lp.completed = TRUE AND cm.course_id = $3
      GROUP BY cm.course_id
    )
    INSERT INTO student_course_progress (student_id, course_id, completed_lessons, total_lessons, progress, created_at, updated_at)
    SELECT $2, t.course_id, COALESCE(ct.completed_lessons, 0), t.total_lessons,
           CASE WHEN t.total_lessons = 0 THEN 0 ELSE LEAST(100, ROUND((COALESCE(ct.completed_lessons, 0)::NUMERIC / t.total_lessons) * 100)) END,
           NOW(), NOW()
    FROM totals t
    LEFT JOIN completed_totals ct ON ct.course_id = t.course_id
    ON CONFLICT (student_id, course_id)
    DO UPDATE SET completed_lessons = EXCLUDED.completed_lessons,
                  total_lessons = EXCLUDED.total_lessons,
                  progress = EXCLUDED.progress,
                  updated_at = NOW()
    RETURNING *;
  `;

  await pool.query(courseQuery, [lessonId, studentId, lessonInfo.course_id]);

  return progressRow;
};