import pool from "../config/db.js";

// ==========================================
// UTILITY & HELPER FUNCTIONS
// ==========================================
const withClient = async (fn) => {
  const client = await pool.connect();
  try {
    return await fn(client);
  } finally {
    client.release();
  }
};

const getModuleForMentor = async (client, moduleId, mentorId) => {
  const { rows } = await client.query(
    `
    SELECT m.id, m.course_id
    FROM modules m
    JOIN courses c ON c.id = m.course_id
    WHERE m.id = $1
      AND c.mentor_id = $2
    `,
    [moduleId, mentorId],
  );

  return rows[0] || null;
};

const getLessonForMentor = async (client, lessonId, mentorId) => {
  const { rows } = await client.query(
    `
    SELECT
      l.id,
      l.module_id,
      l.title,
      l.video_url,
      l.hls_url,
      l.thumbnail_url,
      l.duration_sec,
      l.status,
      l.prerequisites,
      l.chapter_markers,
      l.archived_video_urls,
      l.order_index,
      m.course_id
    FROM lessons l
    JOIN modules m ON m.id = l.module_id
    JOIN courses c ON c.id = m.course_id
    WHERE l.id = $1
      AND c.mentor_id = $2
    `,
    [lessonId, mentorId],
  );

  return rows[0] || null;
};

const getResourceForMentor = async (client, resourceId, mentorId) => {
  const { rows } = await client.query(
    `
    SELECT r.*
    FROM resources r
    LEFT JOIN lessons l ON l.id = r.lesson_id
    LEFT JOIN modules m ON m.id = l.module_id
    LEFT JOIN courses c1 ON c1.id = m.course_id
    LEFT JOIN courses c2 ON c2.id = r.course_id
    WHERE r.id = $1
      AND (
        c1.mentor_id = $2
        OR c2.mentor_id = $2
      )
    `,
    [resourceId, mentorId],
  );

  return rows[0] || null;
};

// ==========================================
// LESSON & RESOURCE SERVICES
// ==========================================

export const reorderLessonsInModule = async ({
  mentorId,
  moduleId,
  lessonOrder,
}) =>
  withClient(async (client) => {
    await client.query("BEGIN");

    try {
      const module = await getModuleForMentor(client, moduleId, mentorId);
      if (!module) {
        const err = new Error("Module not found");
        err.statusCode = 404;
        throw err;
      }

      const { rows: moduleLessons } = await client.query(
        `
        SELECT id
        FROM lessons
        WHERE module_id = $1
        ORDER BY order_index ASC, id ASC
        FOR UPDATE
        `,
        [moduleId],
      );

      const moduleLessonIds = moduleLessons.map((row) => row.id);
      const inputLessonIds = lessonOrder.map((item) => item.lessonId);

      if (inputLessonIds.length !== moduleLessonIds.length) {
        const err = new Error(
          "All lessons in the module must be included in lessonOrder",
        );
        err.statusCode = 400;
        throw err;
      }

      const inputSet = new Set(inputLessonIds);
      for (const id of moduleLessonIds) {
        if (!inputSet.has(id)) {
          const err = new Error("All lessonIds must belong to this module");
          err.statusCode = 400;
          throw err;
        }
      }

      for (const item of lessonOrder) {
        const result = await client.query(
          `
          UPDATE lessons
          SET order_index = $1,
              updated_at = NOW()
          WHERE id = $2
            AND module_id = $3
          `,
          [item.orderIndex, item.lessonId, moduleId],
        );

        if (result.rowCount !== 1) {
          const err = new Error("Failed to update lesson order");
          err.statusCode = 400;
          throw err;
        }
      }

      await client.query("COMMIT");
      return { updatedCount: lessonOrder.length };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    }
  });

