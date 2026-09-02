import { pool } from "../config/db.js";

const parseAssessmentId = (value) => {
  const normalized = String(value ?? "").replace(/^assess_/, "");
  const id = Number(normalized);
  if (!Number.isInteger(id) || id <= 0) {
    throw Object.assign(new Error("Invalid assessment id"), { statusCode: 400 });
  }
  return id;
};

const parseAttemptId = (value) => {
  const id = Number(String(value ?? "").replace(/^attempt_/, ""));
  if (!Number.isInteger(id) || id <= 0) {
    throw Object.assign(new Error("Invalid attempt id"), { statusCode: 400 });
  }
  return id;
};

const publicQuestion = (question, order) => ({
  id: question.id,
  type: question.type,
  questionText: question.question_text,
  options: question.options,
  problemStatement: question.problem_statement,
  languageSupport: question.language_support,
  sampleInput: question.sample_input,
  sampleOutput: question.sample_output,
  marks: Number(question.marks),
  order,
});

const getEligibleAssessment = async (client, assessmentId, studentId) => {
  const result = await client.query(
    `SELECT a.*
     FROM assessments a
     WHERE a.id = $1
       AND a.status = 'active'
       AND (
         NOT EXISTS (
           SELECT 1
           FROM assessment_assignments aa
           WHERE aa.assessment_id = a.id
         )
         OR EXISTS (
           SELECT 1
           FROM assessment_assignments aa
           JOIN student_drive_progress sdp ON sdp.drive_id = aa.drive_id
           WHERE aa.assessment_id = a.id
             AND sdp.student_id = $2
         )
       )
     LIMIT 1`,
    [assessmentId, studentId],
  );

  return result.rows[0] || null;
};

const ensureNotExpired = async (client, attempt) => {
  if (attempt.status !== "in_progress") return attempt;
  if (new Date(attempt.expires_at) > new Date()) return attempt;

  const updated = await client.query(
    `UPDATE student_assessment_attempts
     SET status = 'expired', submitted_at = COALESCE(submitted_at, expires_at), updated_at = NOW()
     WHERE id = $1 AND status = 'in_progress'
     RETURNING *`,
    [attempt.id],
  );

  return updated.rows[0] || attempt;
};

const gradeAttempt = async (client, attemptId) => {
  const answers = await client.query(
    `SELECT sa.question_id, sa.answer, q.correct_option, q.marks
     FROM student_assessment_answers sa
     JOIN assessment_questions q ON q.id = sa.question_id
     WHERE sa.attempt_id = $1`,
    [attemptId],
  );

  let score = 0;
  let totalMarks = 0;

  for (const row of answers.rows) {
    const marks = Number(row.marks) || 0;
    totalMarks += marks;

    const selected = Number(row.answer?.optionIndex);
    const isCorrect = Number.isInteger(selected) && selected === Number(row.correct_option);
    const awarded = isCorrect ? marks : 0;

    score += awarded;

    await client.query(
      `UPDATE student_assessment_answers
       SET is_correct = $1, marks_awarded = $2, updated_at = NOW()
       WHERE attempt_id = $3 AND question_id = $4`,
      [isCorrect, awarded, attemptId, row.question_id],
    );
  }

  const assessmentRes = await client.query(
    `SELECT a.total_marks AS assessment_total_marks
     FROM assessments a
     JOIN student_assessment_attempts sa ON sa.assessment_id = a.id
     WHERE sa.id = $1`,
    [attemptId],
  );

  const assessmentTotal = Number(assessmentRes.rows[0]?.assessment_total_marks);
  const effectiveTotal = assessmentTotal > 0 ? assessmentTotal : totalMarks;
  const percentage = effectiveTotal > 0 ? Number(((score / effectiveTotal) * 100).toFixed(2)) : 0;
  const passed = percentage >= 40;

  return { score, totalMarks: effectiveTotal, percentage, passed };
};

