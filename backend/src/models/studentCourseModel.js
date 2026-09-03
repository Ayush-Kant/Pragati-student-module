import crypto from 'node:crypto';
import { pool } from '../../config/db.js';

const RESOURCE_TOKEN_TTL_SECONDS = 15 * 60;

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

const getAllCourses = async (studentId) => {
  const result = await pool.query(
    `${courseSelect}
     WHERE tc.status = 'published'
     GROUP BY tc.id, scp.progress
     ORDER BY tc.created_at DESC, tc.id DESC`,
    [studentId],
  );

  return result.rows;
};

export const listStudentCourses = async (studentId) => {
  const rows = await getAllCourses(studentId);

  for (const course of rows) {
    await ensureCourseProgress(studentId, course.id, Number(course.total_lessons));
  }

  const courses = [];
  for (const course of rows) {
    const details = await getStudentCourseById(studentId, course.id);
    courses.push(details);
  }

  return courses;
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
       cm.prerequisite_module_id,
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
       l.transcript_url,
       l.chapter_markers,
       l.duration,
       l.lesson_order,
       COALESCE(lp.completed, FALSE) AS completed,
       COALESCE(lp.watched_seconds, 0)::int AS watched_seconds,
       COALESCE(lp.total_seconds, 0)::int AS total_seconds,
       COALESCE(lp.progress_pct, 0)::int AS progress_pct,
       lp.last_viewed_at,
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
       lr.mime_type,
       lr.file_size_bytes,
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
        mimeType: resource.mime_type,
        fileSizeBytes: resource.file_size_bytes,
        createdAt: resource.created_at,
      }));

    const payload = {
      id: lesson.id,
      moduleId: lesson.module_id,
      title: lesson.title,
      description: lesson.description,
      videoUrl: lesson.video_url,
      transcriptUrl: lesson.transcript_url,
      chapterMarkers: Array.isArray(lesson.chapter_markers) ? lesson.chapter_markers : [],
      duration: lesson.duration,
      lessonOrder: lesson.lesson_order,
      completed: lesson.completed,
      completedAt: lesson.completed_at,
      watchedSeconds: lesson.watched_seconds,
      totalSeconds: lesson.total_seconds,
      progressPercent: lesson.progress_pct,
      lastViewedAt: lesson.last_viewed_at,
      watchProgress: lesson.progress_pct,
      resources,
    };

    if (!lessonsByModule.has(lesson.module_id)) lessonsByModule.set(lesson.module_id, []);
    lessonsByModule.get(lesson.module_id).push(payload);
  }

  const modulePayloads = moduleResult.rows.map((module) => {
    const lessons = lessonsByModule.get(module.id) || [];
    const prerequisite = module.prerequisite_module_id
      ? moduleResult.rows.find((candidate) => Number(candidate.id) === Number(module.prerequisite_module_id))
      : null;
    const prerequisiteLessons = prerequisite ? lessonsByModule.get(prerequisite.id) || [] : [];
    const moduleUnlocked = !prerequisite || prerequisiteLessons.length === 0 || prerequisiteLessons.every((lesson) => lesson.completed);

    let previousLessonCompleted = true;
    const lockedLessons = lessons.map((lesson) => {
      const locked = !moduleUnlocked || !previousLessonCompleted;
      previousLessonCompleted = Boolean(lesson.completed);
      return { ...lesson, locked };
    });

    return {
      id: module.id,
      courseId: module.course_id,
      title: module.title,
      description: module.description,
      moduleOrder: module.module_order,
      prerequisiteModuleId: module.prerequisite_module_id,
      locked: !moduleUnlocked,
      completedLessons: lockedLessons.filter((lesson) => lesson.completed).length,
      totalLessons: lockedLessons.length,
      progress: lockedLessons.length
        ? Math.round((lockedLessons.filter((lesson) => lesson.completed).length / lockedLessons.length) * 100)
        : 0,
      createdAt: module.created_at,
      updatedAt: module.updated_at,
      lessons: lockedLessons,
    };
  });

  return {
    ...formatCourse(courseResult.rows[0]),
    modules: modulePayloads,
  };
};