export const addLessonToModule = async ({
  mentorId,
  moduleId,
  title,
  description,
  prerequisites = [],
  estimatedDuration,
  status = "draft",
}) =>
  withClient(async (client) => {
    await client.query("BEGIN");

    try {
      const module = await getModuleForMentor(client, moduleId, mentorId);
      if (!module) {
        const err = new Error("Module not found");
        err.statusCode = 404;
        throw err;
      }

      const prerequisiteIds = Array.isArray(prerequisites)
        ? [...new Set(prerequisites.map(Number))]
        : [];

      if (prerequisiteIds.length > 0) {
        const { rows: validPrereqs } = await client.query(
          `
          SELECT l.id
          FROM lessons l
          JOIN modules m ON m.id = l.module_id
          WHERE l.id = ANY($1::int[])
            AND m.course_id = $2
          `,
          [prerequisiteIds, module.course_id],
        );

        if (validPrereqs.length !== prerequisiteIds.length) {
          const err = new Error(
            "prerequisites must be valid lesson IDs within the same course",
          );
          err.statusCode = 400;
          throw err;
        }
      }

      const { rows: orderRows } = await client.query(
        `
        SELECT COALESCE(MAX(order_index), -1) + 1 AS next_order
        FROM lessons
        WHERE module_id = $1
        `,
        [moduleId],
      );

      const nextOrder = Number(orderRows[0].next_order);

      const { rows } = await client.query(
        `
        INSERT INTO lessons (
          module_id,
          title,
          duration_sec,
          status,
          prerequisites,
          order_index,
          updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, NOW())
        RETURNING id, order_index, status
        `,
        [
          moduleId,
          title,
          estimatedDuration ?? null,
          status,
          prerequisiteIds.length ? prerequisiteIds.map(String) : null,
          nextOrder,
        ],
      );

      await client.query("COMMIT");
      return rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    }
  });

export const updateLessonById = async ({ mentorId, lessonId, payload }) =>
  withClient(async (client) => {
    await client.query("BEGIN");

    try {
      const lesson = await getLessonForMentor(client, lessonId, mentorId);
      if (!lesson) {
        const err = new Error("Not found");
        err.statusCode = 404;
        throw err;
      }

      if (payload.status !== undefined) {
        const currentStatus = lesson.status;
        const nextStatus = payload.status;

        const allowed = {
          draft: ["published"],
          published: ["unpublished"],
          unpublished: ["published"],
        };

        if (
          currentStatus !== nextStatus &&
          !(allowed[currentStatus] || []).includes(nextStatus)
        ) {
          const err = new Error(
            `Invalid status transition from ${currentStatus} to ${nextStatus}`,
          );
          err.statusCode = 400;
          throw err;
        }
      }

      if (payload.prerequisites !== undefined) {
        const prerequisiteIds = [...new Set(payload.prerequisites.map(Number))];

        if (prerequisiteIds.length > 0) {
          const { rows: validPrereqs } = await client.query(
            `
            SELECT l.id
            FROM lessons l
            JOIN modules m ON m.id = l.module_id
            WHERE l.id = ANY($1::int[])
              AND m.course_id = $2
            `,
            [prerequisiteIds, lesson.course_id],
          );

          if (validPrereqs.length !== prerequisiteIds.length) {
            const err = new Error(
              "prerequisites must be valid lesson IDs within the same course",
            );
            err.statusCode = 400;
            throw err;
          }
        }
      }

      const nextArchived = Array.isArray(lesson.archived_video_urls)
        ? [...lesson.archived_video_urls]
        : [];

      let newVideoUrl = lesson.video_url;
      if (
        payload.videoUrl !== undefined &&
        payload.videoUrl !== lesson.video_url
      ) {
        if (lesson.video_url) {
          nextArchived.push(lesson.video_url);
        }
        newVideoUrl = payload.videoUrl;
      }

      const updatedTitle =
        payload.title !== undefined ? payload.title : lesson.title;
      const updatedHlsUrl =
        payload.hlsUrl !== undefined ? payload.hlsUrl : lesson.hls_url;
      const updatedThumbnailUrl =
        payload.thumbnailUrl !== undefined
          ? payload.thumbnailUrl
          : lesson.thumbnail_url;
      const updatedDuration =
        payload.duration !== undefined ? payload.duration : lesson.duration_sec;
      const updatedStatus =
        payload.status !== undefined ? payload.status : lesson.status;
      const updatedPrerequisites =
        payload.prerequisites !== undefined
          ? payload.prerequisites.map(String)
          : lesson.prerequisites;
      const updatedMarkers =
        payload.chapterMarkers !== undefined
          ? payload.chapterMarkers
          : lesson.chapter_markers;

      const { rows } = await client.query(
        `
        UPDATE lessons
        SET title = $1,
            video_url = $2,
            hls_url = $3,
            thumbnail_url = $4,
            duration_sec = $5,
            status = $6,
            prerequisites = $7,
            chapter_markers = $8,
            archived_video_urls = $9,
            updated_at = NOW()
        WHERE id = $10
          AND module_id = $11
        RETURNING id, status
        `,
        [
          updatedTitle,
          newVideoUrl,
          updatedHlsUrl,
          updatedThumbnailUrl,
          updatedDuration ?? null,
          updatedStatus,
          updatedPrerequisites ?? null,
          updatedMarkers ?? null,
          nextArchived.length ? nextArchived : null,
          lessonId,
          lesson.module_id,
        ],
      );

      if (rows.length === 0) {
        const err = new Error("Not found");
        err.statusCode = 404;
        throw err;
      }

      await client.query("COMMIT");
      return rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    }
  });

