import { pool } from "../../config/db.js";

const toCourse = (row) => ({
  courseId: row.course_id,
  mentorId: row.mentor_id,
  title: row.title,
  description: row.description,
  moduleCount: row.module_count ?? 0,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const getCourses = async () => {
  const result = await pool.query(
    `
      SELECT
        c.id AS course_id,
        c.mentor_id,
        c.title,
        c.description,
        c.created_at,
        c.updated_at,
        COUNT(cm.id)::INT AS module_count
      FROM courses c
      LEFT JOIN course_modules cm ON cm.course_id = c.id
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `,
  );

  return result.rows.map(toCourse);
};

export const getCourseById = async (courseId) => {
  const courseResult = await pool.query(
    `
      SELECT
        c.id AS course_id,
        c.mentor_id,
        c.title,
        c.description,
        c.created_at,
        c.updated_at,
        COUNT(cm.id)::INT AS module_count
      FROM courses c
      LEFT JOIN course_modules cm ON cm.course_id = c.id
      WHERE c.id = $1
      GROUP BY c.id
    `,
    [courseId],
  );

  if (courseResult.rows.length === 0) {
    return null;
  }

  const course = toCourse(courseResult.rows[0]);

  const modulesResult = await pool.query(
    `
      SELECT
        id AS module_id,
        title,
        description,
        order_index,
        created_at,
        updated_at
      FROM course_modules
      WHERE course_id = $1
      ORDER BY order_index ASC, id ASC
    `,
    [courseId],
  );

  course.modules = modulesResult.rows.map((module) => ({
    moduleId: module.module_id,
    title: module.title,
    description: module.description,
    orderIndex: module.order_index,
    createdAt: module.created_at,
    updatedAt: module.updated_at,
  }));

  return course;
};

export const getModules = async (courseId) => {
  const result = await pool.query(
    `
      SELECT
        cm.id AS module_id,
        cm.title,
        cm.description,
        cm.order_index,
        cm.created_at,
        cm.updated_at,
        COUNT(l.id)::INT AS lesson_count
      FROM course_modules cm
      LEFT JOIN lessons l ON l.module_id = cm.id
      WHERE cm.course_id = $1
      GROUP BY cm.id
      ORDER BY cm.order_index ASC, cm.id ASC
    `,
    [courseId],
  );

  return result.rows.map((row) => ({
    moduleId: row.module_id,
    title: row.title,
    description: row.description,
    orderIndex: row.order_index,
    lessonCount: row.lesson_count,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
};

export const getLessons = async (moduleId) => {
  const result = await pool.query(
    `
      SELECT
        l.id AS lesson_id,
        l.title,
        l.description,
        l.content,
        l.duration_minutes,
        l.order_index,
        l.created_at,
        l.updated_at,
        COUNT(r.id)::INT AS resource_count
      FROM lessons l
      LEFT JOIN lesson_resources r ON r.lesson_id = l.id
      WHERE l.module_id = $1
      GROUP BY l.id
      ORDER BY l.order_index ASC, l.id ASC
    `,
    [moduleId],
  );

  return result.rows.map((row) => ({
    lessonId: row.lesson_id,
    title: row.title,
    description: row.description,
    content: row.content,
    durationMinutes: row.duration_minutes,
    orderIndex: row.order_index,
    resourceCount: row.resource_count,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
};

export const getLessonResources = async (lessonId) => {
  const result = await pool.query(
    `
      SELECT
        id AS resource_id,
        title,
        resource_type,
        url,
        file_path,
        created_at
      FROM lesson_resources
      WHERE lesson_id = $1
      ORDER BY created_at ASC, id ASC
    `,
    [lessonId],
  );

  return result.rows.map((row) => ({
    resourceId: row.resource_id,
    title: row.title,
    resourceType: row.resource_type,
    url: row.url,
    filePath: row.file_path,
    createdAt: row.created_at,
  }));
};

export const getLessonProgress = async ({ studentId, lessonId = null }) => {
  const result = await pool.query(
    `
      SELECT
        lp.id AS progress_id,
        lp.student_id,
        lp.lesson_id,
        lp.progress_pct,
        lp.completed,
        lp.last_viewed_at,
        lp.created_at,
        lp.updated_at,
        l.title AS lesson_title,
        cm.title AS module_title,
        c.title AS course_title
      FROM lesson_progress lp
      JOIN lessons l ON l.id = lp.lesson_id
      JOIN course_modules cm ON cm.id = l.module_id
      JOIN courses c ON c.id = cm.course_id
      WHERE lp.student_id = $1
        AND ($2::INT IS NULL OR lp.lesson_id = $2)
      ORDER BY lp.updated_at DESC, lp.created_at DESC
    `,
    [studentId, lessonId],
  );

  return result.rows.map((row) => ({
    progressId: row.progress_id,
    studentId: row.student_id,
    lessonId: row.lesson_id,
    lessonTitle: row.lesson_title,
    moduleTitle: row.module_title,
    courseTitle: row.course_title,
    progressPct: row.progress_pct,
    completed: row.completed,
    lastViewedAt: row.last_viewed_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
};

export const getStudentNotes = async ({ studentId, lessonId = null }) => {
  const result = await pool.query(
    `
      SELECT
        sn.id AS note_id,
        sn.student_id,
        sn.lesson_id,
        sn.content,
        sn.created_at,
        sn.updated_at,
        l.title AS lesson_title,
        cm.title AS module_title,
        c.title AS course_title
      FROM student_notes sn
      JOIN lessons l ON l.id = sn.lesson_id
      JOIN course_modules cm ON cm.id = l.module_id
      JOIN courses c ON c.id = cm.course_id
      WHERE sn.student_id = $1
        AND ($2::INT IS NULL OR sn.lesson_id = $2)
      ORDER BY sn.updated_at DESC, sn.created_at DESC
    `,
    [studentId, lessonId],
  );

  return result.rows.map((row) => ({
    noteId: row.note_id,
    studentId: row.student_id,
    lessonId: row.lesson_id,
    lessonTitle: row.lesson_title,
    moduleTitle: row.module_title,
    courseTitle: row.course_title,
    content: row.content,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
};

export const saveStudentNote = async ({ studentId, lessonId, content, noteId = null }) => {
  if (!studentId || !lessonId || content === undefined || content === null) {
    throw new Error("studentId, lessonId, and content are required to save a note");
  }

  if (noteId) {
    const updateResult = await pool.query(
      `
        UPDATE student_notes
        SET content = $1,
            updated_at = NOW()
        WHERE id = $2
          AND student_id = $3
          AND lesson_id = $4
        RETURNING
          id AS note_id,
          student_id,
          lesson_id,
          content,
          created_at,
          updated_at
      `,
      [content, noteId, studentId, lessonId],
    );

    return updateResult.rows[0] ?? null;
  }

  const insertResult = await pool.query(
    `
      INSERT INTO student_notes (
        student_id,
        lesson_id,
        content,
        created_at,
        updated_at
      ) VALUES ($1, $2, $3, NOW(), NOW())
      RETURNING
        id AS note_id,
        student_id,
        lesson_id,
        content,
        created_at,
        updated_at
    `,
    [studentId, lessonId, content],
  );

  return insertResult.rows[0];
};
