import { EXPORT_STATUSES, REPORT_FORMATS } from '../constants/collegeReportsGeneration.constants.js';

const normalizeExportFormat = (value) => {
  const normalized = typeof value === 'string' ? value.toLowerCase() : '';
  return Object.values(REPORT_FORMATS).includes(normalized) ? normalized : REPORT_FORMATS.PDF;
};
const normalizeExportStatus = (value) => {
  const normalized = typeof value === 'string' ? value.toLowerCase() : '';
  return Object.values(EXPORT_STATUSES).includes(normalized) ? normalized : EXPORT_STATUSES.COMPLETED;
};
const buildExportPayload = ({ reportId, format, status = EXPORT_STATUSES.COMPLETED } = {}) => ({ reportId: reportId || null, format: normalizeExportFormat(format), status: normalizeExportStatus(status) });
const buildExportResponse = (record = {}) => ({ id: record.id || null, reportId: record.reportId || record.report_id || null, format: normalizeExportFormat(record.format), status: normalizeExportStatus(record.status), createdAt: record.createdAt || record.created_at || null });

const escapeHtml = (value) => String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const convertToCSV = (data, headers, labels = []) => {
  if (!Array.isArray(data)) return '';
  const row = (values) => values.map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`).join(',');
  return [row(labels.length ? labels : headers), ...data.map((item) => row(headers.map((key) => item[key])))].join('\n');
};
const convertToHTMLReport = (data = [], title, headers, labels = []) => {
  const headerLabels = labels.length ? labels : headers;
  const headerHtml = headerLabels.map((label) => `<th>${escapeHtml(label)}</th>`).join('');
  const rowsHtml = data.map((item) => `<tr>${headers.map((key) => `<td>${escapeHtml(item[key] ?? '-')}</td>`).join('')}</tr>`).join('');
  return `<!DOCTYPE html><html><head><title>${escapeHtml(title)}</title><style>body{font-family:Arial,sans-serif;margin:40px;color:#333}h1{color:#4CAF50}table{width:100%;border-collapse:collapse;margin-top:20px}th,td{border:1px solid #ddd;padding:12px;text-align:left}th{background:#4CAF50;color:white}.footer{margin-top:30px;font-size:12px;color:#777}</style></head><body><h1>${escapeHtml(title)}</h1><p>Report Generated on: ${new Date().toLocaleString()}</p><table><thead><tr>${headerHtml}</tr></thead><tbody>${rowsHtml}</tbody></table><div class="footer">Pragati Placement &amp; Training Management System - Confidential</div></body></html>`;
};

export { buildExportPayload, buildExportResponse, convertToCSV, convertToHTMLReport };
export default { buildExportPayload, buildExportResponse, convertToCSV, convertToHTMLReport };