export const checkLessonAccessByUser = async ({ userId, lessonId }) =>
  withClient(async (client) => {
    const { rows: lessonRows } = await client.query(
      `
      SELECT prerequisites
      FROM lessons
      WHERE id = $1
      `,
      [lessonId],
    );

    if (lessonRows.length === 0) {
      const err = new Error("Not found");
      err.statusCode = 404;
      throw err;
    }

    const requiredLessons = Array.isArray(lessonRows[0].prerequisites)
      ? lessonRows[0].prerequisites
          .map(Number)
          .filter((n) => Number.isInteger(n))
      : [];

    if (requiredLessons.length === 0) {
      return { hasAccess: true, requiredLessons: [] };
    }

    const { rows: completedRows } = await client.query(
      `
      SELECT lesson_id
      FROM lesson_progress
      WHERE student_id = $1
        AND lesson_id = ANY($2::int[])
        AND completed_at IS NOT NULL
      `,
      [userId, requiredLessons],
    );

    const completedSet = new Set(
      completedRows.map((row) => Number(row.lesson_id)),
    );
    const hasAccess = requiredLessons.every((lessonIdValue) =>
      completedSet.has(lessonIdValue),
    );

    return { hasAccess, requiredLessons };
  });

export const addResourceRecord = async ({
  mentorId,
  lessonId = null,
  courseId = null,
  title,
  fileUrl,
  type,
}) =>
  withClient(async (client) => {
    const belongsToLesson = lessonId !== null && lessonId !== undefined;
    const belongsToCourse = courseId !== null && courseId !== undefined;

    if (belongsToLesson) {
      const { rows } = await client.query(
        `
        SELECT l.id
        FROM lessons l
        JOIN modules m ON m.id = l.module_id
        JOIN courses c ON c.id = m.course_id
        WHERE l.id = $1
          AND c.mentor_id = $2
        `,
        [lessonId, mentorId],
      );

      if (rows.length === 0) {
        const err = new Error("Lesson not found");
        err.statusCode = 404;
        throw err;
      }
    }

    if (belongsToCourse) {
      const { rows } = await client.query(
        `
        SELECT id
        FROM courses
        WHERE id = $1
          AND mentor_id = $2
        `,
        [courseId, mentorId],
      );

      if (rows.length === 0) {
        const err = new Error("Course not found");
        err.statusCode = 404;
        throw err;
      }
    }

    const { rows } = await client.query(
      `
      INSERT INTO resources (
        lesson_id,
        course_id,
        title,
        file_url,
        type
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
      `,
      [lessonId, courseId, title, fileUrl, type],
    );

    return rows[0];
  });

export const deleteResourceById = async ({ mentorId, resourceId }) =>
  withClient(async (client) => {
    const resource = await getResourceForMentor(client, resourceId, mentorId);

    if (!resource) {
      const err = new Error("Not found");
      err.statusCode = 404;
      throw err;
    }

    await client.query(
      `
      DELETE FROM resources
      WHERE id = $1
      `,
      [resourceId],
    );

    return true;
  });

