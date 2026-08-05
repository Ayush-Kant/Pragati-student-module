import {
  Assessment,
  AssessmentQuestion,
  AssessmentAttempt,
  AssessmentAnswer,
  AssessmentResult,
} from "../models/index.js";

import { sequelize } from "../../config/sequelize.js";

import {
  ATTEMPT_STATUS,
  MESSAGES,
  DEFAULT_PASS_PERCENTAGE,
} from "../constants/assessmentConstants.js";

import {
  evaluateAnswer,
  buildResultSummary,
  sanitizeQuestionsForStudent,
} from "../utils/assessmentHelpers.js";

export class ServiceError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const getAvailableAssessments = async () => {
  return Assessment.findAll({
    where: {
      status: "active",
    },
    attributes: [
      "id",
      "title",
      "type",
      "difficulty",
      "timeLimitMinutes",
      "totalMarks",
    ],
    order: [["createdAt", "DESC"]],
  });
};

export const getAssessmentDetails = async (assessmentId) => {
  const assessment = await Assessment.findOne({
    where: {
      id: assessmentId,
      status: "active",
    },
    include: [
      {
        model: AssessmentQuestion,
        as: "questions",
        separate: true,
        order: [["id", "ASC"]],
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

export const startAssessment = async (assessmentId, studentId) => {
  const assessment = await Assessment.findOne({
    where: {
      id: assessmentId,
      status: "active",
    },
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

  const expiresAt = new Date(
    Date.now() + assessment.timeLimitMinutes * 60 * 1000
  );

  return AssessmentAttempt.create({
    assessmentId,
    studentId,
    status: ATTEMPT_STATUS.IN_PROGRESS,
    startedAt: new Date(),
    expiresAt,
  });
};

export const submitAssessment = async (
  assessmentId,
  studentId,
  { attemptId, answers }
) => {
  return sequelize.transaction(async (t) => {
    const attempt = await AssessmentAttempt.findOne({
      where: {
        id: attemptId,
        assessmentId,
        studentId,
      },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!attempt) {
      throw new ServiceError(404, MESSAGES.ATTEMPT_NOT_FOUND);
    }

    if (attempt.status === ATTEMPT_STATUS.SUBMITTED) {
      throw new ServiceError(
        409,
        MESSAGES.ATTEMPT_ALREADY_SUBMITTED
      );
    }

    const assessment = await Assessment.findByPk(assessmentId, {
      transaction: t,
    });

    if (!assessment) {
      throw new ServiceError(404, MESSAGES.ASSESSMENT_NOT_FOUND);
    }

    const questions = await AssessmentQuestion.findAll({
      where: {
        assessmentId,
      },
      transaction: t,
    });

    const questionMap = new Map(
      questions.map((question) => [question.id, question])
    );

    const evaluatedAnswers = [];

    for (const submitted of answers) {
      const question = questionMap.get(submitted.questionId);

      if (!question) {
        continue;
      }

      const { isCorrect, marksAwarded } = evaluateAnswer(
        question,
        submitted.selectedOption
      );

      evaluatedAnswers.push({
        attemptId: attempt.id,
        questionId: question.id,
        selectedOption: submitted.selectedOption,
        isCorrect,
        marksAwarded,
      });
    }

    await AssessmentAnswer.bulkCreate(evaluatedAnswers, {
      transaction: t,
    });

    const summary = buildResultSummary({
      questions,
      evaluatedAnswers,
      passPercentage:
        assessment.passPercentage ?? DEFAULT_PASS_PERCENTAGE,
    });

    const result = await AssessmentResult.create(
      {
        attemptId: attempt.id,
        assessmentId,
        studentId,
        ...summary,
      },
      {
        transaction: t,
      }
    );

    attempt.status = ATTEMPT_STATUS.SUBMITTED;
    attempt.submittedAt = new Date();

    await attempt.save({
      transaction: t,
    });

    return result;
  });
};

export const getAssessmentResult = async (
  assessmentId,
  studentId
) => {
  const result = await AssessmentResult.findOne({
    where: {
      assessmentId,
      studentId,
    },
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: Assessment,
        as: "assessment",
        attributes: ["title", "totalMarks"],
      },
    ],
  });

  if (!result) {
    throw new ServiceError(404, MESSAGES.RESULT_NOT_FOUND);
  }

  return result;
};

export const getAssessmentHistory = async (
  studentId,
  { page = 1, limit = 10 }
) => {
  const offset = (page - 1) * limit;

  const { rows, count } = await AssessmentAttempt.findAndCountAll({
    where: {
      studentId,
      status: ATTEMPT_STATUS.SUBMITTED,
    },
    include: [
      {
        model: Assessment,
        as: "assessment",
        attributes: ["id", "title", "totalMarks"],
      },
      {
        model: AssessmentResult,
        as: "result",
      },
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