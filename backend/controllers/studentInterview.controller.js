import studentInterviewService from '../services/studentInterview.service.js';

const parseId = (value) => {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    const error = new Error('interviewId must be a positive integer');
    error.statusCode = 400;
    throw error;
  }
  return id;
};

export const listInterviews = async (req, res, next) => {
  try {
    res.json({ success: true, data: await studentInterviewService.listInterviews(req.user) });
  } catch (error) {
    next(error);
  }
};

export const getInterview = async (req, res, next) => {
  try {
    res.json({ success: true, data: await studentInterviewService.getInterview(req.user, parseId(req.params.interviewId)) });
  } catch (error) {
    next(error);
  }
};

export const confirmInterview = async (req, res, next) => {
  try {
    res.json({ success: true, data: await studentInterviewService.confirmInterview(req.user, parseId(req.params.interviewId)) });
  } catch (error) {
    next(error);
  }
};

export const joinInterview = async (req, res, next) => {
  try {
    res.json({ success: true, data: await studentInterviewService.joinInterview(req.user, parseId(req.params.interviewId)) });
  } catch (error) {
    next(error);
  }
};

export default { listInterviews, getInterview, confirmInterview, joinInterview };
