import { pool } from "../config/db.js";

const ACTIVE_STATUS = "active";
const PASSING_DEFAULT = 40;

const parseAssessmentId = (value) => {
  const id = Number(String(value ?? "").replace(/^assess_/, ""));
  if (!Number.isInteger(id) || id <= 0) throw Object.assign(new Error("Invalid assessment id"), { statusCode: 400 });
  return id;
};

const parseAttemptId = (value) => {
  const id = Number(String(value ?? "").replace(/^attempt_/, ""));
  if (!Number.isInteger(id) || id <= 0) throw Object.assign(new Error("Invalid attempt id"), { statusCode: 400 });
  return id;
};

const normalizeType = (value) => {
  const type = String(value || "MCQ").trim().toUpperCase().replace(/[\s-]+/g, "_");
  if (["TRUEFALSE", "TRUE_FALSE", "TRUE/FALSE"].includes(type)) return "TRUE_FALSE";
  if (["FIB", "FILL_BLANK", "FILL_IN_THE_BLANK", "FILL_IN_BLANK"].includes(type)) return "FILL_BLANK";
  if (["MATCH", "MATCH_THE_FOLLOWING", "MATCH_FOLLOWING"].includes(type)) return "MATCH";
  return type;
};

const shuffle = (items) => {
  const values = [...items];
  for (let i = values.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [values[i], values[j]] = [values[j], values[i]];
  }
  return values;
};

const normalizeOptions = (options) => {
  if (!Array.isArray(options)) return [];
  return options.map((option, index) => {
    if (option && typeof option === "object") {
      return { id: String(option.id ?? `option_${index}`), text: String(option.text ?? option.label ?? option.value ?? "") };
    }
    return { id: `option_${index}`, text: String(option) };
  });
};

const parseJsonValue = (value) => {
  if (value === null || value === undefined) return null;
  if (typeof value === "object") return value;
  try { return JSON.parse(String(value)); } catch { return value; }
};

const normalizeMatch = (value) => {
  const parsed = parseJsonValue(value);
  if (Array.isArray(parsed)) {
    return Object.fromEntries(parsed
      .filter((pair) => pair && typeof pair === "object")
      .map((pair) => [String(pair.left ?? pair.key ?? ""), String(pair.right ?? pair.value ?? "")]));
  }
  if (parsed && typeof parsed === "object") {
    const matches = parsed.matches;
    return matches && typeof matches === "object" && !Array.isArray(matches) ? matches : parsed;
  }
  return {};
};

const parseAcceptedAnswers = (value) => {
  const parsed = parseJsonValue(value);
  if (Array.isArray(parsed)) return parsed.map((item) => String(item).trim().toLowerCase());
  if (parsed && typeof parsed === "object") return Object.values(parsed).map((item) => String(item).trim().toLowerCase());
  return parsed === null || parsed === undefined ? [] : [String(parsed).trim().toLowerCase()];
};

const publicQuestion = (question, order, optionOrder = []) => {
  const type = normalizeType(question.type);
  const normalized = normalizeOptions(question.options);
  let options = question.options;
  if (type === "MCQ") {
    const indexes = optionOrder.length ? optionOrder : normalized.map((_option, index) => index);
    options = indexes.map((index) => normalized[index]).filter(Boolean);
  } else if (type === "TRUE_FALSE") {
    const values = normalized.length ? normalized : normalizeOptions(["True", "False"]);
    const indexes = optionOrder.length ? optionOrder : values.map((_option, index) => index);
    options = indexes.map((index) => values[index]).filter(Boolean);
  } else if (type === "MATCH") {
    const value = parseJsonValue(question.options);
    options = value && typeof value === "object" ? value : { left: [], right: [] };
  } else {
    options = undefined;
  }

  return {
    id: question.id,
    type,
    questionText: question.question_text,
    options,
    problemStatement: question.problem_statement,
    languageSupport: question.language_support,
    sampleInput: question.sample_input,
    sampleOutput: question.sample_output,
    marks: Number(question.marks) || 0,
    order,
  };
};

