import { pool } from '../../../config/db.js';
import * as service from '../services/companyDashboard.service.js';
import { resolveUserIntId } from '../../../utils/userResolver.js';

// Helper to retrieve company ID for logged-in user
const getCompanyId = async (req) => {
  const userId = req.user.userId;
  const intUserId = await resolveUserIntId(userId);
  if (!intUserId) return null;
  const result = await pool.query('SELECT id FROM companies WHERE user_id = $1', [intUserId]);
  return result.rows[0]?.id || null;
};

export const getStats = async (req, res, next) => {
  try {
    const companyId = await getCompanyId(req);
    if (!companyId) {
      return res.status(403).json({ success: false, error: 'Company profile not found' });
    }

    const data = await service.getDashboardStats(companyId);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getFunnel = async (req, res, next) => {
  try {
    const companyId = await getCompanyId(req);
    if (!companyId) {
      return res.status(403).json({ success: false, error: 'Company profile not found' });
    }

    const data = await service.getDashboardFunnel(companyId);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getCollegeStats = async (req, res, next) => {
  try {
    const companyId = await getCompanyId(req);
    if (!companyId) {
      return res.status(403).json({ success: false, error: 'Company profile not found' });
    }

    const data = await service.getCollegeStats(companyId);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getActivity = async (req, res, next) => {
  try {
    const companyId = await getCompanyId(req);
    if (!companyId) {
      return res.status(403).json({ success: false, error: 'Company profile not found' });
    }

    const data = await service.getRecentActivities(companyId);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
