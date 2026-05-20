import { pool } from "../config/db.js";

export const createCourseService = async ({
  mentorId,
  title,
  description,
  skillTags,
  driveId,
}) => {
  try {
    // ownership + active drive check
    const driveCheckQuery = `
      SELECT id
      FROM drives
      WHERE id = $1
        AND mentor_id = $2
        AND is_active = true
    `;

    const driveCheck = await client.query(driveCheckQuery, [driveId, mentorId]);

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

    const courseResult = await client.query(createCourseQuery, [
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

    const moduleResult = await client.query(createModuleQuery, [
      createdCourse.id,
      "Module 1",
      0,
    ]);

    const createdModule = moduleResult.rows[0];

    return {
      courseId: createdCourse.id,
      firstModuleId: createdModule.id,
      status: createdCourse.status,
    };
  } catch (error) {
    console.log(error);
  }
};

export const getCoursesService = async ({ mentorId, status, driveId }) => {
  try {
    const getCoursesQuery = `SELECT id, mentor_id, drive_id, title, skill_tags, status, created_at FROM courses WHERE mentor_id = $1`;

    // optional status filter
    if (status) {
      values.push(status);

      query += `
      AND status = $${values.length}
    `;
    }

    // optional drive filter
    if (driveId) {
      values.push(driveId);

      query += `
      AND drive_id = $${values.length}
    `;
    }

    query += `
    ORDER BY created_at DESC
  `;

    const result = await pool.query(query, values);

    return result.rows;
  } catch (err) {
    console.log(err);
  }
};

export const getCourseByIdService = async ({ mentorId, courseId }) => {
  const getCourseByIdQuery = `
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
      AND courses.mentor_id = $2

    ORDER BY modules.order_index ASC
  `;

  const result = await pool.query(getCourseByIdQuery, [courseId, mentorId]);

  // course not found or not owned
  if (result.rows.length === 0) {
    return null;
  }

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

  return formattedCourse;
};

// services/course.service.js

import { pool } from "../config/db.js";

export const updateCourseService = async ({
  courseId,
  mentorId,
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

    const checkCourseResult = await pool.query(
      checkCourseQuery,
      [courseId, mentorId]
    );

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

    const updateResult = await pool.query(
      updateCourseQuery,
      values
    );

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

export const archiveCourseService = async({})

// addModuleService
// deleteModuleService