const getEligibleAssessment = async (client, assessmentId, studentId, allowCompletedWindow = false) => {
  const result = await client.query(
    `SELECT a.*
     FROM assessments a
     WHERE a.id = $1
       AND LOWER(a.status) = $2
       AND ($5::boolean OR a.available_from IS NULL OR a.available_from <= NOW())
       AND ($5::boolean OR a.due_at IS NULL OR a.due_at >= NOW()
            OR EXISTS (
              SELECT 1 FROM student_assessment_attempts saa
              WHERE saa.assessment_id = a.id AND saa.student_id = $3
                AND saa.status = 'in_progress' AND saa.expires_at > NOW()
            ))
       AND (
         NOT EXISTS (SELECT 1 FROM assessment_assignments aa WHERE aa.assessment_id = a.id)
         OR EXISTS (
           SELECT 1 FROM assessment_assignments aa
           JOIN student_drive_progress sdp ON sdp.drive_id = aa.drive_id
           WHERE aa.assessment_id = a.id AND sdp.student_id = $4
         )
       )
     LIMIT 1`,
    [assessmentId, ACTIVE_STATUS, studentId, studentId, allowCompletedWindow],
  );
  return result.rows[0] || null;
};

const ensureNotExpired = async (client, attempt) => {
  if (attempt.status !== "in_progress" || new Date(attempt.expires_at) > new Date()) return attempt;
  const result = await client.query(
    `UPDATE student_assessment_attempts
     SET status = 'expired', submitted_at = COALESCE(submitted_at, expires_at), updated_at = NOW()
     WHERE id = $1 AND status = 'in_progress'
     RETURNING *`,
    [attempt.id],
  );
  return result.rows[0] || { ...attempt, status: "expired" };
};

const getAttemptQuestions = async (client, attemptId) => {
  const result = await client.query(
    `SELECT saq.question_order, saq.option_order, aq.*
     FROM student_assessment_attempt_questions saq
     JOIN assessment_questions aq ON aq.id = saq.question_id
     WHERE saq.attempt_id = $1
     ORDER BY saq.question_order`,
    [attemptId],
  );
  return result.rows;
};

const isCorrect = (question, answer, optionOrder) => {
  const type = normalizeType(question.type);
  const configured = parseJsonValue(question.correct_answer);

  if (type === "MCQ") {
    const options = normalizeOptions(question.options);
    const selectedId = answer?.optionId !== undefined ? String(answer.optionId) : null;
    const selectedIndex = selectedId
      ? options.findIndex((option) => option.id === selectedId)
      : Number(answer?.optionIndex);
    const configuredIndex = Number(question.correct_option);
    if (Number.isInteger(configuredIndex) && configuredIndex >= 0) return Number(selectedIndex) === configuredIndex;
    if (configured && typeof configured === "object") return String(configured.id ?? configured.optionId) === selectedId;
    return String(configured ?? "") === String(selectedId ?? "");
  }

  if (type === "TRUE_FALSE") {
    const raw = answer?.value ?? answer?.answer ?? answer;
    const selected = typeof raw === "boolean" ? raw : String(raw).trim().toLowerCase() === "true";
    const expectedRaw = configured ?? question.correct_option === 1;
    const expected = typeof expectedRaw === "boolean" ? expectedRaw : ["true", "1", "yes"].includes(String(expectedRaw).trim().toLowerCase());
    return selected === expected;
  }

  if (type === "FILL_BLANK") {
    const actual = String(answer?.text ?? answer?.value ?? answer ?? "").trim().toLowerCase();
    return parseAcceptedAnswers(configured).includes(actual) || (!parseAcceptedAnswers(configured).length && String(question.correct_option ?? "").trim().toLowerCase() === actual);
  }

  if (type === "MATCH") {
    const expected = normalizeMatch(configured);
    const actual = normalizeMatch(answer);
    const expectedKeys = Object.keys(expected);
    const actualKeys = Object.keys(actual);
    if (!expectedKeys.length || expectedKeys.length !== actualKeys.length) return false;
    return expectedKeys.every((key) => String(expected[key]).trim().toLowerCase() === String(actual[key]).trim().toLowerCase());
  }

  return false;
};

