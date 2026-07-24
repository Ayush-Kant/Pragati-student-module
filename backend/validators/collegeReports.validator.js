import { REPORT_FORMATS, REPORT_TYPES } from '../constants/collegeReportsGeneration.constants.js';

const sanitizeInput = (req, res, next) => {
  for (const source of [req.body, req.query]) {
    if (!source || typeof source !== 'object') continue;
    for (const key of Object.keys(source)) if (typeof source[key] === 'string') source[key] = source[key].trim().replace(/[<>]/g, '');
  }
  next();
};
const isPositiveInteger = (value) => Number.isInteger(Number(value)) && Number(value) > 0;
const validateRequestBody = (req, res, next) => !req.body || Object.keys(req.body).length === 0 ? res.status(400).json({ message: 'Request body cannot be empty' }) : next();
const validateListReports = (req, res, next) => {
  const { page, limit } = req.query;
  if (page && !isPositiveInteger(page)) return res.status(400).json({ message: 'Page must be a positive number' });
  if (limit && !isPositiveInteger(limit)) return res.status(400).json({ message: 'Limit must be a positive number' });
  next();
};
const validateGenerateReport = (req, res, next) => {
  const { title, type, format, content } = req.body;
  if (!title || typeof title !== 'string') return res.status(400).json({ message: 'Report title is required' });
  const normalizedType = typeof type === 'string' ? type.toLowerCase() : '';
  if (!Object.values(REPORT_TYPES).includes(normalizedType)) return res.status(400).json({ message: 'Report type is invalid' });
  if (format && (!['json', ...Object.values(REPORT_FORMATS)].includes(format.toLowerCase()))) return res.status(400).json({ message: 'Report format is invalid' });
  if (content !== undefined && (typeof content !== 'object' || Array.isArray(content))) return res.status(400).json({ message: 'Report content must be an object' });
  req.body.type = normalizedType; if (format) req.body.format = format.toLowerCase(); next();
};
const validateReportId = (req, res, next) => !isPositiveInteger(req.params.id) ? res.status(400).json({ message: 'Invalid report ID' }) : next();
const validateExportRequest = (req, res, next) => {
  const format = req.path.includes('pdf') ? 'pdf' : req.path.includes('excel') ? 'excel' : req.query.format;
  const validTypes = ['dashboard', 'placements', 'companies', 'departments', 'students'];
  if (!format || !['pdf', 'excel'].includes(format.toLowerCase())) return res.status(400).json({ success: false, message: "Invalid export format. Must be 'pdf' or 'excel'." });
  if (req.query.reportType && !validTypes.includes(req.query.reportType.toLowerCase())) return res.status(400).json({ success: false, message: `Invalid reportType. Must be one of: ${validTypes.join(', ')}` });
  next();
};
const validateFilters = (req, res, next) => {
  const { month, year } = req.query;
  if (month && !/^\d{4}-\d{2}$/.test(month)) return res.status(400).json({ success: false, message: 'Invalid month format. Must be YYYY-MM.' });
  if (year && (!Number.isInteger(Number(year)) || Number(year) < 2000 || Number(year) > 2100)) return res.status(400).json({ success: false, message: 'Invalid year. Must be between 2000 and 2100.' });
  next();
};
export { sanitizeInput, validateRequestBody, validateListReports, validateGenerateReport, validateReportId, validateExportRequest, validateFilters };
export default { sanitizeInput, validateRequestBody, validateListReports, validateGenerateReport, validateReportId, validateExportRequest, validateFilters };
