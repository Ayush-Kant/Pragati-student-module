import { pool } from '../../config/db.js';

const courseSelect = `
  SELECT
    tc.id,
    tc.title,
    tc.category,
    tc.level,
    tc.duration,
    tc.description,
    tc.status,
    tc.created_at,
    tc.updated_at,
    COUNT(DISTINCT l.id)::int AS total_lessons,
    COUNT(DISTINCT lp.id) FILTER (WHERE lp.completed = TRUE)::int AS completed_lessons,
    COALESCE(scp.progress, 0)::int AS progress
  FROM training_courses tc
  LEFT JOIN course_modules cm ON cm.course_id = tc.id
  LEFT JOIN lessons l ON l.module_id = cm.id
  LEFT JOIN lesson_progress lp
    ON lp.lesson_id = l.id
   AND lp.student_id = $1
  LEFT JOIN student_course_progress scp
    ON scp.course_id = tc.id
   AND scp.student_id = $1
`;

export const listStudentCourses = async (studentId) => {
  const courses = await pool.query(
    `${courseSelect}
     WHERE tc.status = 'published'
     GROUP BY tc.id, scp.progress
     ORDER BY tc.created_at DESC, tc.id DESC`,
    [studentId],
  );

  for (const course of courses.rows) {
    await ensureCourseProgress(studentId, course.id, Number(course.total_lessons));
  }

  return courses.rows.map(formatCourse);
};

export const getStudentCourseById = async (studentId, courseId) => {
  const courseResult = await pool.query(
    `${courseSelect}
     WHERE tc.id = $2
       AND tc.status = 'published'
     GROUP BY tc.id, scp.progress`,
    [studentId, courseId],
  );

  if (!courseResult.rows[0]) return null;

  const moduleResult = await pool.query(
    `SELECT
       cm.id,
       cm.course_id,
       cm.title,
       cm.description,
       cm.module_order,
       cm.created_at,
       cm.updated_at
     FROM course_modules cm
     WHERE cm.course_id = $1
     ORDER BY cm.module_order ASC, cm.id ASC`,
    [courseId],
  );

  const lessonResult = await pool.query(
    `SELECT
       l.id,
       l.module_id,
       l.title,
       l.description,
       l.video_url,
       l.duration,
       l.lesson_order,
       COALESCE(lp.completed, FALSE) AS completed,
       lp.completed_at
     FROM lessons l
     JOIN course_modules cm ON cm.id = l.module_id
     LEFT JOIN lesson_progress lp
       ON lp.lesson_id = l.id
      AND lp.student_id = $1
     WHERE cm.course_id = $2
     ORDER BY cm.module_order ASC, l.lesson_order ASC, l.id ASC`,
    [studentId, courseId],
  );

  const resourceResult = await pool.query(
    `SELECT
       lr.id,
       lr.lesson_id,
       lr.title,
       lr.resource_type,
       lr.file_url,
       lr.created_at
     FROM learning_resources lr
     JOIN lessons l ON l.id = lr.lesson_id
     JOIN course_modules cm ON cm.id = l.module_id
     WHERE cm.course_id = $1
     ORDER BY lr.id ASC`,
    [courseId],
  );

  await ensureCourseProgress(studentId, courseId, Number(courseResult.rows[0].total_lessons));

  const lessonsByModule = new Map();
  for (const lesson of lessonResult.rows) {
    const resources = resourceResult.rows
      .filter((resource) => Number(resource.lesson_id) === Number(lesson.id))
      .map((resource) => ({
        id: resource.id,
        title: resource.title,
        type: resource.resource_type,
        fileUrl: resource.file_url,
        createdAt: resource.created_at,
      }));

    const payload = {
      id: lesson.id,
      moduleId: lesson.module_id,
      title: lesson.title,
      description: lesson.description,
      videoUrl: lesson.video_url,
      duration: lesson.duration,
      lessonOrder: lesson.lesson_order,
      completed: lesson.completed,
      completedAt: lesson.completed_at,
      resources,
    };

    if (!lessonsByModule.has(lesson.module_id)) lessonsByModule.set(lesson.module_id, []);
    lessonsByModule.get(lesson.module_id).push(payload);
  }

  return {
    ...formatCourse(courseResult.rows[0]),
    modules: moduleResult.rows.map((module) => ({
      id: module.id,
      courseId: module.course_id,
      title: module.title,
      description: module.description,
      moduleOrder: module.module_order,
      createdAt: module.created_at,
      updatedAt: module.updated_at,
      lessons: lessonsByModule.get(module.id) || [],
    })),
  };
};