const gradeAttempt = async (client, attemptId) => {
  const questions = await getAttemptQuestions(client, attemptId);
  const answersResult = await client.query(`SELECT question_id, answer FROM student_assessment_answers WHERE attempt_id = $1`, [attemptId]);
  const answers = new Map(answersResult.rows.map((row) => [Number(row.question_id), row.answer]));
  let score = 0;
  let totalMarks = 0;
  let correctAnswers = 0;

  for (const question of questions) {
    const marks = Number(question.marks) || 0;
    totalMarks += marks;
    const answer = answers.get(Number(question.id));
    const optionOrder = Array.isArray(question.option_order) ? question.option_order.map(Number) : [];
    const correct = answer !== undefined && isCorrect(question, answer, optionOrder);
    const awarded = correct ? marks : 0;
    if (correct) correctAnswers += 1;
    score += awarded;
    await client.query(
      `UPDATE student_assessment_answers
       SET is_correct = $1, marks_awarded = $2, updated_at = NOW()
       WHERE attempt_id = $3 AND question_id = $4`,
      [correct, awarded, attemptId, question.id],
    );
  }
  return { score, totalMarks, correctAnswers, totalQuestions: questions.length };
};

class StudentAssessmentService {
  async listAssessments(studentId, statusFilter = "all") {
    const result = await pool.query(
      `SELECT a.id, a.title, a.description, a.type, a.difficulty,
              a.time_limit_minutes AS "timeLimitMinutes", a.total_marks AS "totalMarks", a.status,
              a.available_from AS "availableFrom", a.due_at AS "dueAt", a.max_attempts AS "maxAttempts",
              a.review_enabled AS "reviewEnabled", a.review_available_at AS "reviewAvailableAt",
              a.shuffle_questions AS "shuffleQuestions", a.shuffle_options AS "shuffleOptions",
              a.passing_percentage AS "passingPercentage",
              (SELECT COUNT(*)::INTEGER FROM assessment_questions aq WHERE aq.assessment_id = a.id) AS "questionsCount",
              (SELECT COALESCE(MAX(saa.attempt_number),0)::INTEGER FROM student_assessment_attempts saa WHERE saa.assessment_id = a.id AND saa.student_id = $1) AS "attemptsUsed",
              (SELECT COUNT(*)::INTEGER FROM student_assessment_attempts saa WHERE saa.assessment_id = a.id AND saa.student_id = $1 AND saa.status = 'in_progress') AS "activeAttempts"
       FROM assessments a
       WHERE LOWER(a.status) = 'active'
         AND (a.available_from IS NULL OR a.available_from <= NOW())
         AND (NOT EXISTS (SELECT 1 FROM assessment_assignments aa WHERE aa.assessment_id = a.id)
              OR EXISTS (SELECT 1 FROM assessment_assignments aa JOIN student_drive_progress sdp ON sdp.drive_id = aa.drive_id WHERE aa.assessment_id = a.id AND sdp.student_id = $1))
       ORDER BY a.created_at DESC`,
      [studentId],
    );

    return result.rows.map((row) => {
      const attemptsUsed = Number(row.attemptsUsed || 0);
      const maxAttempts = Math.max(1, Number(row.maxAttempts || 1));
      const dueAt = row.dueAt ? new Date(row.dueAt).getTime() : null;
      const status = Number(row.activeAttempts) > 0 ? "in_progress" : dueAt && dueAt < Date.now() ? (attemptsUsed ? "attempted" : "expired") : attemptsUsed ? "attempted" : "pending";
      return {
        ...row,
        id: `assess_${row.id}`,
        totalMarks: Number(row.totalMarks || 0),
        timeLimitMinutes: Number(row.timeLimitMinutes || 0),
        questionsCount: Number(row.questionsCount || 0),
        attemptsUsed,
        maxAttempts,
        attemptsRemaining: Math.max(0, maxAttempts - attemptsUsed),
        studentStatus: status,
        reviewEnabled: Boolean(row.reviewEnabled),
        passingPercentage: Number(row.passingPercentage || PASSING_DEFAULT),
      };
    }).filter((assessment) => statusFilter === "all" || assessment.studentStatus === statusFilter);
  }

