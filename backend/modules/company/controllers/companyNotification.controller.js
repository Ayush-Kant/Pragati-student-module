import { pool } from '../../../config/db.js';
import { resolveUserIntId } from '../../../utils/userResolver.js';
import * as service from '../services/companyNotification.service.js';

// Helper to retrieve company ID for logged-in user
const getCompanyIdAndUser = async (req) => {
  const userId = req.user.userId;
  const intUserId = await resolveUserIntId(userId);
  if (!intUserId) return { companyId: null, intUserId: null };
  const result = await pool.query('SELECT id FROM companies WHERE user_id = $1', [intUserId]);
  return { companyId: result.rows[0]?.id || null, intUserId };
};

export const getNotifications = async (req, res, next) => {
  try {
    const { companyId, intUserId } = await getCompanyIdAndUser(req);
    if (!companyId) {
      return res.status(403).json({ success: false, error: 'Company profile not found' });
    }

    const data = await service.listNotifications(intUserId);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const sendNotification = async (req, res, next) => {
  try {
    const { companyId, intUserId } = await getCompanyIdAndUser(req);
    if (!companyId) {
      return res.status(403).json({ success: false, error: 'Company profile not found' });
    }

    const result = await service.sendNotification(companyId, intUserId, req.body);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const scheduleNotification = async (req, res, next) => {
  try {
    const { companyId, intUserId } = await getCompanyIdAndUser(req);
    if (!companyId) {
      return res.status(403).json({ success: false, error: 'Company profile not found' });
    }

    const result = await service.scheduleNotification(companyId, intUserId, req.body);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
