import { pool } from "../config/db.js";

class StudentAssessmentService {

  // Get all assessments assigned to a student
  async getAssignedAssessments(studentId) {
    const query = `
      SELECT a.*
      FROM assessments a
      JOIN assessment_assignments aa
        ON a.id = aa.assessment_id
      WHERE a.status = 'active';
    `;

    const result = await pool.query(query);
    return result.rows;
  }

  // Get one assessment with all its questions
  async getAssessmentDetails(assessmentId) {
    const assessmentQuery = `
      SELECT *
      FROM assessments
      WHERE id = $1;
    `;

    const questionsQuery = `
      SELECT *
      FROM assessment_questions
      WHERE assessment_id = $1;
    `;

    const assessment = await pool.query(assessmentQuery, [assessmentId]);
    const questions = await pool.query(questionsQuery, [assessmentId]);

    if (assessment.rows.length === 0) {
      return null;
    }

    return {
      ...assessment.rows[0],
      questions: questions.rows,
    };
  }

  // Start a new assessment attempt
  async startAttempt(studentId, assessmentId) {
    const query = `
      INSERT INTO assessment_attempts
      (student_id, assessment_id, started_at, status)
      VALUES ($1, $2, NOW(), 'started')
      RETURNING *;
    `;

    const result = await pool.query(query, [studentId, assessmentId]);
    return result.rows[0];
  }

  // Submit student's answers
  async submitAttempt(attemptId, answers) {

    for (const answer of answers) {
      const query = `
        INSERT INTO assessment_submissions
        (attempt_id, question_id, selected_option, answer_text)
        VALUES ($1, $2, $3, $4);
      `;

      await pool.query(query, [
        attemptId,
        answer.question_id,
        answer.selected_option,
        answer.answer_text
      ]);
    }

    await pool.query(
      `
      UPDATE assessment_attempts
      SET submitted_at = NOW(),
          status = 'submitted'
      WHERE id = $1;
      `,
      [attemptId]
    );

    return { message: "Assessment submitted successfully." };
  }

  // Calculate student's score
  async calculateScore(attemptId) {
    const query = `
      SELECT COUNT(*) AS score
      FROM assessment_submissions
      WHERE attempt_id = $1
      AND is_correct = true;
    `;

    const result = await pool.query(query, [attemptId]);

    const score = Number(result.rows[0].score);

    await pool.query(
      `
      UPDATE assessment_attempts
      SET score = $1
      WHERE id = $2;
      `,
      [score, attemptId]
    );

    return score;
  }

  // Get final result
  async getResult(attemptId) {
    const query = `
      SELECT *
      FROM assessment_attempts
      WHERE id = $1;
    `;

    const result = await pool.query(query, [attemptId]);

    return result.rows[0];
  }

}

export default new StudentAssessmentService();