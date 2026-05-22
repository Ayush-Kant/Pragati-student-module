// services/course.service.js

import { pool } from "../config/db.js";

// ==========================================
// 1. CREATE COURSE
// ==========================================
export const createCourseService = async ({
  userId,
  title,
  description,
  skillTags,
  driveId,
}) => {
  try {
    // 1. Fetch mentor id and check drive ownership in parallel to avoid sequential awaits
    const mentorQuery = `
      SELECT mentors.id
      FROM mentors
      INNER JOIN users ON users.id = mentors.user_id
      WHERE users.auth_user_id = $1
    `;

    const driveQuery = `
      SELECT recruitment_drives.id
      FROM recruitment_drives
      INNER JOIN users ON users.id = recruitment_drives.mentor_id
      WHERE recruitment_drives.id = $1
        AND users.auth_user_id = $2
    `;

    const [mentorRes, driveRes] = await Promise.all([
      pool.query(mentorQuery, [userId]),
      pool.query(driveQuery, [driveId, userId]),
    ]);

    const mentorId = mentorRes.rows[0]?.id;

    if (!mentorId) {
      return {
        status: "FORBIDDEN",
      };
    }

    if (driveRes.rows.length === 0) {
      return {
        status: "FORBIDDEN",
      };
    }

    // 2. Insert new course
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

    // 3. Auto create first module (Module 1)
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

// ==========================================
// 2. GET ALL COURSES FOR MENTOR
// ==========================================
export const getCoursesService = async ({ userId, status, driveId }) => {
  try {
    // 1. Resolve mentor existence
    const mentorQuery = `
      SELECT mentors.id
      FROM mentors
      INNER JOIN users ON users.id = mentors.user_id
      WHERE users.auth_user_id = $1
    `;
    const mentorRes = await pool.query(mentorQuery, [userId]);
    const mentorId = mentorRes.rows[0]?.id;

    if (!mentorId) {
      return {
        status: "FORBIDDEN",
      };
    }

    // 2. Build dynamic filter query
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

// ==========================================
// 3. GET COURSE BY ID (WITH NESTED MODULES)
// ==========================================
export const getCourseByIdService = async ({ userId, courseId }) => {
  try {
    // Combined Query: resolves existence, ownership, and details in one single roundtrip!
    const getCourseQuery = `
      SELECT
        courses.id AS course_id,
        courses.title,
        courses.status,
        courses.skill_tags,
        users.auth_user_id AS mentor_auth_uid,
        modules.id AS module_id,
        modules.title AS module_title,
        modules.order_index
      FROM courses
      INNER JOIN mentors ON mentors.id = courses.mentor_id
      INNER JOIN users ON users.id = mentors.user_id
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

    // Check ownership
    if (String(firstRow.mentor_auth_uid) !== String(userId)) {
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

// ==========================================
// 4. UPDATE COURSE
// ==========================================
export const updateCourseService = async ({
  courseId,
  userId,
  title,
  description,
  skillTags,
  status,
}) => {
  try {
    // 1. Single roundtrip to fetch existence, ownership and current status
    const checkQuery = `
      SELECT 
        courses.id,
        courses.status,
        users.auth_user_id AS mentor_auth_uid
      FROM courses
      INNER JOIN mentors ON mentors.id = courses.mentor_id
      INNER JOIN users ON users.id = mentors.user_id
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

    if (String(courseData.mentor_auth_uid) !== String(userId)) {
      return {
        statusCode: 403,
        success: false,
        message: "Forbidden",
      };
    }

    // 2. Enforce status transition validation rules
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

    // 3. Build dynamic update query
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

    // No fields to update
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

// ==========================================
// 5. ARCHIVE COURSE (SOFT DELETE)
// ==========================================
export const deleteCourseService = async ({ courseId, userId }) => {
  try {
    // 1. Single roundtrip to fetch existence, ownership and current status
    const checkQuery = `
      SELECT 
        courses.id,
        users.auth_user_id AS mentor_auth_uid
      FROM courses
      INNER JOIN mentors ON mentors.id = courses.mentor_id
      INNER JOIN users ON users.id = mentors.user_id
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

    if (String(courseData.mentor_auth_uid) !== String(userId)) {
      return {
        statusCode: 403,
        success: false,
        message: "Forbidden",
      };
    }

    // 2. Perform soft delete
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

// ==========================================
// 6. ADD MODULE TO COURSE
// ==========================================
export const createModuleService = async ({
  courseId,
  userId,
  title,
  orderIndex,
}) => {
  try {
    // 1. Single roundtrip to fetch existence and ownership of course
    const checkQuery = `
      SELECT 
        courses.id,
        users.auth_user_id AS mentor_auth_uid
      FROM courses
      INNER JOIN mentors ON mentors.id = courses.mentor_id
      INNER JOIN users ON users.id = mentors.user_id
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

    if (String(courseData.mentor_auth_uid) !== String(userId)) {
      return {
        statusCode: 403,
        success: false,
        message: "Forbidden",
      };
    }

    // 2. Insert new module
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

// ==========================================
// 7. HARD DELETE MODULE
// ==========================================
export const deleteModuleService = async ({ moduleId, userId }) => {
  try {
    // 1. Single roundtrip to fetch existence and ownership through module & parent course join
    const checkQuery = `
      SELECT 
        modules.id,
        users.auth_user_id AS mentor_auth_uid
      FROM modules
      INNER JOIN courses ON courses.id = modules.course_id
      INNER JOIN mentors ON mentors.id = courses.mentor_id
      INNER JOIN users ON users.id = mentors.user_id
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

    if (String(moduleData.mentor_auth_uid) !== String(userId)) {
      return {
        statusCode: 403,
        success: false,
        message: "Forbidden",
      };
    }

    // 2. Perform hard delete
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
