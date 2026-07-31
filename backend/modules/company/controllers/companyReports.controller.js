import { pool } from '../../../config/db.js';
import * as service from '../services/companyReports.service.js';
import { resolveUserIntId } from '../../../utils/userResolver.js';

// Helper to retrieve company ID for logged-in user
const getCompanyId = async (req) => {
  const userId = req.user.userId;
  const intUserId = await resolveUserIntId(userId);
  if (!intUserId) return null;
  const result = await pool.query('SELECT id FROM companies WHERE user_id = $1', [intUserId]);
  return result.rows[0]?.id || null;
};

export const getKPIs = async (req, res, next) => {
  try {
    const companyId = await getCompanyId(req);
    if (!companyId) {
      return res.status(403).json({ success: false, error: 'Company profile not found' });
    }

    const data = await service.getReportsKPIs(companyId);
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

    const data = await service.getReportsFunnel(companyId);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getTrends = async (req, res, next) => {
  try {
    const companyId = await getCompanyId(req);
    if (!companyId) {
      return res.status(403).json({ success: false, error: 'Company profile not found' });
    }

    const data = await service.getReportsTrends(companyId);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getCollegePerformance = async (req, res, next) => {
  try {
    const companyId = await getCompanyId(req);
    if (!companyId) {
      return res.status(403).json({ success: false, error: 'Company profile not found' });
    }

    const data = await service.getCollegePerformance(companyId);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const exportPerformanceReport = async (req, res, next) => {
  try {
    const companyId = await getCompanyId(req);
    if (!companyId) {
      return res.status(403).json({ success: false, error: 'Company profile not found' });
    }

    const rows = await service.getCollegePerformance(companyId);

    // Generate CSV
    const headers = ['College', 'Applied', 'Screened', 'Trained', 'Shortlisted', 'Selected', 'Success Rate (%)'];
    
    const escapeCSV = (str) => {
      if (str === null || str === undefined) return '';
      const text = String(str).replace(/"/g, '""');
      return text.includes(',') || text.includes('\n') || text.includes('"') ? `"${text}"` : text;
    };

    const csvRows = [headers.join(',')];

    for (const r of rows) {
      csvRows.push([
        escapeCSV(r.college),
        r.applied,
        r.screened,
        r.trained,
        r.shortlisted,
        r.selected,
        r.rate
      ].join(','));
    }

    const csvString = csvRows.join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=college_performance_report.csv');
    return res.status(200).send(csvString);
  } catch (error) {
    next(error);
  }
};