// ==========================================
// COURSE & MODULE SERVICES
// ==========================================

export const createCourseService = async ({
  userId,
  title,
  description,
  skillTags,
  driveId,
}) => {
  try {
    const mentorQuery = `
      SELECT mentors.id
      FROM mentors
      INNER JOIN users ON users.id = mentors.user_id
      INNER JOIN auth_users ON auth_users.id = users.auth_user_id
      WHERE auth_users.uuid_id = $1
    `;

    const driveQuery = `
      SELECT recruitment_drives.id
      FROM recruitment_drives
      INNER JOIN users ON users.id = recruitment_drives.mentor_id
      INNER JOIN auth_users ON auth_users.id = users.auth_user_id
      WHERE recruitment_drives.id = $1
        AND auth_users.uuid_id = $2
    `;

    const mentorRes = await pool.query(mentorQuery, [userId]);
    const mentorId = mentorRes.rows[0]?.id;

    if (!mentorId) {
      return {
        status: "FORBIDDEN",
      };
    }

    const driveRes = await pool.query(driveQuery, [driveId, userId]);

    if (driveRes.rows.length === 0) {
      return {
        status: "FORBIDDEN",
      };
    }

    const createCourseQuery = `
      INSERT INTO courses (
        title,
        description,
        skill_tags,
        drive_id,
        mentor_id,
        status
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, status
    `;

    const courseResult = await pool.query(createCourseQuery, [
      title.trim(),
      description?.trim() || "",
      skillTags,
      driveId,
      mentorId,
      "draft",
    ]);

    const createdCourse = courseResult.rows[0];

    const createModuleQuery = `
      INSERT INTO modules (
        course_id,
        title,
        order_index
      )
      VALUES ($1, $2, $3)
      RETURNING id
    `;

    const moduleResult = await pool.query(createModuleQuery, [
      createdCourse.id,
      "Module 1",
      0,
    ]);

    return {
      courseId: createdCourse.id,
      firstModuleId: moduleResult.rows[0].id,
      status: createdCourse.status,
    };
  } catch (error) {
    console.error("createCourseService Error:", error);
    throw error;
  }
};

export const getCoursesService = async ({
  userId,
  userRole,
  status,
  driveId,
}) => {
  try {
    const mentorQuery = `
      SELECT mentors.id
      FROM mentors
      INNER JOIN users ON users.id = mentors.user_id
      INNER JOIN auth_users ON auth_users.id = users.auth_user_id
      WHERE auth_users.uuid_id = $1
    `;

    const mentorRes = await pool.query(mentorQuery, [userId]);
    let mentorId = mentorRes.rows[0]?.id;

    if (!mentorId && userRole === "mentor") {
      await pool.query(
        `INSERT INTO mentors (user_id)
         SELECT users.id
         FROM users
         INNER JOIN auth_users ON auth_users.id = users.auth_user_id
         WHERE auth_users.uuid_id = $1
           AND NOT EXISTS (
             SELECT 1 FROM mentors WHERE mentors.user_id = users.id
           )`,
        [userId],
      );

      const ensuredMentor = await pool.query(mentorQuery, [userId]);
      mentorId = ensuredMentor.rows[0]?.id;
    }

    if (!mentorId) {
      return {
        status: "FORBIDDEN",
      };
    }

    let query = `
      SELECT
        courses.id AS "courseId",
        courses.title,
        courses.skill_tags AS "skillTags",
        courses.status,
        courses.drive_id AS "driveId",
        COUNT(modules.id)::int AS "moduleCount",
        courses.created_at AS "createdAt"
      FROM courses
      LEFT JOIN modules ON modules.course_id = courses.id
      WHERE courses.mentor_id = $1
    `;

    const values = [mentorId];

    if (status) {
      values.push(status);
      query += ` AND courses.status = $${values.length}`;
    }

    if (driveId) {
      values.push(driveId);
      query += ` AND courses.drive_id = $${values.length}`;
    }

    query += `
      GROUP BY courses.id
      ORDER BY courses.created_at DESC
    `;

    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    console.error("getCoursesService Error:", error);
    throw error;
  }
};