export const getStudentLessonById = async (studentId, lessonId) => {
  const lessonResult = await pool.query(
    `SELECT
       l.id,
       l.module_id,
       l.title,
       l.description,
       l.video_url,
       l.transcript_url,
       l.chapter_markers,
       l.duration,
       l.lesson_order,
       cm.course_id,
       cm.title AS module_title,
       cm.module_order,
       cm.prerequisite_module_id,
       tc.title AS course_title,
       tc.category,
       tc.level,
       tc.status,
       COALESCE(lp.watched_seconds, 0)::int AS watched_seconds,
       COALESCE(lp.total_seconds, 0)::int AS total_seconds,
       COALESCE(lp.progress_pct, 0)::int AS progress_pct,
       COALESCE(lp.completed, FALSE) AS completed,
       lp.last_viewed_at,
       lp.completed_at
     FROM lessons l
     JOIN course_modules cm ON cm.id = l.module_id
     JOIN training_courses tc ON tc.id = cm.course_id
     LEFT JOIN lesson_progress lp
       ON lp.lesson_id = l.id
      AND lp.student_id = $1
     WHERE l.id = $2
       AND tc.status = 'published'`,
    [studentId, lessonId],
  );

  if (!lessonResult.rows[0]) return null;

  const lesson = lessonResult.rows[0];
  const moduleLessons = await pool.query(
    `SELECT
       l.id,
       l.lesson_order,
       COALESCE(lp.completed, FALSE) AS completed
     FROM lessons l
     LEFT JOIN lesson_progress lp
       ON lp.lesson_id = l.id
      AND lp.student_id = $1
     WHERE l.module_id = $2
     ORDER BY l.lesson_order ASC, l.id ASC`,
    [studentId, lesson.module_id],
  );

  const prerequisiteCompleted = lesson.prerequisite_module_id
    ? await isModuleCompleted(studentId, lesson.prerequisite_module_id)
    : true;
  const previousLesson = moduleLessons.rows.find((row) => Number(row.lesson_order) === Number(lesson.lesson_order) - 1);
  const locked = !prerequisiteCompleted || Boolean(previousLesson && !previousLesson.completed);

  if (locked) {
    const error = new Error('Lesson locked — prerequisite not completed');
    error.statusCode = 403;
    throw error;
  }

  const resources = await pool.query(
    `SELECT id, title, resource_type, file_url, mime_type, file_size_bytes, created_at
     FROM learning_resources
     WHERE lesson_id = $1
     ORDER BY id ASC`,
    [lessonId],
  );

  return {
    lessonId: lesson.id,
    courseId: lesson.course_id,
    courseTitle: lesson.course_title,
    moduleId: lesson.module_id,
    moduleTitle: lesson.module_title,
    title: lesson.title,
    description: lesson.description,
    videoUrl: lesson.video_url,
    transcriptUrl: lesson.transcript_url,
    chapterMarkers: Array.isArray(lesson.chapter_markers) ? lesson.chapter_markers : [],
    duration: lesson.duration,
    watchProgress: lesson.progress_pct,
    watchedSeconds: lesson.watched_seconds,
    totalSeconds: lesson.total_seconds,
    progressPercent: lesson.progress_pct,
    completed: lesson.completed,
    completedAt: lesson.completed_at,
    lastViewedAt: lesson.last_viewed_at,
    resources: resources.rows.map((resource) => ({
      resourceId: resource.id,
      title: resource.title,
      type: resource.resource_type,
      fileUrl: resource.file_url,
      mimeType: resource.mime_type,
      fileSizeBytes: resource.file_size_bytes,
      createdAt: resource.created_at,
    })),
  };
};

