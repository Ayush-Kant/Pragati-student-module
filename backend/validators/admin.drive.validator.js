// admin.drive.validator.js

const VALID_STAGES = [
  'application', 'screening', 'training', 'shortlist', 'interviews', 'selection'
];

export const validateCreateDrive = (req, res, next) => {
  const { title, companyId, criteria } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Drive title is required.' });
  }
  if (!companyId) {
    return res.status(400).json({ error: 'companyId is required.' });
  }
  if (!criteria?.maxOpenings || criteria.maxOpenings < 1) {
    return res.status(400).json({ error: 'maxOpenings must be a positive integer.' });
  }
  next();
};

export const validateMoveCandidate = (req, res, next) => {
  const { studentId, stage } = req.body;

  if (!studentId) {
    return res.status(400).json({ error: 'studentId is required.' });
  }
  if (!stage || !VALID_STAGES.includes(stage)) {
    return res.status(400).json({ error: `stage must be one of: ${VALID_STAGES.join(', ')}.` });
  }
  next();
};

export const validateShortlist = (req, res, next) => {
  const { criteria } = req.body;

  if (!criteria?.topN || criteria.topN < 1) {
    return res.status(400).json({ error: 'criteria.topN is required and must be > 0.' });
  }
  next();
};

export const validateAssignTest = (req, res, next) => {
  if (!req.body.assessmentId) {
    return res.status(400).json({ error: 'assessmentId is required.' });
  }
  next();
};

export const validateAssignCourse = (req, res, next) => {
  if (!req.body.courseId) {
    return res.status(400).json({ error: 'courseId is required.' });
  }
  next();
};
