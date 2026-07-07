import { pool } from "../config/db.js";

// Helper function to map JWT token userId (auth_users.uuid_id) to mentors.id
export const resolveMentorIntId = async (uuid) => {
  const result = await pool.query(
    `SELECT mentors.id
     FROM mentors
     JOIN users ON mentors.user_id = users.id
     JOIN auth_users ON users.auth_user_id = auth_users.id
     WHERE auth_users.uuid_id = $1`,
    [uuid],
  );
  return result.rows[0]?.id ?? null;
};

export const createQuestion = async (mentorId, data) => {
  const {
    type,
    difficulty = "medium",
    body,
    options,
    correct,
    timeLimitSec,
    tags,
  } = data;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const insertQuestionQuery = `
      INSERT INTO question_bank (
        mentor_id, type, difficulty, body, options_json, correct_json, time_limit_sec
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `;
    const optionsJson =
      options !== undefined && options !== null
        ? JSON.stringify(options)
        : null;
    const correctJson = JSON.stringify(correct);

    const questionRes = await client.query(insertQuestionQuery, [
      mentorId,
      type,
      difficulty,
      body,
      optionsJson,
      correctJson,
      timeLimitSec !== undefined ? timeLimitSec : null,
    ]);
    const questionId = questionRes.rows[0].id;

    if (tags && tags.length > 0) {
      const insertTagQuery = `
        INSERT INTO question_tags (question_id, tag_name)
        VALUES ($1, $2)
      `;
      for (const tag of tags) {
        await client.query(insertTagQuery, [questionId, tag]);
      }
    }

    await client.query("COMMIT");
    return { success: true, questionId };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const getQuestions = async (mentorId, filters = {}) => {
  const { page = 1, limit = 10, search, tag, difficulty } = filters;

  const offset = (page - 1) * limit;

  const conditions = ["qb.mentor_id = $1", "qb.is_deleted = false"];
  const values = [mentorId];
  let index = 2;

  if (search) {
    conditions.push(`qb.body ILIKE $${index++}`);
    values.push(`%${search}%`);
  }

  if (difficulty) {
    conditions.push(`qb.difficulty = $${index++}`);
    values.push(difficulty);
  }

  if (tag) {
    conditions.push(`qb.id IN (
      SELECT question_id FROM question_tags WHERE tag_name = $${index++}
    )`);
    values.push(tag);
  }

  const whereClause = conditions.join(" AND ");

  const countQuery = `
    SELECT COUNT(*) 
    FROM question_bank qb
    WHERE ${whereClause}
  `;
  const countResult = await pool.query(countQuery, values);
  const total = parseInt(countResult.rows[0].count, 10);

  const dataQuery = `
    SELECT qb.id, qb.type, qb.difficulty, qb.body,
           COALESCE(ARRAY_AGG(qt.tag_name) FILTER (WHERE qt.tag_name IS NOT NULL), '{}') as tags
    FROM question_bank qb
    LEFT JOIN question_tags qt ON qb.id = qt.question_id
    WHERE ${whereClause}
    GROUP BY qb.id
    ORDER BY qb.created_at DESC
    LIMIT $${index++} OFFSET $${index++}
  `;

  const dataResult = await pool.query(dataQuery, [...values, limit, offset]);

  return {
    total,
    page: parseInt(page, 10),
    data: dataResult.rows.map((row) => ({
      id: row.id,
      type: row.type,
      difficulty: row.difficulty,
      body: row.body,
      tags: row.tags,
    })),
  };
};

export const getQuestionById = async (id) => {
  const result = await pool.query(
    `SELECT qb.*, COALESCE(ARRAY_AGG(qt.tag_name) FILTER (WHERE qt.tag_name IS NOT NULL), '{}') as tags
     FROM question_bank qb
     LEFT JOIN question_tags qt ON qb.id = qt.question_id
     WHERE qb.id = $1 AND qb.is_deleted = false
     GROUP BY qb.id`,
    [id],
  );
  return result.rows[0] || null;
};

export const updateQuestion = async (id, mentorId, data) => {
  const { type, difficulty, body, options, correct, timeLimitSec, tags } = data;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const updates = [];
    const values = [];
    let index = 1;

    if (type !== undefined) {
      updates.push(`type = $${index++}`);
      values.push(type);
    }
    if (difficulty !== undefined) {
      updates.push(`difficulty = $${index++}`);
      values.push(difficulty);
    }
    if (body !== undefined) {
      updates.push(`body = $${index++}`);
      values.push(body);
    }
    if (options !== undefined) {
      updates.push(`options_json = $${index++}`);
      values.push(options !== null ? JSON.stringify(options) : null);
    }
    if (correct !== undefined) {
      updates.push(`correct_json = $${index++}`);
      values.push(correct !== null ? JSON.stringify(correct) : null);
    }
    if (timeLimitSec !== undefined) {
      updates.push(`time_limit_sec = $${index++}`);
      values.push(timeLimitSec);
    }

    if (updates.length > 0) {
      values.push(id);
      const updateQuery = `
        UPDATE question_bank
        SET ${updates.join(", ")}, created_at = created_at
        WHERE id = $${index}
      `;
      await client.query(updateQuery, values);
    }

    if (tags !== undefined) {
      // Delete old tags
      await client.query(`DELETE FROM question_tags WHERE question_id = $1`, [
        id,
      ]);
      // Insert new tags
      if (tags && tags.length > 0) {
        const insertTagQuery = `
          INSERT INTO question_tags (question_id, tag_name)
          VALUES ($1, $2)
        `;
        for (const tag of tags) {
          await client.query(insertTagQuery, [id, tag]);
        }
      }
    }

    await client.query("COMMIT");
    return { success: true };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const deleteQuestion = async (id) => {
  await pool.query(
    `UPDATE question_bank
     SET is_deleted = true
     WHERE id = $1`,
    [id],
  );
  return { success: true };
};

// Helper array shuffle function
const shuffleArray = (array) => {
  if (!Array.isArray(array)) return array;
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export const generateQuiz = async (mentorId, assessmentId, criteria) => {
  const {
    skillTags,
    difficulty,
    questionCount = 10,
    randomizeOrder = true,
    randomizeOptions = true,
  } = criteria;

  const checkAssessmentQuery = `
    SELECT a.created_by
    FROM assessments a
    WHERE a.id = $1
  `;
  const checkAssessmentRes = await pool.query(checkAssessmentQuery, [
    assessmentId,
  ]);

  if (checkAssessmentRes.rows.length === 0) {
    return { status: "NOT_FOUND" };
  }

  const getMentorUserIdQuery = `
    SELECT user_id
    FROM mentors
    WHERE id = $1
  `;
  const getMentorUserIdRes = await pool.query(getMentorUserIdQuery, [mentorId]);
  const mentorUserId = getMentorUserIdRes.rows[0]?.user_id;

  if (checkAssessmentRes.rows[0].created_by !== mentorUserId) {
    return { status: "FORBIDDEN" };
  }

  const conditions = ["qb.is_deleted = false"];
  const values = [];
  let index = 1;

  if (difficulty) {
    conditions.push(`qb.difficulty = $${index++}`);
    values.push(difficulty);
  }

  if (skillTags && skillTags.length > 0) {
    conditions.push(`qb.id IN (
      SELECT question_id FROM question_tags WHERE tag_name = ANY($${index++})
    )`);
    values.push(skillTags);
  }

  const whereClause = conditions.join(" AND ");
  const query = `
    SELECT qb.id, qb.type, qb.difficulty, qb.body, qb.options_json, qb.correct_json, qb.time_limit_sec,
           COALESCE(ARRAY_AGG(qt.tag_name) FILTER (WHERE qt.tag_name IS NOT NULL), '{}') as tags
    FROM question_bank qb
    LEFT JOIN question_tags qt ON qb.id = qt.question_id
    WHERE ${whereClause}
    GROUP BY qb.id
    ORDER BY RANDOM()
    LIMIT $${index++}
  `;

  const questionResult = await pool.query(query, [...values, questionCount]);
  const questionsFetched = questionResult.rows;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Clear existing assessment questions
    await client.query(
      `DELETE FROM assessment_question_bank
       WHERE assessment_id = $1`,
      [assessmentId],
    );

    // Insert new mappings
    const insertMappingQuery = `
      INSERT INTO assessment_question_bank (assessment_id, question_id, order_index)
      VALUES ($1, $2, $3)
    `;

    // Determine ordering
    let orderedQuestions = [...questionsFetched];
    if (!randomizeOrder) {
      orderedQuestions.sort((a, b) => a.id - b.id);
    }

    for (let i = 0; i < orderedQuestions.length; i++) {
      await client.query(insertMappingQuery, [
        assessmentId,
        orderedQuestions[i].id,
        i,
      ]);
    }

    await client.query("COMMIT");

    // Format the final questions output
    const formattedQuestions = orderedQuestions.map((q, idx) => {
      let options = q.options_json;
      if (
        randomizeOptions &&
        (q.type === "mcq" || q.type === "multi_select") &&
        Array.isArray(options)
      ) {
        options = shuffleArray(options);
      }
      return {
        id: q.id,
        type: q.type,
        difficulty: q.difficulty,
        body: q.body,
        options,
        correct: q.correct_json,
        timeLimitSec: q.time_limit_sec,
        tags: q.tags,
        orderIndex: idx,
      };
    });

    return {
      status: "SUCCESS",
      questionsAdded: formattedQuestions.length,
      questions: formattedQuestions,
    };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};