  async getAssessment(studentId, assessmentIdValue) {
    const assessmentId = parseAssessmentId(assessmentIdValue);
    const assessment = await getEligibleAssessment(pool, assessmentId, studentId);
    if (!assessment) return null;
    const result = await pool.query(`SELECT * FROM assessment_questions WHERE assessment_id = $1 ORDER BY created_at, id`, [assessmentId]);
    return {
      id: `assess_${assessment.id}`, title: assessment.title, description: assessment.description, type: assessment.type,
      difficulty: assessment.difficulty, timeLimitMinutes: Number(assessment.time_limit_minutes || 0), totalMarks: Number(assessment.total_marks || 0),
      status: assessment.status, availableFrom: assessment.available_from, dueAt: assessment.due_at,
      maxAttempts: Math.max(1, Number(assessment.max_attempts || 1)), reviewEnabled: Boolean(assessment.review_enabled),
      reviewAvailableAt: assessment.review_available_at, shuffleQuestions: assessment.shuffle_questions !== false,
      shuffleOptions: assessment.shuffle_options !== false, passingPercentage: Number(assessment.passing_percentage || PASSING_DEFAULT),
      questions: result.rows.map((question, index) => publicQuestion(question, index + 1)),
    };
  }

  async startAssessment(studentId, assessmentIdValue) {
    const assessmentId = parseAssessmentId(assessmentIdValue);
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(`SELECT pg_advisory_xact_lock(hashtextextended($1, 0))`, [`student-assessment:${studentId}:${assessmentId}`]);
      const assessment = await getEligibleAssessment(client, assessmentId, studentId);
      if (!assessment) throw Object.assign(new Error("Assessment not found or its availability window has closed"), { statusCode: 404 });

      const latestResult = await client.query(`SELECT * FROM student_assessment_attempts WHERE assessment_id=$1 AND student_id=$2 ORDER BY attempt_number DESC LIMIT 1`, [assessmentId, studentId]);
      let latest = latestResult.rows[0] || null;
      if (latest) latest = await ensureNotExpired(client, latest);
      if (latest?.status === "in_progress") {
        const questionRows = await getAttemptQuestions(client, latest.id);
        const answersResult = await client.query(`SELECT question_id, answer FROM student_assessment_answers WHERE attempt_id=$1`, [latest.id]);
        const response = this.#formatAttempt(latest, assessment, questionRows);
        response.answers = Object.fromEntries(answersResult.rows.map((row) => [String(row.question_id), row.answer]));
        await client.query("COMMIT");
        return response;
      }

      const maxAttempts = Math.max(1, Number(assessment.max_attempts || 1));
      const nextAttemptNumber = Number(latest?.attempt_number || 0) + 1;
      if (nextAttemptNumber > maxAttempts) throw Object.assign(new Error("No attempts remaining for this assessment"), { statusCode: 400 });
      if (assessment.available_from && new Date(assessment.available_from) > new Date()) throw Object.assign(new Error("Assessment is not available yet"), { statusCode: 403 });
      if (assessment.due_at && new Date(assessment.due_at) < new Date()) throw Object.assign(new Error("Assessment submission window has closed"), { statusCode: 403 });

      const result = await client.query(`SELECT * FROM assessment_questions WHERE assessment_id=$1 ORDER BY created_at,id`, [assessmentId]);
      if (!result.rows.length) throw Object.assign(new Error("Assessment has no questions"), { statusCode: 409 });
      const questions = assessment.shuffle_questions !== false ? shuffle(result.rows) : result.rows;
      const timeLimit = Math.max(1, Number(assessment.time_limit_minutes || 1));
      const attemptResult = await client.query(
        `INSERT INTO student_assessment_attempts (assessment_id,student_id,attempt_number,started_at,expires_at,total_marks)
         VALUES ($1,$2,$3,NOW(),NOW()+($4*INTERVAL '1 minute'),$5) RETURNING *`,
        [assessmentId, studentId, nextAttemptNumber, timeLimit, Number(assessment.total_marks || questions.reduce((sum, q) => sum + (Number(q.marks) || 0), 0))],
      );
      const attempt = attemptResult.rows[0];
      const rows = [];
      for (let index=0; index<questions.length; index+=1) {
        const question = questions[index];
        const type = normalizeType(question.type);
        const options = normalizeOptions(type === "TRUE_FALSE" && !Array.isArray(question.options) ? ["True","False"] : question.options);
        const optionOrder = (type === "MCQ" || type === "TRUE_FALSE") ? (assessment.shuffle_options !== false ? shuffle(options.map((_o,i)=>i)) : options.map((_o,i)=>i)) : [];
        await client.query(`INSERT INTO student_assessment_attempt_questions (attempt_id,question_id,question_order,option_order) VALUES ($1,$2,$3,$4)`, [attempt.id,question.id,index+1,JSON.stringify(optionOrder)]);
        rows.push({ ...question, question_order:index+1, option_order:optionOrder });
      }
      await client.query("COMMIT");
      return this.#formatAttempt(attempt, assessment, rows);
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally { client.release(); }
  }