export const getCourseByIdService = async ({ userId, courseId }) => {
  try {
    const getCourseQuery = `
      SELECT
        courses.id AS course_id,
        courses.title,
        courses.status,
        courses.skill_tags,
        auth_users.uuid_id AS mentor_auth_uuid,
        modules.id AS module_id,
        modules.title AS module_title,
        modules.order_index
      FROM courses
      INNER JOIN mentors ON mentors.id = courses.mentor_id
      INNER JOIN users ON users.id = mentors.user_id
      INNER JOIN auth_users ON auth_users.id = users.auth_user_id
      LEFT JOIN modules ON modules.course_id = courses.id
      WHERE courses.id = $1
      ORDER BY modules.order_index ASC
    `;

    const result = await pool.query(getCourseQuery, [courseId]);

    if (result.rows.length === 0) {
      return {
        statusCode: 404,
        message: "Course not found",
      };
    }

    const firstRow = result.rows[0];

    if (String(firstRow.mentor_auth_uuid) !== String(userId)) {
      return {
        statusCode: 403,
        message: "Forbidden",
      };
    }

    const formattedCourse = {
      courseId: firstRow.course_id,
      title: firstRow.title,
      status: firstRow.status,
      skillTags: firstRow.skill_tags || [],
      modules: [],
    };

    for (const row of result.rows) {
      if (row.module_id) {
        formattedCourse.modules.push({
          moduleId: row.module_id,
          title: row.module_title,
          orderIndex: row.order_index,
          lessons: [],
        });
      }
    }

    return {
      statusCode: 200,
      data: formattedCourse,
    };
  } catch (error) {
    console.error("getCourseByIdService Error:", error);
    throw error;
  }
};

export const updateCourseService = async ({
  courseId,
  userId,
  title,
  description,
  skillTags,
  status,
}) => {
  try {
    const checkQuery = `
      SELECT
        courses.id,
        courses.status,
        auth_users.uuid_id AS mentor_auth_uuid
      FROM courses
      INNER JOIN mentors ON mentors.id = courses.mentor_id
      INNER JOIN users ON users.id = mentors.user_id
      INNER JOIN auth_users ON auth_users.id = users.auth_user_id
      WHERE courses.id = $1
    `;

    const checkRes = await pool.query(checkQuery, [courseId]);

    if (checkRes.rows.length === 0) {
      return {
        statusCode: 404,
        success: false,
        message: "Course not found",
      };
    }

    const courseData = checkRes.rows[0];

    if (String(courseData.mentor_auth_uuid) !== String(userId)) {
      return {
        statusCode: 403,
        success: false,
        message: "Forbidden",
      };
    }

    const currentStatus = courseData.status;

    if (status !== undefined && status !== currentStatus) {
      if (currentStatus === "archived") {
        return {
          statusCode: 400,
          success: false,
          message: "Cannot update status of an archived course",
        };
      }
      if (currentStatus === "published" && status === "draft") {
        return {
          statusCode: 400,
          success: false,
          message: "Cannot transition status back to draft from published",
        };
      }
    }

    const updates = [];
    const values = [];
    let index = 1;

    if (title !== undefined) {
      updates.push(`title = $${index++}`);
      values.push(title.trim());
    }

    if (description !== undefined) {
      updates.push(`description = $${index++}`);
      values.push(description.trim());
    }

    if (skillTags !== undefined) {
      updates.push(`skill_tags = $${index++}`);
      values.push(skillTags);
    }

    if (status !== undefined) {
      updates.push(`status = $${index++}`);
      values.push(status);
    }

    if (updates.length === 0) {
      return {
        statusCode: 400,
        success: false,
        message: "No fields provided for update",
      };
    }

    values.push(courseId);

    const updateCourseQuery = `
      UPDATE courses
      SET ${updates.join(", ")}, updated_at = NOW()
      WHERE id = $${index}
      RETURNING id, status
    `;

    const updateResult = await pool.query(updateCourseQuery, values);

    return {
      statusCode: 200,
      success: true,
      courseId: updateResult.rows[0].id,
      status: updateResult.rows[0].status,
    };
  } catch (error) {
    console.error("updateCourseService Error:", error);
    throw error;
  }
};

