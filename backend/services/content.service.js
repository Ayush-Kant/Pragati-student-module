// services/course.service.js

import { pool } from "../config/db.js";

// =========================
// CREATE COURSE
// =========================

export const createCourseService = async ({
  userId,
  title,
  description,
  skillTags,
  driveId,
}) => {
  try {
    const mentorCheckQuery = `SELECT id from mentors WHERE user_id = $1`;

    // verify drive ownership
    const driveCheckQuery = `
      SELECT id
      FROM drives
      WHERE id = $1
        AND mentor_id = $2
    `;

    const mentorResult = await pool.query(mentorCheckQuery, [userId]);

    const mentorId = mentorResult.rows[0]?.id;

    if (!mentorId) {
      return {
        status: "FORBIDDEN",
      };
    }

    const driveCheck = await pool.query(driveCheckQuery, [driveId, mentorId]);

    if (driveCheck.rows.length === 0) {
      return {
        status: "FORBIDDEN",
      };
    }

    // create course
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

    // auto create first module
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
    console.log(error);
  }
};

// =========================
// GET ALL COURSES
// =========================

export const getCoursesService = async ({ userId, status, driveId }) => {
  try {
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

      LEFT JOIN modules
        ON modules.course_id = courses.id

      WHERE courses.mentor_id = $1
    `;
    const mentorCheckQuery = `SELECT id from mentors WHERE user_id = $1`;

    const mentorResult = await pool.query(mentorCheckQuery, [userId]);

    const mentorId = mentorResult.rows[0]?.id;

    if (!mentorId) {
      return {
        status: "FORBIDDEN",
      };
    }
    const values = [mentorId];

    if (status) {
      values.push(status);

      query += `
        AND courses.status = $${values.length}
      `;
    }

    if (driveId) {
      values.push(driveId);

      query += `
        AND courses.drive_id = $${values.length}
      `;
    }

    query += `
      GROUP BY courses.id
      ORDER BY courses.created_at DESC
    `;

    const result = await pool.query(query, values);

    return result.rows;
  } catch (error) {
    throw error;
  }
};

// =========================
// GET COURSE BY ID
// =========================

export const getCourseByIdService = async ({ userId, courseId }) => {
  try {
    // check existence
    const courseCheckQuery = `
      SELECT id, mentor_id
      FROM courses
      WHERE id = $1
    `;

    const mentorCheckQuery = `SELECT id from mentors WHERE user_id = $1`;

    const mentorResult = await pool.query(mentorCheckQuery, [userId]);

    const mentorId = mentorResult.rows[0]?.id;

    if (!mentorId) {
      return {
        status: "FORBIDDEN",
      };
    }

    const courseCheck = await pool.query(courseCheckQuery, [courseId]);

    if (courseCheck.rows.length === 0) {
      return {
        statusCode: 404,
        message: "Course not found",
      };
    }

    if (courseCheck.rows[0].mentor_id !== mentorId) {
      return {
        statusCode: 403,
        message: "Forbidden",
      };
    }

    const getCourseQuery = `
      SELECT
        courses.id AS course_id,
        courses.title,
        courses.status,
        courses.skill_tags,

        modules.id AS module_id,
        modules.title AS module_title,
        modules.order_index

      FROM courses

      LEFT JOIN modules
        ON modules.course_id = courses.id

      WHERE courses.id = $1

      ORDER BY modules.order_index ASC
    `;

    const result = await pool.query(getCourseQuery, [courseId]);

    const firstRow = result.rows[0];

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
    throw error;
  }
};

// =========================
// UPDATE COURSE
// =========================

export const updateCourseService = async ({
  courseId,
  userId,
  title,
  description,
  skillTags,
  status,
}) => {
  try {
    // check ownership
    const checkCourseQuery = `
      SELECT id
      FROM courses
      WHERE id = $1
        AND mentor_id = $2
    `;

    const mentorCheckQuery = `SELECT id from mentors WHERE user_id = $1`;

    const mentorResult = await pool.query(mentorCheckQuery, [userId]);

    const mentorId = mentorResult.rows[0]?.id;

    if (!mentorId) {
      return {
        status: "FORBIDDEN",
      };
    }

    const checkCourseResult = await pool.query(checkCourseQuery, [
      courseId,
      mentorId,
    ]);

    if (checkCourseResult.rows.length === 0) {
      return {
        statusCode: 404,
        success: false,
        message: "Course not found",
      };
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

    // no fields provided
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
      SET ${updates.join(", ")}
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
  } catch (err) {
    throw err;
  }
};

// =========================
// ARCHIVE COURSE
// =========================

export const deleteCourseService = async ({ courseId, userId }) => {
  try {
    const checkQuery = `
      SELECT id
      FROM courses
      WHERE id = $1
        AND mentor_id = $2
    `;

    const mentorCheckQuery = `SELECT id from mentors WHERE user_id = $1`;

    const mentorResult = await pool.query(mentorCheckQuery, [userId]);

    const mentorId = mentorResult.rows[0]?.id;

    if (!mentorId) {
      return {
        status: "FORBIDDEN",
      };
    }

    const checkResult = await pool.query(checkQuery, [courseId, mentorId]);

    if (checkResult.rows.length === 0) {
      return {
        statusCode: 404,
        success: false,
        message: "Course not found",
      };
    }

    const archiveQuery = `
      UPDATE courses
      SET status = 'archived'
      WHERE id = $1
    `;

    await pool.query(archiveQuery, [courseId]);

    return {
      statusCode: 200,
      success: true,
      message: "Course archived successfully",
    };
  } catch (err) {
    throw err;
  }
};

// =========================
// CREATE MODULE
// =========================

export const createModuleService = async ({
  courseId,
  userId,
  title,
  orderIndex,
}) => {
  try {
    // check course ownership
    const checkCourseQuery = `
      SELECT id
      FROM courses
      WHERE id = $1
        AND mentor_id = $2
    `;

    const mentorCheckQuery = `SELECT id from mentors WHERE user_id = $1`;

    const mentorResult = await pool.query(mentorCheckQuery, [userId]);

    const mentorId = mentorResult.rows[0]?.id;

    if (!mentorId) {
      return {
        status: "FORBIDDEN",
      };
    }

    const checkCourseResult = await pool.query(checkCourseQuery, [
      courseId,
      mentorId,
    ]);

    if (checkCourseResult.rows.length === 0) {
      return {
        statusCode: 404,
        success: false,
        message: "Course not found",
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
  } catch (err) {
    throw err;
  }
};

// =========================
// DELETE MODULE
// =========================

export const deleteModuleService = async ({ moduleId, userId }) => {
  try {
    // verify ownership through course
    const checkModuleQuery = `
      SELECT modules.id
      FROM modules
      INNER JOIN courses
        ON courses.id = modules.course_id
      WHERE modules.id = $1
        AND courses.mentor_id = $2
    `;

    const mentorCheckQuery = `SELECT id from mentors WHERE user_id = $1`;

    const mentorResult = await pool.query(mentorCheckQuery, [userId]);

    const mentorId = mentorResult.rows[0]?.id;

    if (!mentorId) {
      return {
        status: "FORBIDDEN",
      };
    }

    const checkModuleResult = await pool.query(checkModuleQuery, [
      moduleId,
      mentorId,
    ]);

    if (checkModuleResult.rows.length === 0) {
      return {
        statusCode: 404,
        success: false,
        message: "Module not found",
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
  } catch (err) {
    throw err;
  }
};
