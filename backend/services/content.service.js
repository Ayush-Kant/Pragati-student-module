// services/course.service.js

import { pool } from "../config/db.js";

// =========================
// CREATE COURSE
// =========================

export const createCourseService = async ({
  mentorId,
  title,
  description,
  skillTags,
  driveId,
}) => {
  try {
    // verify drive ownership
    const driveCheckQuery = `
      SELECT id
      FROM drives
      WHERE id = $1
        AND mentor_id = $2
        AND is_active = true
    `;

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
    throw error;
  }
};

// =========================
// GET ALL COURSES
// =========================

export const getCoursesService = async ({ mentorId, status, driveId }) => {
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

export const getCourseByIdService = async ({ mentorId, courseId }) => {
  try {
    // check existence
    const courseCheckQuery = `
      SELECT id, mentor_id
      FROM courses
      WHERE id = $1
    `;

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