  async saveAnswer(studentId, attemptIdValue, questionIdValue, answer) {
    const attemptId = parseAttemptId(attemptIdValue);
    const questionId = Number(questionIdValue);
    if (!Number.isInteger(questionId) || questionId <= 0) throw Object.assign(new Error("Invalid question id"), { statusCode:400 });
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const attemptResult = await client.query(`SELECT * FROM student_assessment_attempts WHERE id=$1 AND student_id=$2 FOR UPDATE`, [attemptId,studentId]);
      if (!attemptResult.rows[0]) throw Object.assign(new Error("Attempt not found"), { statusCode:404 });
      const attempt = await ensureNotExpired(client,attemptResult.rows[0]);
      if (attempt.status !== "in_progress" || new Date(attempt.expires_at) <= new Date()) throw Object.assign(new Error("This assessment attempt is no longer editable"), { statusCode:409 });
      const questionResult = await client.query(`SELECT aq.*,saq.option_order FROM student_assessment_attempt_questions saq JOIN assessment_questions aq ON aq.id=saq.question_id WHERE saq.attempt_id=$1 AND aq.id=$2`, [attemptId,questionId]);
      if (!questionResult.rows[0]) throw Object.assign(new Error("Question does not belong to this attempt"), { statusCode:400 });
      const question = questionResult.rows[0];
      const normalized = this.#validateAnswer(question, answer, Array.isArray(question.option_order) ? question.option_order.map(Number) : []);
      await client.query(`INSERT INTO student_assessment_answers (attempt_id,question_id,answer,answered_at,updated_at) VALUES ($1,$2,$3,NOW(),NOW()) ON CONFLICT (attempt_id,question_id) DO UPDATE SET answer=EXCLUDED.answer,answered_at=NOW(),updated_at=NOW()`, [attemptId,questionId,JSON.stringify(normalized)]);
      await client.query("COMMIT");
      return { saved:true, attemptId:`attempt_${attemptId}`, questionId };
    } catch(error) { await client.query("ROLLBACK"); throw error; } finally { client.release(); }
  }

  async recordTabSwitch(studentId, attemptIdValue) {
    const attemptId = parseAttemptId(attemptIdValue);
    const result = await pool.query(`UPDATE student_assessment_attempts SET tab_switch_count=tab_switch_count+1,updated_at=NOW() WHERE id=$1 AND student_id=$2 AND status='in_progress' AND expires_at>NOW() RETURNING tab_switch_count`, [attemptId,studentId]);
    if (!result.rows[0]) throw Object.assign(new Error("Attempt not found or no longer active"), { statusCode:409 });
    return { attemptId:`attempt_${attemptId}`, tabSwitchCount:Number(result.rows[0].tab_switch_count) };
  }

  async submitAssessment(studentId, attemptIdValue, reason="submitted", answersPayload=null) {
    const attemptId = parseAttemptId(attemptIdValue);
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const attemptResult = await client.query(`SELECT saa.*,a.title,a.passing_percentage,a.review_enabled,a.review_available_at,a.due_at FROM student_assessment_attempts saa JOIN assessments a ON a.id=saa.assessment_id WHERE saa.id=$1 AND saa.student_id=$2 FOR UPDATE`, [attemptId,studentId]);
      if (!attemptResult.rows[0]) throw Object.assign(new Error("Attempt not found"), { statusCode:404 });
      let attempt = await ensureNotExpired(client,attemptResult.rows[0]);
      if (["submitted","auto_submitted"].includes(attempt.status)) { await client.query("COMMIT"); return this.getResult(studentId,attemptId); }

      if (Array.isArray(answersPayload)) {
        for (const entry of answersPayload) {
          if (!entry) continue;
          const questionId = Number(entry.questionId ?? entry.question_id);
          if (!Number.isInteger(questionId) || questionId <= 0) continue;
          const question = await client.query(`SELECT aq.*,saq.option_order FROM student_assessment_attempt_questions saq JOIN assessment_questions aq ON aq.id=saq.question_id WHERE saq.attempt_id=$1 AND aq.id=$2`, [attemptId,questionId]);
          if (!question.rows[0]) continue;
          const normalized = this.#validateAnswer(question.rows[0], entry.answer, Array.isArray(question.rows[0].option_order) ? question.rows[0].option_order.map(Number) : []);
          await client.query(`INSERT INTO student_assessment_answers (attempt_id,question_id,answer,answered_at,updated_at) VALUES ($1,$2,$3,NOW(),NOW()) ON CONFLICT (attempt_id,question_id) DO UPDATE SET answer=EXCLUDED.answer,answered_at=NOW(),updated_at=NOW()`, [attemptId,questionId,JSON.stringify(normalized)]);
        }
      }

      const questions = await getAttemptQuestions(client, attemptId);
      const requiredIds = questions.filter((q) => q.is_required !== false).map((q) => Number(q.id));
      const answered = await client.query(`SELECT question_id FROM student_assessment_answers WHERE attempt_id=$1`, [attemptId]);
      const answeredIds = new Set(answered.rows.map((r)=>Number(r.question_id)));
      const expired = attempt.status === "expired" || new Date(attempt.expires_at) <= new Date();
      const auto = expired || String(reason).toLowerCase() === "timeout";
      const unanswered = requiredIds.filter((id)=>!answeredIds.has(id));
      if (unanswered.length && !auto) throw Object.assign(new Error(`Answer all required questions before submitting (${unanswered.length} remaining)`), { statusCode:400 });

      const grading = await gradeAttempt(client,attemptId);
      const percentage = grading.totalMarks > 0 ? Number(((grading.score/grading.totalMarks)*100).toFixed(2)) : 0;
      const passed = percentage >= Number(attempt.passing_percentage || PASSING_DEFAULT);
      const status = auto ? "auto_submitted" : "submitted";
      const updated = await client.query(`UPDATE student_assessment_attempts SET status=$1,submitted_at=NOW(),score=$2,total_marks=$3,percentage=$4,passed=$5,updated_at=NOW() WHERE id=$6 RETURNING *`, [status,grading.score,grading.totalMarks,percentage,passed,attemptId]);
      const updatedAttempt = updated.rows[0];
      await client.query(`INSERT INTO activity_submissions (student_id,assessment_id,attempt_id,activity_type,score,total_marks,percentage,status,time_taken_seconds,tab_switch_count,submitted_at,updated_at) VALUES ($1,$2,$3,'assessment',$4,$5,$6,$7,GREATEST(0,FLOOR(EXTRACT(EPOCH FROM (COALESCE($8,NOW())-$9)))::INTEGER),$10,COALESCE($8,NOW()),NOW()) ON CONFLICT (attempt_id) DO UPDATE SET score=EXCLUDED.score,total_marks=EXCLUDED.total_marks,percentage=EXCLUDED.percentage,status=EXCLUDED.status,time_taken_seconds=EXCLUDED.time_taken_seconds,tab_switch_count=EXCLUDED.tab_switch_count,submitted_at=EXCLUDED.submitted_at,updated_at=NOW()`, [studentId,attempt.assessment_id,attemptId,grading.score,grading.totalMarks,percentage,status,updatedAttempt.submitted_at,attempt.started_at,Number(updatedAttempt.tab_switch_count||0)]);
      await client.query(`UPDATE student_drive_progress sdp SET assessment_score=$1,stage_updated_at=NOW() WHERE sdp.id=(SELECT sdp2.id FROM student_drive_progress sdp2 JOIN assessment_assignments aa ON aa.drive_id=sdp2.drive_id WHERE sdp2.student_id=$2 AND aa.assessment_id=$3 ORDER BY sdp2.stage_updated_at DESC LIMIT 1)`, [percentage,studentId,attempt.assessment_id]);
      await client.query("COMMIT");
      return this.getResult(studentId,updatedAttempt.id);
    } catch(error) { await client.query("ROLLBACK"); throw error; } finally { client.release(); }
  }

  async getResult(studentId, attemptIdValue) {
    const attemptId = parseAttemptId(attemptIdValue);
    const result = await pool.query(`SELECT saa.id,saa.assessment_id,saa.attempt_number,saa.status,saa.started_at,saa.expires_at,saa.submitted_at,saa.score,saa.total_marks,saa.percentage,saa.passed,saa.tab_switch_count,a.title,a.type,a.difficulty,a.review_enabled,a.review_available_at,a.due_at FROM student_assessment_attempts saa JOIN assessments a ON a.id=saa.assessment_id WHERE saa.id=$1 AND saa.student_id=$2`, [attemptId,studentId]);
    if(!result.rows[0]) return null;
    const row=result.rows[0];
    return {attemptId:`attempt_${row.id}`,assessmentId:`assess_${row.assessment_id}`,attemptNumber:Number(row.attempt_number),title:row.title,type:row.type,difficulty:row.difficulty,status:row.status,startedAt:row.started_at,expiresAt:row.expires_at,submittedAt:row.submitted_at,score:Number(row.score||0),totalMarks:Number(row.total_marks||0),percentage:Number(row.percentage||0),passed:Boolean(row.passed),tabSwitchCount:Number(row.tab_switch_count||0),reviewEnabled:Boolean(row.review_enabled),reviewAvailableAt:row.review_available_at||row.due_at,reviewAvailable:Boolean(row.review_enabled)&&(!row.review_available_at&&!row.due_at || (row.review_available_at||row.due_at)<=new Date())};
  }

  async getReview(studentId, assessmentIdValue) {
    const assessmentId=parseAssessmentId(assessmentIdValue);
    const attemptResult=await pool.query(`SELECT saa.id,saa.attempt_number,a.title,a.review_enabled,a.review_available_at,a.due_at FROM student_assessment_attempts saa JOIN assessments a ON a.id=saa.assessment_id WHERE saa.assessment_id=$1 AND saa.student_id=$2 AND saa.status IN ('submitted','auto_submitted') ORDER BY saa.attempt_number DESC LIMIT 1`,[assessmentId,studentId]);
    if(!attemptResult.rows[0]) throw Object.assign(new Error("No completed assessment attempt found"),{statusCode:404});
    const attempt=attemptResult.rows[0];
    if(!attempt.review_enabled) throw Object.assign(new Error("Answer review is not enabled for this assessment"),{statusCode:403});
    const gate=attempt.review_available_at||attempt.due_at;
    if(gate&&new Date(gate)>new Date()) throw Object.assign(new Error(`Answer review becomes available at ${new Date(gate).toISOString()}`),{statusCode:403});
    const result=await pool.query(`SELECT saq.question_order,saq.option_order,aq.id,aq.type,aq.question_text,aq.options,aq.correct_option,aq.correct_answer,aq.explanation,aq.marks,sa.answer,sa.is_correct,sa.marks_awarded FROM student_assessment_attempt_questions saq JOIN assessment_questions aq ON aq.id=saq.question_id LEFT JOIN student_assessment_answers sa ON sa.attempt_id=saq.attempt_id AND sa.question_id=saq.question_id WHERE saq.attempt_id=$1 ORDER BY saq.question_order`,[attempt.id]);
    return {assessmentId:`assess_${assessmentId}`,attemptId:`attempt_${attempt.id}`,title:attempt.title,questions:result.rows.map((row)=>({questionId:row.id,order:row.question_order,type:normalizeType(row.type),questionText:row.question_text,options:parseJsonValue(row.options),correctOption:row.correct_option,correctAnswer:parseJsonValue(row.correct_answer),explanation:row.explanation,marks:Number(row.marks||0),answer:parseJsonValue(row.answer),isCorrect:Boolean(row.is_correct),marksAwarded:Number(row.marks_awarded||0)}))};
  }

  async getHistory(studentId) {
    const result=await pool.query(`SELECT saa.id,saa.assessment_id,saa.attempt_number,saa.status,saa.started_at,saa.submitted_at,saa.score,saa.total_marks,saa.percentage,saa.passed,a.title FROM student_assessment_attempts saa JOIN assessments a ON a.id=saa.assessment_id WHERE saa.student_id=$1 ORDER BY COALESCE(saa.submitted_at,saa.started_at) DESC`,[studentId]);
    return result.rows.map((row)=>({attemptId:`attempt_${row.id}`,assessmentId:`assess_${row.assessment_id}`,title:row.title,attemptNumber:Number(row.attempt_number),status:row.status,startedAt:row.started_at,submittedAt:row.submitted_at,score:Number(row.score||0),totalMarks:Number(row.total_marks||0),percentage:Number(row.percentage||0),passed:Boolean(row.passed)}));
  }

  #validateAnswer(question, answer, optionOrder) {
    if (answer === null || answer === undefined) throw Object.assign(new Error("An answer is required"), { statusCode:422 });
    const type=normalizeType(question.type);
    if(type === "MCQ") {
      const options=normalizeOptions(question.options);
      if(answer?.optionId!==undefined) {
        const ids=optionOrder.map((i)=>options[i]?.id).filter(Boolean);
        if(!ids.includes(String(answer.optionId))) throw Object.assign(new Error("Selected option is invalid for this attempt"),{statusCode:422});
        return {optionId:String(answer.optionId)};
      }
      const index=Number(answer?.optionIndex);
      if(!Number.isInteger(index)||index<0||index>=optionOrder.length) throw Object.assign(new Error("Selected option is invalid for this attempt"),{statusCode:422});
      return {optionIndex:index};
    }
    if(type === "TRUE_FALSE") {
      const raw=answer?.value??answer?.answer??answer;
      if(typeof raw === "boolean") return {value:raw};
      const value=String(raw).trim().toLowerCase();
      if(!["true","false"].includes(value)) throw Object.assign(new Error("True/False answer is invalid"),{statusCode:422});
      return {value:value === "true"};
    }
    if(type === "FILL_BLANK") {
      const text=String(answer?.text??answer?.value??answer??"").trim();
      if(!text||text.length>500) throw Object.assign(new Error("Fill-in-the-blank answer must be 1-500 characters"),{statusCode:422});
      return {text};
    }
    if(type === "MATCH") {
      const matches=normalizeMatch(answer);
      if(!Object.keys(matches).length) throw Object.assign(new Error("Match-the-following answer is required"),{statusCode:422});
      return {matches};
    }
    throw Object.assign(new Error(`Unsupported assessment question type: ${question.type}`),{statusCode:422});
  }

  #formatAttempt(attempt,assessment,questionRows) {
    return {attemptId:`attempt_${attempt.id}`,assessmentId:`assess_${assessment.id}`,attemptNumber:Number(attempt.attempt_number),status:attempt.status,startedAt:attempt.started_at,expiresAt:attempt.expires_at,timeLimitMinutes:Number(assessment.time_limit_minutes||0),tabSwitchCount:Number(attempt.tab_switch_count||0),questions:questionRows.map((question,index)=>publicQuestion(question,index+1,Array.isArray(question.option_order)?question.option_order.map(Number):[])),answers:{}};
  }
}

export default new StudentAssessmentService();
