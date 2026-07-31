import { pool } from '../../../config/db.js';
import * as service from '../services/companyCandidate.service.js';
import { resolveUserIntId } from '../../../utils/userResolver.js';

// Helper to retrieve company ID for logged-in user
const getCompanyId = async (req) => {
  const userId = req.user.userId;
  const intUserId = await resolveUserIntId(userId);
  if (!intUserId) return null;
  const result = await pool.query('SELECT id FROM companies WHERE user_id = $1', [intUserId]);
  return result.rows[0]?.id || null;
};

export const getCandidates = async (req, res, next) => {
  try {
    const companyId = await getCompanyId(req);
    if (!companyId) {
      return res.status(403).json({ success: false, error: 'Company profile not found' });
    }

    const { search, status, college, role, skills, gpa, location, assessmentScore } = req.query;
    const filters = { search, status, college, role, skills, gpa, location, assessmentScore };

    const data = await service.listCandidates(companyId, filters);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getCandidateById = async (req, res, next) => {
  try {
    const companyId = await getCompanyId(req);
    if (!companyId) {
      return res.status(403).json({ success: false, error: 'Company profile not found' });
    }

    const candidateId = parseInt(req.params.id, 10);
    const data = await service.getCandidateById(candidateId, companyId);
    if (!data) {
      return res.status(404).json({ success: false, error: 'Candidate not found' });
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const shortlistCandidate = async (req, res, next) => {
  try {
    const companyId = await getCompanyId(req);
    if (!companyId) {
      return res.status(403).json({ success: false, error: 'Company profile not found' });
    }

    const candidateId = parseInt(req.params.id, 10);
    const updated = await service.shortlistCandidate(candidateId, companyId);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Candidate not found or drive progress missing' });
    }

    return res.status(200).json({ success: true, message: 'Candidate shortlisted successfully' });
  } catch (error) {
    next(error);
  }
};

export const rejectCandidate = async (req, res, next) => {
  try {
    const companyId = await getCompanyId(req);
    if (!companyId) {
      return res.status(403).json({ success: false, error: 'Company profile not found' });
    }

    const candidateId = parseInt(req.params.id, 10);
    const updated = await service.rejectCandidate(candidateId, companyId);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Candidate not found or drive progress missing' });
    }

    return res.status(200).json({ success: true, message: 'Candidate rejected successfully' });
  } catch (error) {
    next(error);
  }
};

export const moveCandidateStage = async (req, res, next) => {
  try {
    const companyId = await getCompanyId(req);
    if (!companyId) {
      return res.status(403).json({ success: false, error: 'Company profile not found' });
    }

    const candidateId = parseInt(req.params.id, 10);
    const { current_stage, stage, notes } = req.body;

    const updated = await service.moveCandidateStage(candidateId, companyId, current_stage, stage, notes);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Candidate not found or drive progress missing' });
    }

    return res.status(200).json({ success: true, message: 'Candidate stage moved successfully' });
  } catch (error) {
    next(error);
  }
};

export const exportCandidates = async (req, res, next) => {
  try {
    const companyId = await getCompanyId(req);
    if (!companyId) {
      return res.status(403).json({ success: false, error: 'Company profile not found' });
    }

    const { search, status, college, role, skills, gpa, location, assessmentScore } = req.query;
    const filters = { search, status, college, role, skills, gpa, location, assessmentScore };

    const candidates = await service.listCandidates(companyId, filters);

    // Generate CSV
    const headers = [
      'Candidate ID', 'Name', 'Email', 'Phone', 'College', 'GPA', 
      'Skills', 'Assessment Score', 'Status', 'Current Stage', 
      'Training Progress (%)', 'Notes', 'Interview Feedback'
    ];

    const escapeCSV = (str) => {
      if (str === null || str === undefined) return '';
      const text = String(str).replace(/"/g, '""');
      return text.includes(',') || text.includes('\n') || text.includes('"') ? `"${text}"` : text;
    };

    const csvRows = [headers.join(',')];

    for (const c of candidates) {
      const skillsStr = Array.isArray(c.skills) ? c.skills.join('; ') : '';
      const row = [
        c.id,
        c.name,
        c.email,
        c.phone,
        c.college,
        c.gpa,
        skillsStr,
        c.score,
        c.status,
        c.current_stage,
        c.trainingProgress,
        c.notes,
        c.feedback
      ];
      csvRows.push(row.map(escapeCSV).join(','));
    }

    const csvString = csvRows.join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=candidates.csv');
    return res.status(200).send(csvString);
  } catch (error) {
    next(error);
  }
};

export const bulkShortlistCandidates = async (req, res, next) => {
  try {
    const companyId = await getCompanyId(req);
    if (!companyId) {
      return res.status(403).json({ success: false, error: 'Company profile not found' });
    }

    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, error: 'Invalid candidate IDs list' });
    }

    const updated = await service.bulkShortlistCandidates(ids, companyId);
    return res.status(200).json({ success: true, message: `${updated.length} candidates shortlisted successfully` });
  } catch (error) {
    next(error);
  }
};

export const bulkRejectCandidates = async (req, res, next) => {
  try {
    const companyId = await getCompanyId(req);
    if (!companyId) {
      return res.status(403).json({ success: false, error: 'Company profile not found' });
    }

    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, error: 'Invalid candidate IDs list' });
    }

    const updated = await service.bulkRejectCandidates(ids, companyId);
    return res.status(200).json({ success: true, message: `${updated.length} candidates rejected successfully` });
  } catch (error) {
    next(error);
  }
};

export const bulkMoveCandidatesStage = async (req, res, next) => {
  try {
    const companyId = await getCompanyId(req);
    if (!companyId) {
      return res.status(403).json({ success: false, error: 'Company profile not found' });
    }

    const { ids, current_stage, stage } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, error: 'Invalid candidate IDs list' });
    }

    const updated = await service.bulkMoveCandidatesStage(ids, companyId, current_stage, stage);
    return res.status(200).json({ success: true, message: `${updated.length} candidates stage updated successfully` });
  } catch (error) {
    next(error);
  }
};
