import { pool } from '../../../config/db.js';
import * as service from '../services/companyInterview.service.js';
import { resolveUserIntId } from '../../../utils/userResolver.js';

// Helper to retrieve company ID for logged-in user
const getCompanyId = async (req) => {
  const userId = req.user.userId;
  const intUserId = await resolveUserIntId(userId);
  if (!intUserId) return null;
  const result = await pool.query('SELECT id FROM companies WHERE user_id = $1', [intUserId]);
  return result.rows[0]?.id || null;
};

export const getInterviews = async (req, res, next) => {
  try {
    const companyId = await getCompanyId(req);
    if (!companyId) {
      return res.status(403).json({ success: false, error: 'Company profile not found' });
    }

    const data = await service.listInterviews(companyId);
    return res.status(200).json({ success: true, data, interviews: data });
  } catch (error) {
    next(error);
  }
};

export const getInterviewById = async (req, res, next) => {
  try {
    const companyId = await getCompanyId(req);
    if (!companyId) {
      return res.status(403).json({ success: false, error: 'Company profile not found' });
    }

    const interviewId = parseInt(req.params.id, 10);
    const data = await service.getInterviewById(interviewId, companyId);
    if (!data) {
      return res.status(404).json({ success: false, error: 'Interview not found' });
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const createInterview = async (req, res, next) => {
  try {
    const companyId = await getCompanyId(req);
    if (!companyId) {
      return res.status(403).json({ success: false, error: 'Company profile not found' });
    }

    const interview = await service.scheduleInterview(companyId, req.body);
    return res.status(201).json({
      success: true,
      message: 'Interview scheduled successfully',
      interview
    });
  } catch (error) {
    next(error);
  }
};

export const submitFeedback = async (req, res, next) => {
  try {
    const companyId = await getCompanyId(req);
    if (!companyId) {
      return res.status(403).json({ success: false, error: 'Company profile not found' });
    }

    const interviewId = parseInt(req.params.id, 10);
    const interview = await service.submitFeedback(interviewId, companyId, req.body.feedback);
    if (!interview) {
      return res.status(404).json({ success: false, error: 'Interview not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Feedback submitted successfully',
      interview
    });
  } catch (error) {
    next(error);
  }
};

export const updateResult = async (req, res, next) => {
  try {
    const companyId = await getCompanyId(req);
    if (!companyId) {
      return res.status(403).json({ success: false, error: 'Company profile not found' });
    }

    const interviewId = parseInt(req.params.id, 10);
    const interview = await service.updateResult(interviewId, companyId, req.body.result, req.body.attendance);
    if (!interview) {
      return res.status(404).json({ success: false, error: 'Interview not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Interview result updated successfully',
      interview
    });
  } catch (error) {
    next(error);
  }
};
