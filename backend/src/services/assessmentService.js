import {
  Assessment,
  AssessmentQuestion,
  AssessmentOption,
  AssessmentAttempt,
  AssessmentAnswer,
  AssessmentResult,
  sequelize,
} from "../models/index.js";

import { ATTEMPT_STATUS, ASSESSMENT_STATUS, MESSAGES } from "../constants/assessmentConstants.js";

import {
  evaluateAnswer,
  buildResultSummary,
  sanitizeQuestionsForStudent,
} from "../utils/assessmentHelpers.js";

/**
 * Custom error carrying an HTTP-friendly status code so the controller
 * layer (and the project's global errorMiddleware) can translate it
 * directly into a response.
 */
export class ServiceError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

/**
 * Retrieve all published assessments available to students.
 */
export const getAvailableAssessments = async () => {
  const assessments = await Assessment.findAll({
    where: { status: ASSESSMENT_STATUS.PUBLISHED },
    attributes: ["id", "title", "description", "durationMinutes", "totalMarks", "passPercentage"],
    order: [["createdAt", "DESC"]],
  });
  return assessments;
};

/**
 * Retrieve a single assessment with its questions and options
 * (answers hidden), for a student to preview/take.
 */
export const getAssessmentDetails = async (assessmentId) => {
  const assessment = await Assessment.findOne({
    where: { id: assessmentId, status: ASSESSMENT_STATUS.PUBLISHED },
    include: [
      {
        model: AssessmentQuestion,
        as: "questions",
        include: [{ model: AssessmentOption, as: "options" }],
        separate: true,
        order: [["orderIndex", "ASC"]],
      },
    ],
  });

  if (!assessment) {
    throw new ServiceError(404, MESSAGES.ASSESSMENT_NOT_FOUND);
  }

  const plain = assessment.toJSON();
  plain.questions = sanitizeQuestionsForStudent(plain.questions);
  return plain;
};

/**
 * Start a new attempt for an assessment. Reuses an existing in-progress
 * attempt if one already exists, so refreshing the page doesn't create
 * duplicate attempts.
 */
export const startAssessment = async (assessmentId, studentId) => {
  const assessment = await Assessment.findOne({
    where: { id: assessmentId, status: ASSESSMENT_STATUS.PUBLISHED },
  });

  if (!assessment) {
    throw new ServiceError(404, MESSAGES.ASSESSMENT_NOT_FOUND);
  }

  const existingAttempt = await AssessmentAttempt.findOne({
    where: {
      assessmentId,
      studentId,
      status: ATTEMPT_STATUS.IN_PROGRESS,
    },
  });

  if (existingAttempt) {
    return existingAttempt;
  }

  const expiresAt = new Date(Date.now() + assessment.durationMinutes * 60 * 1000);

  const attempt = await AssessmentAttempt.create({
    assessmentId,
    studentId,
    status: ATTEMPT_STATUS.IN_PROGRESS,
    startedAt: new Date(),
    expiresAt,
  });

  return attempt;
};

/**
 * Submit answers for an attempt: validates ownership/state, scores each
 * answer, persists answers, and generates the final result record.
 */