export const saveWatchProgress = async (studentId, lessonId, watchedSeconds, totalSeconds) => {
  if (!Number.isInteger(watchedSeconds) || watchedSeconds < 0) {
    const error = new Error('watchedSeconds must be a non-negative integer');
    error.statusCode = 400;
    throw error;
  }

  if (!Number.isInteger(totalSeconds) || totalSeconds <= 0) {
    const error = new Error('totalSeconds must be a positive integer');
    error.statusCode = 400;
    throw error;
  }

  if (watchedSeconds > totalSeconds) {
    const error = new Error('watchedSeconds exceeds totalSeconds');
    error.statusCode = 400;
    throw error;
  }

  await getStudentLessonById(studentId, lessonId);

  const progressPct = Math.min(100, Math.round((watchedSeconds / totalSeconds) * 100));
  const completed = progressPct >= 80;

  const result = await pool.query(
    `INSERT INTO lesson_progress
       (student_id, lesson_id, watched_seconds, total_seconds, progress_pct, completed, last_viewed_at, completed_at)
     VALUES ($1, $2, $3, $4, $5, $6, NOW(), CASE WHEN $6 THEN COALESCE((SELECT completed_at FROM lesson_progress WHERE student_id = $1 AND lesson_id = $2), NOW()) ELSE NULL END)
     ON CONFLICT (student_id, lesson_id) DO UPDATE SET
       watched_seconds = EXCLUDED.watched_seconds,
       total_seconds = EXCLUDED.total_seconds,
       progress_pct = EXCLUDED.progress_pct,
       completed = EXCLUDED.completed,
       last_viewed_at = NOW(),
       completed_at = CASE
         WHEN EXCLUDED.completed THEN COALESCE(lesson_progress.completed_at, NOW())
         ELSE NULL
       END,
       updated_at = NOW()
     RETURNING watched_seconds, total_seconds, progress_pct, completed`,
    [studentId, lessonId, watchedSeconds, totalSeconds, progressPct, completed],
  );

  const lessonCourse = await pool.query(
    `SELECT cm.course_id
     FROM lessons l
     JOIN course_modules cm ON cm.id = l.module_id
     WHERE l.id = $1`,
    [lessonId],
  );

  const courseId = lessonCourse.rows[0]?.course_id;
  let courseProgress = null;
  if (courseId) {
    const counts = await pool.query(
      `SELECT
         COUNT(*)::int AS total_lessons,
         COUNT(*) FILTER (WHERE COALESCE(lp.completed, FALSE))::int AS completed_lessons
       FROM lessons l
       JOIN course_modules cm ON cm.id = l.module_id
       LEFT JOIN lesson_progress lp
         ON lp.lesson_id = l.id AND lp.student_id = $1
       WHERE cm.course_id = $2`,
      [studentId, courseId],
    );

    const totalLessons = Number(counts.rows[0]?.total_lessons || 0);
    const completedLessons = Number(counts.rows[0]?.completed_lessons || 0);
    const progress = totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0;

    await pool.query(
      `INSERT INTO student_course_progress
         (student_id, course_id, completed_lessons, total_lessons, progress)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (student_id, course_id) DO UPDATE SET
         completed_lessons = EXCLUDED.completed_lessons,
         total_lessons = EXCLUDED.total_lessons,
         progress = EXCLUDED.progress,
         updated_at = NOW()`,
      [studentId, courseId, completedLessons, totalLessons, progress],
    );

    courseProgress = { courseId, completedLessons, totalLessons, progress };
  }

  const row = result.rows[0];
  return {
    watchedSeconds: row.watched_seconds,
    totalSeconds: row.total_seconds,
    completionPercent: row.progress_pct,
    lessonCompleted: row.completed,
    courseProgress,
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
      `INSERT INTO lesson_progress (student_id, lesson_id, completed, progress_pct, completed_at, last_viewed_at)
       VALUES ($1, $2, $3, $4, CASE WHEN $3 THEN NOW() ELSE NULL END, NOW())
       ON CONFLICT (student_id, lesson_id) DO UPDATE SET
         completed = EXCLUDED.completed,
         progress_pct = CASE WHEN EXCLUDED.completed THEN 100 ELSE lesson_progress.progress_pct END,
         completed_at = EXCLUDED.completed_at,
         last_viewed_at = NOW(),
         updated_at = NOW()`,
      [studentId, lessonId, Boolean(completed), Boolean(completed) ? 100 : 0],
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

export const getLessonNotes = async (studentId, lessonId) => {
  const result = await pool.query(
    `SELECT id, lesson_id, note_text, timestamp_seconds, created_at, updated_at
     FROM student_notes
     WHERE student_id = $1 AND lesson_id = $2
     ORDER BY COALESCE(timestamp_seconds, 2147483647) ASC, id ASC`,
    [studentId, lessonId],
  );

  return result.rows.map((note) => ({
    id: note.id,
    lessonId: note.lesson_id,
    note: note.note_text,
    timestampSeconds: note.timestamp_seconds,
    createdAt: note.created_at,
    updatedAt: note.updated_at,
  }));
};

export const saveLessonNote = async (studentId, lessonId, note, timestampSeconds = null, noteId = null) => {
  if (typeof note !== 'string' || !note.trim()) {
    const error = new Error('note must be a non-empty string');
    error.statusCode = 400;
    throw error;
  }

  if (note.length > 5000) {
    const error = new Error('note must not exceed 5000 characters');
    error.statusCode = 400;
    throw error;
  }

  await getStudentLessonById(studentId, lessonId);

  if (noteId) {
    const updated = await pool.query(
      `UPDATE student_notes
       SET note_text = $1, timestamp_seconds = $2, updated_at = NOW()
       WHERE id = $3 AND student_id = $4 AND lesson_id = $5
       RETURNING id, lesson_id, note_text, timestamp_seconds, created_at, updated_at`,
      [note.trim(), timestampSeconds, noteId, studentId, lessonId],
    );

    if (!updated.rows[0]) {
      const error = new Error('Note not found');
      error.statusCode = 404;
      throw error;
    }

    return mapNote(updated.rows[0]);
  }

  const inserted = await pool.query(
    `INSERT INTO student_notes (student_id, lesson_id, note_text, timestamp_seconds)
     VALUES ($1, $2, $3, $4)
     RETURNING id, lesson_id, note_text, timestamp_seconds, created_at, updated_at`,
    [studentId, lessonId, note.trim(), timestampSeconds],
  );

  return mapNote(inserted.rows[0]);
};

export const deleteLessonNote = async (studentId, lessonId, noteId) => {
  const result = await pool.query(
    `DELETE FROM student_notes
     WHERE id = $1 AND student_id = $2 AND lesson_id = $3
     RETURNING id`,
    [noteId, studentId, lessonId],
  );

  if (!result.rows[0]) {
    const error = new Error('Note not found');
    error.statusCode = 404;
    throw error;
  }

  return { id: result.rows[0].id, deleted: true };
};

export const createResourceDownloadUrl = async (studentId, resourceId) => {
  const result = await pool.query(
    `SELECT lr.id, lr.file_url, l.id AS lesson_id, cm.course_id, tc.status
     FROM learning_resources lr
     JOIN lessons l ON l.id = lr.lesson_id
     JOIN course_modules cm ON cm.id = l.module_id
     JOIN training_courses tc ON tc.id = cm.course_id
     WHERE lr.id = $1 AND tc.status = 'published'`,
    [resourceId],
  );

  const resource = result.rows[0];
  if (!resource) {
    const error = new Error('Resource not found');
    error.statusCode = 404;
    throw error;
  }

  await assertLessonAccessible(studentId, resource.lesson_id);

  await pool.query(
    `INSERT INTO resource_downloads (student_id, resource_id) VALUES ($1, $2)`,
    [studentId, resourceId],
  );

  if (!resource.file_url) {
    const error = new Error('Resource file is not configured');
    error.statusCode = 404;
    throw error;
  }

  const expires = Math.floor(Date.now() / 1000) + RESOURCE_TOKEN_TTL_SECONDS;
  const secret = process.env.JWT_SECRET || 'development-resource-secret';
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${resource.id}:${studentId}:${expires}`)
    .digest('hex');

  const host = process.env.CLIENT_URL || 'http://localhost:5173';
  const backendOrigin = process.env.BACKEND_PUBLIC_URL || `http://localhost:${process.env.PORT || 5000}`;
  const downloadUrl = `${backendOrigin}/api/student/courses/resources/${resource.id}/file?student=${encodeURIComponent(studentId)}&expires=${expires}&signature=${signature}`;

  return { downloadUrl, expiresIn: RESOURCE_TOKEN_TTL_SECONDS, resourceUrl: resource.file_url, host };
};

export const resolveResourceDownload = async (resourceId, studentId, expires, signature) => {
  if (!Number.isInteger(Number(expires)) || Number(expires) < Math.floor(Date.now() / 1000)) {
    const error = new Error('Download link has expired');
    error.statusCode = 410;
    throw error;
  }

  const secret = process.env.JWT_SECRET || 'development-resource-secret';
  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${resourceId}:${studentId}:${Number(expires)}`)
    .digest('hex');

  if (!signature || !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))) {
    const error = new Error('Invalid download signature');
    error.statusCode = 403;
    throw error;
  }

  const result = await pool.query(
    `SELECT lr.file_url
     FROM learning_resources lr
     JOIN lessons l ON l.id = lr.lesson_id
     JOIN course_modules cm ON cm.id = l.module_id
     JOIN training_courses tc ON tc.id = cm.course_id
     WHERE lr.id = $1 AND tc.status = 'published'`,
    [resourceId],
  );

  if (!result.rows[0]?.file_url) {
    const error = new Error('Resource file not found');
    error.statusCode = 404;
    throw error;
  }

  return result.rows[0].file_url;
};

const assertLessonAccessible = async (studentId, lessonId) => {
  await getStudentLessonById(studentId, lessonId);
};

const isModuleCompleted = async (studentId, moduleId) => {
  const result = await pool.query(
    `SELECT
       COUNT(l.id)::int AS total_lessons,
       COUNT(l.id) FILTER (WHERE COALESCE(lp.completed, FALSE))::int AS completed_lessons
     FROM lessons l
     LEFT JOIN lesson_progress lp
       ON lp.lesson_id = l.id AND lp.student_id = $1
     WHERE l.module_id = $2`,
    [studentId, moduleId],
  );

  const total = Number(result.rows[0]?.total_lessons || 0);
  const completed = Number(result.rows[0]?.completed_lessons || 0);
  return total > 0 && total === completed;
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
  const progress = totalLessons > 0
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

const mapNote = (note) => ({
  id: note.id,
  lessonId: note.lesson_id,
  note: note.note_text,
  timestampSeconds: note.timestamp_seconds,
  createdAt: note.created_at,
  updatedAt: note.updated_at,
});

export default {
  listStudentCourses,
  getStudentCourseById,
  getStudentLessonById,
  saveWatchProgress,
  updateLessonProgress,
  getLessonNotes,
  saveLessonNote,
  deleteLessonNote,
  createResourceDownloadUrl,
  resolveResourceDownload,
};
