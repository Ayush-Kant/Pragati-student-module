import { pool } from "../config/db.js";

class AdminAssessmentService {
  async createAssessment(data, createdBy) {
    // Assessments always start as 'draft' by default
    const query = `
      INSERT INTO assessments (title, type, difficulty, time_limit_minutes, total_marks, created_by, status)
      VALUES ($1, $2, $3, $4, $5, $6, 'draft')
      RETURNING *;
    `;
    const values = [data.title, data.type, data.difficulty, data.timeLimitMinutes, data.totalMarks, createdBy];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async getAllAssessments(filters, page = 1, limit = 20) {
    // Base query for getting the assessments + a subquery to get the total question count
    let query = `
      SELECT 
        a.id, a.title, a.type, a.difficulty, a.time_limit_minutes as "timeLimitMinutes", 
        a.total_marks as "totalMarks", a.status,
        (SELECT COUNT(*) FROM assessment_questions WHERE assessment_id = a.id) as "questionsCount"
      FROM assessments a
      WHERE 1=1
    `;
    const values = [];
    let count = 1;

    // Apply any filters that were passed in
    if (filters.type) {
      query += ` AND a.type = $${count++}`;
      values.push(filters.type);
    }
    if (filters.difficulty) {
      query += ` AND a.difficulty = $${count++}`;
      values.push(filters.difficulty);
    }
    if (filters.status) {
      query += ` AND a.status = $${count++}`;
      values.push(filters.status);
    }

    // First, let's grab the total count for pagination metadata
    const countQuery = `SELECT COUNT(*) FROM (${query}) as sub`;
    const totalRes = await pool.query(countQuery, values);
    const total = parseInt(totalRes.rows[0].count, 10);

    // Now tack on the limit and offset
    const offset = (page - 1) * limit;
    query += ` ORDER BY a.created_at DESC LIMIT $${count++} OFFSET $${count++}`;
    values.push(limit, offset);

    const result = await pool.query(query, values);
    
    // Format the response to match the exact specs
    return { 
      assessments: result.rows.map(r => ({
        ...r, 
        id: `assess_${r.id}`, 
        questionsCount: parseInt(r.questionsCount, 10) 
      })), 
      total, 
      page, 
      limit 
    };
  }

  async getAssessmentById(id) {
    const assessmentQuery = `
      SELECT 
        id, title, type, difficulty, time_limit_minutes as "timeLimitMinutes", 
        total_marks as "totalMarks", status
      FROM assessments 
      WHERE id = $1;
    `;
    const questionsQuery = `SELECT * FROM assessment_questions WHERE assessment_id = $1 ORDER BY created_at ASC;`;
    
    // Run both queries in parallel for better performance
    const [assessmentRes, questionsRes] = await Promise.all([
      pool.query(assessmentQuery, [id]),
      pool.query(questionsQuery, [id])
    ]);

    if (assessmentRes.rows.length === 0) {
      return null;
    }

    const assessment = assessmentRes.rows[0];
    assessment.id = `assess_${assessment.id}`; // Add the prefix
    assessment.questions = questionsRes.rows;
    
    return assessment;
  }

  async updateAssessment(id, data) {
    const query = `
      UPDATE assessments 
      SET title = COALESCE($1, title),
          difficulty = COALESCE($2, difficulty),
          updated_at = NOW()
      WHERE id = $3
      RETURNING *;
    `;
    const values = [data.title, data.difficulty, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async publishAssessment(id) {
    // Only draft assessments can be published
    const query = `
      UPDATE assessments 
      SET status = 'active', published_at = NOW(), updated_at = NOW()
      WHERE id = $1 AND status = 'draft'
      RETURNING *;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  async archiveAssessment(id) {
    // We do a soft delete by marking it as archived rather than actually deleting rows
    const query = `
      UPDATE assessments 
      SET status = 'archived', archived_at = NOW(), updated_at = NOW()
      WHERE id = $1
      RETURNING *;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  async addQuestion(assessmentId, data) {
    // Grab a client from the pool to use for our transaction
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Make sure the assessment actually exists first
      const verifyRes = await client.query('SELECT id FROM assessments WHERE id = $1', [assessmentId]);
      if (verifyRes.rows.length === 0) {
        throw new Error('Assessment not found');
      }

      const query = `
        INSERT INTO assessment_questions (
          assessment_id, type, question_text, options, correct_option, 
          problem_statement, language_support, marks
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
      `;
      
      const values = [
        assessmentId,
        data.type,
        data.question_text || null,
        data.options ? JSON.stringify(data.options) : null,
        data.correct_option !== undefined ? data.correct_option : null,
        data.problem_statement || null,
        data.language_support || null,
        data.marks
      ];
      
      const result = await client.query(query, values);
      
      await client.query('COMMIT');
      return result.rows[0];
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release(); // Don't forget to release the client back to the pool!
    }
  }

  async updateQuestion(assessmentId, questionId, data) {
    const query = `
      UPDATE assessment_questions
      SET type = COALESCE($1, type),
          question_text = COALESCE($2, question_text),
          options = COALESCE($3, options),
          correct_option = COALESCE($4, correct_option),
          problem_statement = COALESCE($5, problem_statement),
          language_support = COALESCE($6, language_support),
          marks = COALESCE($7, marks)
      WHERE id = $8 AND assessment_id = $9
      RETURNING *;
    `;
    const values = [
      data.type,
      data.question_text,
      data.options ? JSON.stringify(data.options) : null,
      data.correct_option,
      data.problem_statement,
      data.language_support,
      data.marks,
      questionId,
      assessmentId
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async deleteQuestion(assessmentId, questionId) {
    const query = `DELETE FROM assessment_questions WHERE id = $1 AND assessment_id = $2 RETURNING *;`;
    const result = await pool.query(query, [questionId, assessmentId]);
    return result.rows[0];
  }

  async assignToDrive(assessmentId, driveIdStr) {
    // If they pass in something like "drive_101", we just want the "101" part
    const driveId = typeof driveIdStr === 'string' ? parseInt(driveIdStr.replace('drive_', ''), 10) : driveIdStr;

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      // Verify both the assessment and the drive exist before attempting to link them
      const assessRes = await client.query('SELECT id FROM assessments WHERE id = $1', [assessmentId]);
      if (assessRes.rows.length === 0) throw new Error('Assessment not found');

      const driveRes = await client.query('SELECT id FROM recruitment_drives WHERE id = $1', [driveId]);
      if (driveRes.rows.length === 0) throw new Error('Drive not found');

      const query = `
        INSERT INTO assessment_assignments (assessment_id, drive_id)
        VALUES ($1, $2)
        RETURNING *;
      `;
      const result = await client.query(query, [assessmentId, driveId]);
      
      await client.query('COMMIT');
      return result.rows[0];
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }
}

export default new AdminAssessmentService();
