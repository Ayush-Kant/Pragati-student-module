import { pool } from "../config/db.js";

class StudentAssessmentService {
  async getAssignedAssessments(studentId) {
    const query = `
      SELECT a.id, a.title, a.type, a.difficulty, a.time_limit_minutes, a.total_marks, a.status,
             a.created_at, a.updated_at
      FROM assessments a
      JOIN assessment_assignments aa ON a.id = aa.assessment_id
      WHERE a.status = 'active'
      ORDER BY a.created_at DESC;
    `;

    const result = await pool.query(query);
    return result.rows;
  }

  async getAssessmentDetails(assessmentId) {
    const assessmentQuery = `
      SELECT id, title, type, difficulty, time_limit_minutes, total_marks, status, created_at, updated_at
      FROM assessments
      WHERE id = $1;
    `;

    const questionsQuery = `
      SELECT id, assessment_id, type, question_text, options, problem_statement, language_support,
             sample_input, sample_output, marks, created_at
      FROM assessment_questions
      WHERE assessment_id = $1
      ORDER BY id;
    `;

    const assessmentResult = await pool.query(assessmentQuery, [assessmentId]);
    const questionsResult = await pool.query(questionsQuery, [assessmentId]);

    if (assessmentResult.rows.length === 0) {
      return null;
    }

    return {
      ...assessmentResult.rows[0],
      questions: questionsResult.rows,
    };
  }

  async startAttempt(studentId, assessmentId) {
    const assessmentCheck = await pool.query(
      `SELECT id, status FROM assessments WHERE id = $1;`,
      [assessmentId]
    );

    if (assessmentCheck.rows.length === 0) {
      throw new Error("Assessment not found");
    }

    if (assessmentCheck.rows[0].status !== "active") {
      throw new Error("Assessment is not active");
    }

    const existingAttempt = await pool.query(
      `
      SELECT id, status
      FROM assessment_attempts
      WHERE student_id = $1 AND assessment_id = $2 AND status = 'started'
      ORDER BY started_at DESC
      LIMIT 1;
      `,
      [studentId, assessmentId]
    );

    if (existingAttempt.rows.length > 0) {
      return existingAttempt.rows[0];
    }

    const query = `
      INSERT INTO assessment_attempts (student_id, assessment_id, started_at, status)
      VALUES ($1, $2, NOW(), 'started')
      RETURNING id, student_id, assessment_id, started_at, submitted_at, score, status;
    `;

    const result = await pool.query(query, [studentId, assessmentId]);
    return result.rows[0];
  }

  async submitAttempt(studentId, assessmentId, answers = []) {
    const attemptQuery = `
      SELECT id
      FROM assessment_attempts
      WHERE student_id = $1 AND assessment_id = $2
      ORDER BY started_at DESC
      LIMIT 1;
    `;

    const attemptResult = await pool.query(attemptQuery, [studentId, assessmentId]);
    if (attemptResult.rows.length === 0) {
      return null;
    }

    const attemptId = attemptResult.rows[0].id;
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      for (const answer of answers) {
        const questionQuery = `
          SELECT type, correct_option, marks
          FROM assessment_questions
          WHERE id = $1;
        `;

        const questionResult = await client.query(questionQuery, [answer.question_id]);
        const question = questionResult.rows[0];

        let isCorrect = false;
        let marksObtained = 0;

        if (question) {
          if (question.type === "MCQ") {
            isCorrect = String(question.correct_option) === String(answer.selected_option);
            marksObtained = isCorrect ? Number(question.marks) : 0;
          } else if (question.type === "Coding") {
            isCorrect = Boolean(answer.answer_text && answer.answer_text.trim());
            marksObtained = isCorrect ? Number(question.marks) : 0;
          }
        }

        await client.query(
          `
          INSERT INTO assessment_submissions (
            attempt_id, question_id, selected_option, answer_text, is_correct, marks_obtained
          ) VALUES ($1, $2, $3, $4, $5, $6);
          `,
          [attemptId, answer.question_id, answer.selected_option ?? null, answer.answer_text ?? null, isCorrect, marksObtained]
        );
      }

      await this.calculateScore(attemptId, client);

      await client.query(
        `
        UPDATE assessment_attempts
        SET submitted_at = NOW(),
            status = 'submitted',
            updated_at = NOW()
        WHERE id = $1;
        `,
        [attemptId]
      );

      await client.query("COMMIT");

      return { message: "Assessment submitted successfully." };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async calculateScore(attemptId, client = pool) {
    const query = `
      SELECT COALESCE(SUM(marks_obtained), 0) AS score
      FROM assessment_submissions
      WHERE attempt_id = $1;
    `;

    const result = await client.query(query, [attemptId]);
    const score = Number(result.rows[0].score || 0);

    await client.query(
      `
      UPDATE assessment_attempts
      SET score = $1
      WHERE id = $2;
      `,
      [score, attemptId]
    );

    return score;
  }

  async getResult(studentId, assessmentId) {
    const query = `
      SELECT id, student_id, assessment_id, started_at, submitted_at, score, status, created_at, updated_at
      FROM assessment_attempts
      WHERE student_id = $1 AND assessment_id = $2
      ORDER BY started_at DESC
      LIMIT 1;
    `;

    const result = await pool.query(query, [studentId, assessmentId]);

    if (result.rows.length === 0) {
      return null;
    }

    const attempt = result.rows[0];
    if (attempt.status === "submitted") {
      await this.calculateScore(attempt.id);
      const refreshedResult = await pool.query(
        `
        SELECT id, student_id, assessment_id, started_at, submitted_at, score, status, created_at, updated_at
        FROM assessment_attempts
        WHERE id = $1;
        `,
        [attempt.id]
      );
      return refreshedResult.rows[0];
    }

    return attempt;
  }
}

export default new StudentAssessmentService();