class StudentAssessmentService {
  async listAssessments(studentId) {
    const result = await pool.query(
      `SELECT
         a.id,
         a.title,
         a.type,
         a.difficulty,
         a.time_limit_minutes AS "timeLimitMinutes",
         a.total_marks AS "totalMarks",
         a.status,
         (
           SELECT COUNT(*)::INTEGER
           FROM assessment_questions aq
           WHERE aq.assessment_id = a.id
         ) AS "questionsCount",
         (
           SELECT COALESCE(MAX(saa.attempt_number), 0)::INTEGER
           FROM student_assessment_attempts saa
           WHERE saa.assessment_id = a.id
             AND saa.student_id = $1
         ) AS "attemptsUsed"
       FROM assessments a
       WHERE a.status = 'active'
         AND (
           NOT EXISTS (
             SELECT 1
             FROM assessment_assignments aa0
             WHERE aa0.assessment_id = a.id
           )
           OR EXISTS (
             SELECT 1
             FROM assessment_assignments aa0
             JOIN student_drive_progress sdp ON sdp.drive_id = aa0.drive_id
             WHERE aa0.assessment_id = a.id
               AND sdp.student_id = $1
           )
         )
       ORDER BY a.created_at DESC`,
      [studentId],
    );

    return result.rows.map((row) => ({
      ...row,
      id: `assess_${row.id}`,
      totalMarks: Number(row.totalMarks),
      questionsCount: Number(row.questionsCount),
      attemptsUsed: Number(row.attemptsUsed),
    }));
  }

  async getAssessment(studentId, assessmentIdValue) {
    const assessmentId = parseAssessmentId(assessmentIdValue);
    const assessment = await getEligibleAssessment(pool, assessmentId, studentId);

    if (!assessment) return null;

    const questions = await pool.query(
      `SELECT aq.*
       FROM assessment_questions aq
       WHERE aq.assessment_id = $1
       ORDER BY aq.created_at ASC, aq.id ASC`,
      [assessmentId],
    );

    return {
      ...assessment,
      id: `assess_${assessment.id}`,
      timeLimitMinutes: Number(assessment.time_limit_minutes),
      totalMarks: Number(assessment.total_marks),
      questions: questions.rows.map((question, index) => publicQuestion(question, index + 1)),
    };
  }