export const deleteCourseService = async ({ courseId, userId }) => {
  try {
    const checkQuery = `
      SELECT
        courses.id,
        auth_users.uuid_id AS mentor_auth_uuid
      FROM courses
      INNER JOIN mentors ON mentors.id = courses.mentor_id
      INNER JOIN users ON users.id = mentors.user_id
      INNER JOIN auth_users ON auth_users.id = users.auth_user_id
      WHERE courses.id = $1
    `;

    const checkRes = await pool.query(checkQuery, [courseId]);

    if (checkRes.rows.length === 0) {
      return {
        statusCode: 404,
        success: false,
        message: "Course not found",
      };
    }

    const courseData = checkRes.rows[0];

    if (String(courseData.mentor_auth_uuid) !== String(userId)) {
      return {
        statusCode: 403,
        success: false,
        message: "Forbidden",
      };
    }

    const archiveQuery = `
      UPDATE courses
      SET status = 'archived', updated_at = NOW()
      WHERE id = $1
    `;

    await pool.query(archiveQuery, [courseId]);

    return {
      statusCode: 200,
      success: true,
      message: "Course archived successfully",
    };
  } catch (error) {
    console.error("deleteCourseService Error:", error);
    throw error;
  }
};

export const createModuleService = async ({
  courseId,
  userId,
  title,
  orderIndex,
}) => {
  try {
    const checkQuery = `
      SELECT
        courses.id,
        auth_users.uuid_id AS mentor_auth_uuid
      FROM courses
      INNER JOIN mentors ON mentors.id = courses.mentor_id
      INNER JOIN users ON users.id = mentors.user_id
      INNER JOIN auth_users ON auth_users.id = users.auth_user_id
      WHERE courses.id = $1
    `;

    const checkRes = await pool.query(checkQuery, [courseId]);

    if (checkRes.rows.length === 0) {
      return {
        statusCode: 404,
        success: false,
        message: "Course not found",
      };
    }

    const courseData = checkRes.rows[0];

    if (String(courseData.mentor_auth_uuid) !== String(userId)) {
      return {
        statusCode: 403,
        success: false,
        message: "Forbidden",
      };
    }

    const createModuleQuery = `
      INSERT INTO modules (
        course_id,
        title,
        order_index
      )
      VALUES ($1, $2, $3)
      RETURNING id, order_index
    `;

    const result = await pool.query(createModuleQuery, [
      courseId,
      title.trim(),
      orderIndex,
    ]);

    return {
      statusCode: 201,
      success: true,
      moduleId: result.rows[0].id,
      orderIndex: result.rows[0].order_index,
    };
  } catch (error) {
    console.error("createModuleService Error:", error);
    throw error;
  }
};

export const deleteModuleService = async ({ moduleId, userId }) => {
  try {
    const checkQuery = `
      SELECT
        modules.id,
        auth_users.uuid_id AS mentor_auth_uuid
      FROM modules
      INNER JOIN courses ON courses.id = modules.course_id
      INNER JOIN mentors ON mentors.id = courses.mentor_id
      INNER JOIN users ON users.id = mentors.user_id
      INNER JOIN auth_users ON auth_users.id = users.auth_user_id
      WHERE modules.id = $1
    `;

    const checkRes = await pool.query(checkQuery, [moduleId]);

    if (checkRes.rows.length === 0) {
      return {
        statusCode: 404,
        success: false,
        message: "Module not found",
      };
    }

    const moduleData = checkRes.rows[0];

    if (String(moduleData.mentor_auth_uuid) !== String(userId)) {
      return {
        statusCode: 403,
        success: false,
        message: "Forbidden",
      };
    }

    const deleteQuery = `
      DELETE FROM modules
      WHERE id = $1
    `;

    await pool.query(deleteQuery, [moduleId]);

    return {
      statusCode: 200,
      success: true,
      message: "Module deleted",
    };
  } catch (error) {
    console.error("deleteModuleService Error:", error);
    throw error;
  }
};