export const submitAssessment = async (assessmentId, studentId, { attemptId, answers }) => {
  return sequelize.transaction(async (t) => {
    const attempt = await AssessmentAttempt.findOne({
      where: { id: attemptId, assessmentId, studentId },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!attempt) {
      throw new ServiceError(404, MESSAGES.ATTEMPT_NOT_FOUND);
    }

    if (attempt.status === ATTEMPT_STATUS.SUBMITTED) {
      throw new ServiceError(409, MESSAGES.ATTEMPT_ALREADY_SUBMITTED);
    }

    const assessment = await Assessment.findByPk(assessmentId, { transaction: t });
    if (!assessment) {
      throw new ServiceError(404, MESSAGES.ASSESSMENT_NOT_FOUND);
    }

    const questions = await AssessmentQuestion.findAll({
      where: { assessmentId },
      include: [{ model: AssessmentOption, as: "options" }],
      transaction: t,
    });

    const questionMap = new Map(questions.map((q) => [q.id, q]));

    const evaluatedAnswers = [];
    for (const submitted of answers) {
      const question = questionMap.get(submitted.questionId);
      if (!question) {
        // Ignore answers for question ids that don't belong to this assessment.
        continue;
      }
      const { isCorrect, marksAwarded } = evaluateAnswer(question, submitted.selectedOptionIds);
      evaluatedAnswers.push({
        attemptId: attempt.id,
        questionId: question.id,
        selectedOptionIds: submitted.selectedOptionIds,
        isCorrect,
        marksAwarded,
      });
    }

    await AssessmentAnswer.bulkCreate(evaluatedAnswers, { transaction: t });

    const summary = buildResultSummary({
      questions,
      evaluatedAnswers,
      passPercentage: assessment.passPercentage,
    });

    const result = await AssessmentResult.create(
      {
        attemptId: attempt.id,
        assessmentId,
        studentId,
        ...summary,
      },
      { transaction: t }
    );

    attempt.status = ATTEMPT_STATUS.SUBMITTED;
    attempt.submittedAt = new Date();
    await attempt.save({ transaction: t });

    return result;
  });
};

/**
 * Retrieve the result for a given assessment for the current student
 * (most recent submitted attempt).
 */
export const getAssessmentResult = async (assessmentId, studentId) => {
  const result = await AssessmentResult.findOne({
    where: { assessmentId, studentId },
    order: [["createdAt", "DESC"]],
    include: [
      { model: Assessment, as: "assessment", attributes: ["title", "totalMarks", "passPercentage"] },
    ],
  });

  if (!result) {
    throw new ServiceError(404, MESSAGES.RESULT_NOT_FOUND);
  }

  return result;
};

/**
 * Retrieve paginated assessment history (all submitted attempts) for a student.
 */
export const getAssessmentHistory = async (studentId, { page = 1, limit = 10 }) => {
  const offset = (page - 1) * limit;

  const { rows, count } = await AssessmentAttempt.findAndCountAll({
    where: { studentId, status: ATTEMPT_STATUS.SUBMITTED },
    include: [
      { model: Assessment, as: "assessment", attributes: ["id", "title", "totalMarks"] },
      { model: AssessmentResult, as: "result" },
    ],
    order: [["submittedAt", "DESC"]],
    limit,
    offset,
  });

  return {
    attempts: rows,
    pagination: {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    },
  };
};
import {
  Assessment,
  AssessmentQuestion,
  AssessmentOption,
  AssessmentAttempt,
  AssessmentAnswer,
  AssessmentResult,
  sequelize,
} from "../models/index.js";

import { ATTEMPT_STATUS, ASSESSMENT_STATUS, MESSAGES } from "../constants/assessmentConstants.js";

import {
  evaluateAnswer,
  buildResultSummary,
  sanitizeQuestionsForStudent,
} from "../utils/assessmentHelpers.js";

/**
 * Custom error carrying an HTTP-friendly status code so the controller
 * layer (and the project's global errorMiddleware) can translate it
 * directly into a response.
 */
export class ServiceError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

/**
 * Retrieve all published assessments available to students.
 */
export const getAvailableAssessments = async () => {
  const assessments = await Assessment.findAll({
    where: { status: ASSESSMENT_STATUS.PUBLISHED },
    attributes: ["id", "title", "description", "durationMinutes", "totalMarks", "passPercentage"],
    order: [["createdAt", "DESC"]],
  });
  return assessments;
};

/**
 * Retrieve a single assessment with its questions and options
 * (answers hidden), for a student to preview/take.
 */
export const getAssessmentDetails = async (assessmentId) => {
  const assessment = await Assessment.findOne({
    where: { id: assessmentId, status: ASSESSMENT_STATUS.PUBLISHED },
    include: [
      {
        model: AssessmentQuestion,
        as: "questions",
        include: [{ model: AssessmentOption, as: "options" }],
        separate: true,
        order: [["orderIndex", "ASC"]],
      },
    ],
  });

  if (!assessment) {
    throw new ServiceError(404, MESSAGES.ASSESSMENT_NOT_FOUND);
  }

  const plain = assessment.toJSON();
  plain.questions = sanitizeQuestionsForStudent(plain.questions);
  return plain;
};

/**
 * Start a new attempt for an assessment. Reuses an existing in-progress
 * attempt if one already exists, so refreshing the page doesn't create
 * duplicate attempts.
 */
export const startAssessment = async (assessmentId, studentId) => {
  const assessment = await Assessment.findOne({
    where: { id: assessmentId, status: ASSESSMENT_STATUS.PUBLISHED },
  });

  if (!assessment) {
    throw new ServiceError(404, MESSAGES.ASSESSMENT_NOT_FOUND);
  }

  const existingAttempt = await AssessmentAttempt.findOne({
    where: {
      assessmentId,
      studentId,
      status: ATTEMPT_STATUS.IN_PROGRESS,
    },
  });

  if (existingAttempt) {
    return existingAttempt;
  }

  const expiresAt = new Date(Date.now() + assessment.durationMinutes * 60 * 1000);

  const attempt = await AssessmentAttempt.create({
    assessmentId,
    studentId,
    status: ATTEMPT_STATUS.IN_PROGRESS,
    startedAt: new Date(),
    expiresAt,
  });

  return attempt;
};

/**
 * Submit answers for an attempt: validates ownership/state, scores each
 * answer, persists answers, and generates the final result record.
 */
export const submitAssessment = async (assessmentId, studentId, { attemptId, answers }) => {
  return sequelize.transaction(async (t) => {
    const attempt = await AssessmentAttempt.findOne({
      where: { id: attemptId, assessmentId, studentId },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!attempt) {
      throw new ServiceError(404, MESSAGES.ATTEMPT_NOT_FOUND);
    }

    if (attempt.status === ATTEMPT_STATUS.SUBMITTED) {
      throw new ServiceError(409, MESSAGES.ATTEMPT_ALREADY_SUBMITTED);
    }

    const assessment = await Assessment.findByPk(assessmentId, { transaction: t });
    if (!assessment) {
      throw new ServiceError(404, MESSAGES.ASSESSMENT_NOT_FOUND);
    }

    const questions = await AssessmentQuestion.findAll({
      where: { assessmentId },
      include: [{ model: AssessmentOption, as: "options" }],
      transaction: t,
    });

    const questionMap = new Map(questions.map((q) => [q.id, q]));

    const evaluatedAnswers = [];
    for (const submitted of answers) {
      const question = questionMap.get(submitted.questionId);
      if (!question) {
        // Ignore answers for question ids that don't belong to this assessment.
        continue;
      }
      const { isCorrect, marksAwarded } = evaluateAnswer(question, submitted.selectedOptionIds);
      evaluatedAnswers.push({
        attemptId: attempt.id,
        questionId: question.id,
        selectedOptionIds: submitted.selectedOptionIds,
        isCorrect,
        marksAwarded,
      });
    }

    await AssessmentAnswer.bulkCreate(evaluatedAnswers, { transaction: t });

    const summary = buildResultSummary({
      questions,
      evaluatedAnswers,
      passPercentage: assessment.passPercentage,
    });

    const result = await AssessmentResult.create(
      {
        attemptId: attempt.id,
        assessmentId,
        studentId,
        ...summary,
      },
      { transaction: t }
    );

    attempt.status = ATTEMPT_STATUS.SUBMITTED;
    attempt.submittedAt = new Date();
    await attempt.save({ transaction: t });

    return result;
  });
};

/**
 * Retrieve the result for a given assessment for the current student
 * (most recent submitted attempt).
 */
export const getAssessmentResult = async (assessmentId, studentId) => {
  const result = await AssessmentResult.findOne({
    where: { assessmentId, studentId },
    order: [["createdAt", "DESC"]],
    include: [
      { model: Assessment, as: "assessment", attributes: ["title", "totalMarks", "passPercentage"] },
    ],
  });

  if (!result) {
    throw new ServiceError(404, MESSAGES.RESULT_NOT_FOUND);
  }

  return result;
};

/**
 * Retrieve paginated assessment history (all submitted attempts) for a student.
 */
export const getAssessmentHistory = async (studentId, { page = 1, limit = 10 }) => {
  const offset = (page - 1) * limit;

  const { rows, count } = await AssessmentAttempt.findAndCountAll({
    where: { studentId, status: ATTEMPT_STATUS.SUBMITTED },
    include: [
      { model: Assessment, as: "assessment", attributes: ["id", "title", "totalMarks"] },
      { model: AssessmentResult, as: "result" },
    ],
    order: [["submittedAt", "DESC"]],
    limit,
    offset,
  });

  return {
    attempts: rows,
    pagination: {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    },
  };
};