  async startAssessment(studentId, assessmentIdValue) {
    const assessmentId = parseAssessmentId(assessmentIdValue);
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const assessment = await getEligibleAssessment(client, assessmentId, studentId);
      if (!assessment) {
        throw Object.assign(new Error("Assessment not found or is not available to this student"), {
          statusCode: 404,
        });
      }

      const questions = await client.query(
        `SELECT * FROM assessment_questions
         WHERE assessment_id = $1
         ORDER BY created_at ASC, id ASC`,
        [assessmentId],
      );

      if (questions.rows.length === 0) {
        throw Object.assign(new Error("Assessment has no questions"), { statusCode: 409 });
      }

      const latest = await client.query(
        `SELECT * FROM student_assessment_attempts
         WHERE assessment_id = $1 AND student_id = $2
         ORDER BY attempt_number DESC
         LIMIT 1`,
        [assessmentId, studentId],
      );

      const latestAttempt = latest.rows[0];
      if (latestAttempt?.status === "in_progress") {
        const checked = await ensureNotExpired(client, latestAttempt);
        if (checked.status === "in_progress") {
          const attemptQuestions = await client.query(
            `SELECT saq.question_order, aq.*
             FROM student_assessment_attempt_questions saq
             JOIN assessment_questions aq ON aq.id = saq.question_id
             WHERE saq.attempt_id = $1
             ORDER BY saq.question_order ASC`,
            [checked.id],
          );

          await client.query("COMMIT");
          return this.#formatAttempt(checked, assessment, attemptQuestions.rows);
        }
      }

      const attemptNumber = latestAttempt ? Number(latestAttempt.attempt_number) + 1 : 1;
      const started = await client.query(
        `INSERT INTO student_assessment_attempts
          (assessment_id, student_id, attempt_number, started_at, expires_at, total_marks)
         VALUES ($1, $2, $3, NOW(), NOW() + ($4 * INTERVAL '1 minute'), $5)
         RETURNING *`,
        [assessmentId, studentId, attemptNumber, Number(assessment.time_limit_minutes), Number(assessment.total_marks)],
      );

      const attempt = started.rows[0];
      const insertedQuestions = [];

      for (let index = 0; index < questions.rows.length; index += 1) {
        const question = questions.rows[index];
        await client.query(
          `INSERT INTO student_assessment_attempt_questions (attempt_id, question_id, question_order)
           VALUES ($1, $2, $3)`,
          [attempt.id, question.id, index + 1],
        );
        insertedQuestions.push({ ...question, question_order: index + 1 });
      }

      await client.query("COMMIT");
      return this.#formatAttempt(attempt, assessment, insertedQuestions);
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async saveAnswer(studentId, attemptIdValue, questionId, answer) {
    const attemptId = parseAttemptId(attemptIdValue);
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const attemptRes = await client.query(
        `SELECT * FROM student_assessment_attempts
         WHERE id = $1 AND student_id = $2
         FOR UPDATE`,
        [attemptId, studentId],
      );

      if (!attemptRes.rows[0]) {
        throw Object.assign(new Error("Attempt not found"), { statusCode: 404 });
      }

      const attempt = await ensureNotExpired(client, attemptRes.rows[0]);
      if (attempt.status !== "in_progress") {
        throw Object.assign(new Error("This assessment attempt is no longer editable"), {
          statusCode: 409,
        });
      }

      const question = await client.query(
        `SELECT saq.question_id
         FROM student_assessment_attempt_questions saq
         WHERE saq.attempt_id = $1 AND saq.question_id = $2`,
        [attemptId, Number(questionId)],
      );

      if (!question.rows[0]) {
        throw Object.assign(new Error("Question does not belong to this attempt"), {
          statusCode: 400,
        });
      }

      await client.query(
        `INSERT INTO student_assessment_answers (attempt_id, question_id, answer)
         VALUES ($1, $2, $3)
         ON CONFLICT (attempt_id, question_id)
         DO UPDATE SET answer = EXCLUDED.answer, answered_at = NOW(), updated_at = NOW()`,
        [attemptId, Number(questionId), JSON.stringify(answer ?? null)],
      );

      await client.query("COMMIT");
      return { saved: true, attemptId: `attempt_${attemptId}`, questionId: Number(questionId) };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async recordTabSwitch(studentId, attemptIdValue) {
    const attemptId = parseAttemptId(attemptIdValue);
    const result = await pool.query(
      `UPDATE student_assessment_attempts
       SET tab_switch_count = tab_switch_count + 1, updated_at = NOW()
       WHERE id = $1 AND student_id = $2 AND status = 'in_progress'
       RETURNING tab_switch_count`,
      [attemptId, studentId],
    );

    if (!result.rows[0]) {
      throw Object.assign(new Error("Attempt not found or is no longer active"), { statusCode: 409 });
    }

    return {
      attemptId: `attempt_${attemptId}`,
      tabSwitchCount: result.rows[0].tab_switch_count,
    };
  }

  async submitAssessment(studentId, attemptIdValue, reason = "submitted") {
    const attemptId = parseAttemptId(attemptIdValue);
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const attemptRes = await client.query(
        `SELECT saa.*, a.title, a.time_limit_minutes AS "timeLimitMinutes", a.total_marks AS "assessmentTotalMarks"
         FROM student_assessment_attempts saa
         JOIN assessments a ON a.id = saa.assessment_id
         WHERE saa.id = $1 AND saa.student_id = $2
         FOR UPDATE`,
        [attemptId, studentId],
      );

      if (!attemptRes.rows[0]) {
        throw Object.assign(new Error("Attempt not found"), { statusCode: 404 });
      }

      let attempt = attemptRes.rows[0];
      attempt = await ensureNotExpired(client, attempt);

      if (["submitted", "auto_submitted"].includes(attempt.status)) {
        await client.query("COMMIT");
        return this.getResult(studentId, attemptId);
      }

      const isExpired = attempt.status === "expired" || new Date(attempt.expires_at) <= new Date();
      const submissionStatus = isExpired || reason === "timeout" ? "auto_submitted" : "submitted";
      const grading = await gradeAttempt(client, attemptId);

      const updated = await client.query(
        `UPDATE student_assessment_attempts
         SET status = $1,
             submitted_at = NOW(),
             score = $2,
             total_marks = $3,
             percentage = $4,
             passed = $5,
             updated_at = NOW()
         WHERE id = $6
         RETURNING *`,
        [submissionStatus, grading.score, grading.totalMarks, grading.percentage, grading.passed, attemptId],
      );

      await client.query("COMMIT");
      return this.getResult(studentId, updated.rows[0].id);
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async getResult(studentId, attemptIdValue) {
    const attemptId = parseAttemptId(attemptIdValue);
    const result = await pool.query(
      `SELECT
         saa.id,
         saa.assessment_id,
         saa.attempt_number,
         saa.status,
         saa.started_at,
         saa.expires_at,
         saa.submitted_at,
         saa.score,
         saa.total_marks,
         saa.percentage,
         saa.passed,
         saa.tab_switch_count,
         a.title,
         a.type,
         a.difficulty,
         a.time_limit_minutes,
         json_agg(
           json_build_object(
             'questionId', aq.id,
             'answer', sa.answer,
             'isCorrect', sa.is_correct,
             'marksAwarded', sa.marks_awarded,
             'correctOption', NULL
           ) ORDER BY sa.answered_at NULLS LAST, aq.id
         ) FILTER (WHERE aq.id IS NOT NULL) AS answers
       FROM student_assessment_attempts saa
       JOIN assessments a ON a.id = saa.assessment_id
       LEFT JOIN student_assessment_answers sa ON sa.attempt_id = saa.id
       LEFT JOIN assessment_questions aq ON aq.id = sa.question_id
       WHERE saa.id = $1 AND saa.student_id = $2
       GROUP BY saa.id, a.id`,
      [attemptId, studentId],
    );

    if (!result.rows[0]) return null;

    const row = result.rows[0];
    return {
      attemptId: `attempt_${row.id}`,
      assessmentId: `assess_${row.assessment_id}`,
      attemptNumber: row.attempt_number,
      title: row.title,
      type: row.type,
      difficulty: row.difficulty,
      status: row.status,
      startedAt: row.started_at,
      expiresAt: row.expires_at,
      submittedAt: row.submitted_at,
      score: Number(row.score || 0),
      totalMarks: Number(row.total_marks || 0),
      percentage: Number(row.percentage || 0),
      passed: Boolean(row.passed),
      tabSwitchCount: Number(row.tab_switch_count || 0),
      answers: row.answers || [],
    };
  }

  async getHistory(studentId) {
    const result = await pool.query(
      `SELECT
         saa.id,
         saa.assessment_id,
         saa.attempt_number,
         saa.status,
         saa.started_at,
         saa.submitted_at,
         saa.score,
         saa.total_marks,
         saa.percentage,
         saa.passed,
         a.title,
         a.type,
         a.difficulty
       FROM student_assessment_attempts saa
       JOIN assessments a ON a.id = saa.assessment_id
       WHERE saa.student_id = $1
       ORDER BY COALESCE(saa.submitted_at, saa.started_at) DESC`,
      [studentId],
    );

    return result.rows.map((row) => ({
      attemptId: `attempt_${row.id}`,
      assessmentId: `assess_${row.assessment_id}`,
      attemptNumber: row.attempt_number,
      title: row.title,
      type: row.type,
      difficulty: row.difficulty,
      status: row.status,
      startedAt: row.started_at,
      submittedAt: row.submitted_at,
      score: Number(row.score || 0),
      totalMarks: Number(row.total_marks || 0),
      percentage: Number(row.percentage || 0),
      passed: row.passed === null ? null : Boolean(row.passed),
    }));
  }

  #formatAttempt(attempt, assessment, questions) {
    return {
      attemptId: `attempt_${attempt.id}`,
      assessmentId: `assess_${assessment.id}`,
      title: assessment.title,
      type: assessment.type,
      difficulty: assessment.difficulty,
      timeLimitMinutes: Number(assessment.time_limit_minutes),
      totalMarks: Number(assessment.total_marks),
      attemptNumber: Number(attempt.attempt_number),
      status: attempt.status,
      startedAt: attempt.started_at,
      expiresAt: attempt.expires_at,
      remainingSeconds: Math.max(
        0,
        Math.floor((new Date(attempt.expires_at).getTime() - Date.now()) / 1000),
      ),
      tabSwitchCount: Number(attempt.tab_switch_count || 0),
      questions: questions.map((question) => publicQuestion(question, question.question_order)),
    };
  }
}

export default new StudentAssessmentService();
