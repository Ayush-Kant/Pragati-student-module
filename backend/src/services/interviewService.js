import Interview from "../models/interviewModel.js";
import InterviewRound from "../models/interviewRoundModel.js";
import connectDB from "../../config/db.js";
import { getApplicationById } from "./applicationService.js";
import { isValidInterviewTransition } from "../utils/placementHelpers.js";
import { ERROR_CODES } from "../constants/placementConstants.js";

const mockInterviews = [];
let mockIdCounter = 1;

const isDbAvailable = () => {
  try {
    return Boolean(connectDB.sequelize && Interview.sequelize);
  } catch {
    return false;
  }
};

export const getInterviews = async (studentId, filters = {}) => {
  if (isDbAvailable()) {
    const whereClause = { studentId };
    if (filters.status) whereClause.status = filters.status;
    const interviews = await Interview.findAll({
      where: whereClause,
      order: [["date_time", "ASC"]],
    });
    return interviews.map((i) => (i.toJSON ? i.toJSON() : i));
  }

  return mockInterviews.filter(
    (i) => i.studentId === studentId && (!filters.status || i.status === filters.status)
  );
};

export const getInterviewById = async (studentId, interviewId) => {
  const intId = Number(interviewId);

  if (isDbAvailable()) {
    const interview = await Interview.findOne({
      where: { id: intId, studentId },
    });
    if (!interview) {
      const error = new Error("Interview not found or access denied");
      error.status = 404;
      error.code = ERROR_CODES.RESOURCE_NOT_FOUND;
      throw error;
    }
    return interview.toJSON ? interview.toJSON() : interview;
  }

  const interview = mockInterviews.find((i) => i.id === intId && i.studentId === studentId);
  if (!interview) {
    const error = new Error("Interview not found or access denied");
    error.status = 404;
    error.code = ERROR_CODES.RESOURCE_NOT_FOUND;
    throw error;
  }
  return interview;
};

export const createInterview = async (studentId, data) => {
  const { companyName, jobTitle, applicationId, dateTime, location, type, rounds } = data;

  if (applicationId) {
    await getApplicationById(studentId, applicationId);
  }

  const defaultRounds = rounds || [
    { roundName: "Technical Round 1", roundOrder: 1, status: "SCHEDULED" },
  ];

  if (isDbAvailable()) {
    const transaction = await connectDB.sequelize.transaction();
    try {
      const interview = await Interview.create(
        {
          studentId,
          applicationId: applicationId || null,
          companyName: companyName.trim(),
          jobTitle: jobTitle ? jobTitle.trim() : null,
          dateTime: new Date(dateTime),
          location: location || "Online",
          type: type || "TECHNICAL",
          status: "SCHEDULED",
        },
        { transaction }
      );

      for (const round of defaultRounds) {
        await InterviewRound.create(
          {
            interviewId: interview.id,
            roundName: round.roundName,
            roundOrder: round.roundOrder || 1,
            status: round.status || "SCHEDULED",
            scheduledAt: new Date(dateTime),
          },
          { transaction }
        );
      }

      await transaction.commit();
      return interview.toJSON ? interview.toJSON() : interview;
    } catch (err) {
      if (transaction && !transaction.finished) {
        await transaction.rollback();
      }
      throw err;
    }
  }

  const newInterview = {
    id: mockIdCounter++,
    studentId,
    applicationId: applicationId || null,
    companyName: companyName.trim(),
    jobTitle: jobTitle ? jobTitle.trim() : null,
    dateTime: new Date(dateTime).toISOString(),
    location: location || "Online",
    type: type || "TECHNICAL",
    status: "SCHEDULED",
    feedback: "",
    score: null,
    rounds: defaultRounds.map((r, index) => ({
      id: index + 1,
      roundName: r.roundName,
      roundOrder: r.roundOrder || index + 1,
      status: r.status || "SCHEDULED",
    })),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  mockInterviews.push(newInterview);
  return newInterview;
};

export const updateInterview = async (studentId, interviewId, data) => {
  const intId = Number(interviewId);

  if (isDbAvailable()) {
    const transaction = await connectDB.sequelize.transaction();
    try {
      const dbInterview = await Interview.findOne({
        where: { id: intId, studentId },
        transaction,
        lock: transaction.LOCK ? transaction.LOCK.UPDATE : undefined,
      });

      if (!dbInterview) {
        const error = new Error("Interview not found or access denied");
        error.status = 404;
        error.code = ERROR_CODES.RESOURCE_NOT_FOUND;
        throw error;
      }

      if (data.status && !isValidInterviewTransition(dbInterview.status, data.status)) {
        const error = new Error(
          `Invalid interview status transition from ${dbInterview.status} to ${data.status}`
        );
        error.status = 400;
        error.code = ERROR_CODES.INVALID_STATUS_TRANSITION;
        throw error;
      }

      if (data.status) dbInterview.status = data.status;
      if (data.feedback !== undefined) dbInterview.feedback = data.feedback;
      if (data.score !== undefined) dbInterview.score = data.score;
      if (data.dateTime) dbInterview.dateTime = new Date(data.dateTime);
      if (data.location) dbInterview.location = data.location;

      await dbInterview.save({ transaction });
      await transaction.commit();
      return dbInterview.toJSON ? dbInterview.toJSON() : dbInterview;
    } catch (err) {
      if (transaction && !transaction.finished) {
        await transaction.rollback();
      }
      throw err;
    }
  }

  const interview = await getInterviewById(studentId, interviewId);

  if (data.status && !isValidInterviewTransition(interview.status, data.status)) {
    const error = new Error(
      `Invalid interview status transition from ${interview.status} to ${data.status}`
    );
    error.status = 400;
    error.code = ERROR_CODES.INVALID_STATUS_TRANSITION;
    throw error;
  }

  if (data.status) interview.status = data.status;
  if (data.feedback !== undefined) interview.feedback = data.feedback;
  if (data.score !== undefined) interview.score = data.score;
  if (data.dateTime) interview.dateTime = new Date(data.dateTime).toISOString();
  if (data.location) interview.location = data.location;
  interview.updatedAt = new Date().toISOString();

  return interview;
};

export default {
  getInterviews,
  getInterviewById,
  createInterview,
  updateInterview,
};