export const updateLessonProgress = async (studentId, courseId, lessonId, completed) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const lessonCheck = await client.query(
      `SELECT l.id
       FROM lessons l
       JOIN course_modules cm ON cm.id = l.module_id
       JOIN training_courses tc ON tc.id = cm.course_id
       WHERE l.id = $1
         AND cm.course_id = $2
         AND tc.status = 'published'`,
      [lessonId, courseId],
    );

    if (!lessonCheck.rows[0]) {
      await client.query('ROLLBACK');
      return null;
    }

    await client.query(
      `INSERT INTO lesson_progress (student_id, lesson_id, completed, completed_at)
       VALUES ($1, $2, $3, CASE WHEN $3 THEN NOW() ELSE NULL END)
       ON CONFLICT (student_id, lesson_id) DO UPDATE SET
         completed = EXCLUDED.completed,
         completed_at = EXCLUDED.completed_at,
         updated_at = NOW()`,
      [studentId, lessonId, Boolean(completed)],
    );

    const countResult = await client.query(
      `SELECT
         COUNT(*)::int AS total_lessons,
         COUNT(*) FILTER (
           WHERE EXISTS (
             SELECT 1
             FROM lesson_progress lp
             WHERE lp.student_id = $1
               AND lp.lesson_id = l.id
               AND lp.completed = TRUE
           )
         )::int AS completed_lessons
       FROM lessons l
       JOIN course_modules cm ON cm.id = l.module_id
       WHERE cm.course_id = $2`,
      [studentId, courseId],
    );

    const totalLessons = Number(countResult.rows[0]?.total_lessons || 0);
    const completedLessons = Number(countResult.rows[0]?.completed_lessons || 0);
    const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    const progressResult = await client.query(
      `INSERT INTO student_course_progress
         (student_id, course_id, completed_lessons, total_lessons, progress)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (student_id, course_id) DO UPDATE SET
         completed_lessons = EXCLUDED.completed_lessons,
         total_lessons = EXCLUDED.total_lessons,
         progress = EXCLUDED.progress,
         updated_at = NOW()
       RETURNING completed_lessons, total_lessons, progress`,
      [studentId, courseId, completedLessons, totalLessons, progress],
    );

    await client.query('COMMIT');

    return {
      lessonId: Number(lessonId),
      completed: Boolean(completed),
      completedLessons: progressResult.rows[0].completed_lessons,
      totalLessons: progressResult.rows[0].total_lessons,
      progress: progressResult.rows[0].progress,
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const ensureCourseProgress = async (studentId, courseId, totalLessons) => {
  await pool.query(
    `INSERT INTO student_course_progress
       (student_id, course_id, completed_lessons, total_lessons, progress)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (student_id, course_id) DO UPDATE SET
       total_lessons = EXCLUDED.total_lessons,
       progress = CASE
         WHEN student_course_progress.total_lessons = 0 THEN EXCLUDED.progress
         ELSE student_course_progress.progress
       END,
       updated_at = NOW()`,
    [studentId, courseId, 0, totalLessons, 0],
  );
};

const formatCourse = (row) => {
  const totalLessons = Number(row.total_lessons || 0);
  const completedLessons = Number(row.completed_lessons || 0);
  const storedProgress = Number(row.progress || 0);
  const progress = totalLessons > 0 && completedLessons > 0
    ? Math.round((completedLessons / totalLessons) * 100)
    : storedProgress;

  return {
    id: row.id,
    title: row.title,
    category: row.category,
    level: row.level,
    duration: row.duration,
    description: row.description,
    status: row.status,
    totalLessons,
    completedLessons,
    progress,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

export default {
  listStudentCourses,
  getStudentCourseById,
  updateLessonProgress,
};
