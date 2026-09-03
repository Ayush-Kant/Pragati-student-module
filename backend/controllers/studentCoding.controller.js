import studentCodingService from '../services/studentCoding.service.js';
import { resolveStudentId } from '../utils/studentProfileIdentity.js';

const positiveId = (value, field) => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    const error = new Error(`${field} must be a positive integer`);
    error.statusCode = 400;
    throw error;
  }
  return parsed;
};

const codeBody = (body = {}) => {
  if (!body.code || typeof body.code !== 'string' || !body.code.trim()) {
    const error = new Error('Code is required');
    error.statusCode = 400;
    throw error;
  }
  if (!body.language || typeof body.language !== 'string') {
    const error = new Error('Language is required');
    error.statusCode = 400;
    throw error;
  }
  return body;
};

export const listChallenges = async (req, res, next) => {
  try {
    const studentId = await resolveStudentId(req.user);
    res.json({ success: true, data: await studentCodingService.listChallenges(studentId) });
  } catch (error) {
    next(error);
  }
};

export const getChallenge = async (req, res, next) => {
  try {
    const studentId = await resolveStudentId(req.user);
    const challengeId = positiveId(req.params.challengeId, 'challengeId');
    res.json({ success: true, data: await studentCodingService.getChallenge(studentId, challengeId) });
  } catch (error) {
    next(error);
  }
};

export const runCode = async (req, res, next) => {
  try {
    const studentId = await resolveStudentId(req.user);
    const body = codeBody(req.body);
    const challengeId = positiveId(body.challengeId ?? req.params.challengeId, 'challengeId');
    res.json({
      success: true,
      data: await studentCodingService.runCode(studentId, { ...body, challengeId }),
    });
  } catch (error) {
    next(error);
  }
};

export const submitSolution = async (req, res, next) => {
  try {
    const studentId = await resolveStudentId(req.user);
    const body = codeBody(req.body);
    const challengeId = positiveId(body.challengeId ?? req.params.challengeId, 'challengeId');
    res.status(201).json({
      success: true,
      data: await studentCodingService.submitSolution(studentId, { ...body, challengeId }),
    });
  } catch (error) {
    next(error);
  }
};

export const getSubmissionHistory = async (req, res, next) => {
  try {
    const studentId = await resolveStudentId(req.user);
    const challengeId = req.params.challengeId ? positiveId(req.params.challengeId, 'challengeId') : null;
    res.json({ success: true, data: await studentCodingService.getSubmissionHistory(studentId, challengeId) });
  } catch (error) {
    next(error);
  }
};

export const getLeaderboard = async (req, res, next) => {
  try {
    const challengeId = req.params.challengeId ? positiveId(req.params.challengeId, 'challengeId') : null;
    res.json({ success: true, data: await studentCodingService.getLeaderboard(challengeId) });
  } catch (error) {
    next(error);
  }
};
