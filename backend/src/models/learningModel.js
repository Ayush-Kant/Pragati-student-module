import { pool } from "../../config/db.js";

const isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;

const toCourse = (row) => ({
  courseId: row.course_id,
  mentorId: row.mentor_id,
  title: row.title,
  description: row.description,
  moduleCount: row.module_count ?? 0,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const toLessonProgress = (row) => ({
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
});

const toStudentNote = (row) => ({
  noteId: row.note_id,
  studentId: row.student_id,
  lessonId: row.lesson_id,
  lessonTitle: row.lesson_title,
  moduleTitle: row.module_title,
  courseTitle: row.course_title,
  content: row.content,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const toLessonBookmark = (row) => ({
  bookmarkId: row.bookmark_id,
  studentId: row.student_id,
  lessonId: row.lesson_id,
  lessonTitle: row.lesson_title,
  moduleTitle: row.module_title,
  courseTitle: row.course_title,
  bookmarkTimeSeconds: row.bookmark_time_seconds,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const getCourses = async () => {
  try {
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
  } catch (error) {
    console.error("Error in getCourses:", error);
    throw new Error("Failed to retrieve courses", { cause: error });
  }
};

export const getCourseById = async (courseId) => {
  try {
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
  } catch (error) {
    console.error("Error in getCourseById:", error);
    throw new Error("Failed to retrieve course by ID", { cause: error });
  }
};

export const getModules = async (courseId) => {
  try {
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
  } catch (error) {
    console.error("Error in getModules:", error);
    throw new Error("Failed to retrieve modules", { cause: error });
  }
};

export const getLessons = async (moduleId) => {
  try {
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
  } catch (error) {
    console.error("Error in getLessons:", error);
    throw new Error("Failed to retrieve lessons", { cause: error });
  }
};

export const getLessonResources = async (lessonId) => {
  try {
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
  } catch (error) {
    console.error("Error in getLessonResources:", error);
    throw new Error("Failed to retrieve lesson resources", { cause: error });
  }
};

export const getLessonProgress = async ({ studentId, lessonId = null }) => {
  try {
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

    return result.rows.map(toLessonProgress);
  } catch (error) {
    console.error("Error in getLessonProgress:", error);
    throw new Error("Failed to retrieve lesson progress", { cause: error });
  }
};

export const getLessonProgressByIds = async ({ studentId, lessonId }) => {
  try {
    const progress = await getLessonProgress({ studentId, lessonId });
    return progress[0] ?? null;
  } catch (error) {
    console.error("Error in getLessonProgressByIds:", error);
    throw new Error("Failed to retrieve lesson progress by IDs", { cause: error });
  }
};

export const updateLessonProgress = async ({ studentId, lessonId, progressPct, completed = false, lastViewedAt = null }) => {
  if (!studentId || !lessonId) {
    throw new Error("studentId and lessonId are required to update lesson progress");
  }

  if (!Number.isInteger(progressPct) || progressPct < 0 || progressPct > 100) {
    throw new Error("progressPct must be an integer between 0 and 100");
  }

  if (typeof completed !== "boolean") {
    throw new Error("completed must be a boolean");
  }

  if (lastViewedAt !== null && Number.isNaN(new Date(lastViewedAt).getTime())) {
    throw new Error("lastViewedAt must be a valid date or null");
  }

  try {
    await pool.query(
      `
      INSERT INTO lesson_progress (
        student_id,
        lesson_id,
        progress_pct,
        completed,
        last_viewed_at,
        created_at,
        updated_at
      ) VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      ON CONFLICT (student_id, lesson_id)
      DO UPDATE SET
        progress_pct = EXCLUDED.progress_pct,
        completed = EXCLUDED.completed,
        last_viewed_at = EXCLUDED.last_viewed_at,
        updated_at = NOW()
    `,
      [studentId, lessonId, progressPct, completed, lastViewedAt],
    );

    return await getLessonProgressByIds({ studentId, lessonId });
  } catch (error) {
    console.error("Error in updateLessonProgress:", error);
    throw new Error("Failed to update lesson progress", { cause: error });
  }
};

export const getStudentNotes = async ({ studentId, lessonId = null }) => {
  try {
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

    return result.rows.map(toStudentNote);
  } catch (error) {
    console.error("Error in getStudentNotes:", error);
    throw new Error("Failed to retrieve student notes", { cause: error });
  }
};

const getStudentNoteById = async (noteId) => {
  try {
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
      WHERE sn.id = $1
    `,
      [noteId],
    );

    return result.rows[0] ? toStudentNote(result.rows[0]) : null;
  } catch (error) {
    console.error("Error in getStudentNoteById:", error);
    throw new Error("Failed to retrieve student note by ID", { cause: error });
  }
};

export const saveStudentNote = async ({ studentId, lessonId, content, noteId = null }) => {
  if (!studentId || !lessonId || content === undefined || content === null) {
    throw new Error("studentId, lessonId, and content are required to save a note");
  }

  if (!isNonEmptyString(content)) {
    throw new Error("content must be a non-empty string");
  }

  try {
    if (noteId) {
      const updateResult = await pool.query(
        `
        UPDATE student_notes
        SET content = $1,
            updated_at = NOW()
        WHERE id = $2
          AND student_id = $3
          AND lesson_id = $4
        RETURNING id AS note_id
      `,
        [content, noteId, studentId, lessonId],
      );

      if (!updateResult.rows[0]) {
        return null;
      }

      return await getStudentNoteById(updateResult.rows[0].note_id);
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
      RETURNING id AS note_id
    `,
      [studentId, lessonId, content],
    );

    return await getStudentNoteById(insertResult.rows[0].note_id);
  } catch (error) {
    console.error("Error in saveStudentNote:", error);
    throw new Error("Failed to save student note", { cause: error });
  }
};

export const getLessonBookmarks = async ({ studentId, lessonId = null }) => {
  try {
    const result = await pool.query(
      `
      SELECT
        lb.id AS bookmark_id,
        lb.student_id,
        lb.lesson_id,
        lb.bookmark_time_seconds,
        lb.created_at,
        lb.updated_at,
        l.title AS lesson_title,
        cm.title AS module_title,
        c.title AS course_title
      FROM lesson_bookmarks lb
      JOIN lessons l ON l.id = lb.lesson_id
      JOIN course_modules cm ON cm.id = l.module_id
      JOIN courses c ON c.id = cm.course_id
      WHERE lb.student_id = $1
        AND ($2::INT IS NULL OR lb.lesson_id = $2)
      ORDER BY lb.updated_at DESC, lb.created_at DESC
    `,
      [studentId, lessonId],
    );

    return result.rows.map(toLessonBookmark);
  } catch (error) {
    console.error("Error in getLessonBookmarks:", error);
    throw new Error("Failed to retrieve lesson bookmarks", { cause: error });
  }
};

export const getLessonBookmark = async ({ studentId, lessonId }) => {
  if (!studentId || !lessonId) {
    throw new Error("studentId and lessonId are required to retrieve a specific lesson bookmark");
  }

  try {
    return await getLessonBookmarkByIds({ studentId, lessonId });
  } catch (error) {
    console.error("Error in getLessonBookmark:", error);
    throw new Error("Failed to retrieve lesson bookmark", { cause: error });
  }
};

const getLessonBookmarkByIds = async ({ studentId, lessonId }) => {
  try {
    const result = await pool.query(
      `
      SELECT
        lb.id AS bookmark_id,
        lb.student_id,
        lb.lesson_id,
        lb.bookmark_time_seconds,
        lb.created_at,
        lb.updated_at,
        l.title AS lesson_title,
        cm.title AS module_title,
        c.title AS course_title
      FROM lesson_bookmarks lb
      JOIN lessons l ON l.id = lb.lesson_id
      JOIN course_modules cm ON cm.id = l.module_id
      JOIN courses c ON c.id = cm.course_id
      WHERE lb.student_id = $1
        AND lb.lesson_id = $2
    `,
      [studentId, lessonId],
    );

    return result.rows[0] ? toLessonBookmark(result.rows[0]) : null;
  } catch (error) {
    console.error("Error in getLessonBookmarkByIds:", error);
    throw new Error("Failed to retrieve lesson bookmark by IDs", { cause: error });
  }
};

export const saveLessonBookmark = async ({ studentId, lessonId, bookmarkTimeSeconds = 0 }) => {
  if (!studentId || !lessonId) {
    throw new Error("studentId and lessonId are required to save a lesson bookmark");
  }

  if (!Number.isInteger(bookmarkTimeSeconds) || bookmarkTimeSeconds < 0) {
    throw new Error("bookmarkTimeSeconds must be a non-negative integer");
  }

  try {
    await pool.query(
      `
      INSERT INTO lesson_bookmarks (
        student_id,
        lesson_id,
        bookmark_time_seconds,
        created_at,
        updated_at
      ) VALUES ($1, $2, $3, NOW(), NOW())
      ON CONFLICT (student_id, lesson_id)
      DO UPDATE SET
        bookmark_time_seconds = EXCLUDED.bookmark_time_seconds,
        updated_at = NOW()
    `,
      [studentId, lessonId, bookmarkTimeSeconds],
    );

    return await getLessonBookmarkByIds({ studentId, lessonId });
  } catch (error) {
    console.error("Error in saveLessonBookmark:", error);
    throw new Error("Failed to save lesson bookmark", { cause: error });
  }
};

export const deleteLessonBookmark = async ({ studentId, lessonId }) => {
  if (!studentId || !lessonId) {
    throw new Error("studentId and lessonId are required to delete a lesson bookmark");
  }

  try {
    const result = await pool.query(
      `
      DELETE FROM lesson_bookmarks
      WHERE student_id = $1
        AND lesson_id = $2
      RETURNING id AS bookmark_id
    `,
      [studentId, lessonId],
    );

    return result.rows.length > 0;
  } catch (error) {
    console.error("Error in deleteLessonBookmark:", error);
    throw new Error("Failed to delete lesson bookmark", { cause: error });
  }
};
