import {
  REPORT_FORMATS,
  REPORT_STATUSES,
  REPORT_TYPES,
} from '../constants/collegeReportsGeneration.constants.js';

const deptPresets = {
  CSE: { rate: '94%', avg: '10.5 LPA', max: '44 LPA', reg: 180, placed: 169, prefix: 'CSE' },
  ECE: { rate: '86%', avg: '7.8 LPA', max: '28 LPA', reg: 140, placed: 120, prefix: 'ECE' },
  ME: { rate: '72%', avg: '6.2 LPA', max: '18 LPA', reg: 120, placed: 86, prefix: 'ME' },
  CE: { rate: '68%', avg: '5.8 LPA', max: '14 LPA', reg: 90, placed: 61, prefix: 'CE' },
  MBA: { rate: '82%', avg: '8.4 LPA', max: '22 LPA', reg: 80, placed: 65, prefix: 'MBA' },
};

const sampleStudents = [
  { name: 'Aarav Sharma', csePkg: '24 LPA', ecePkg: '12 LPA', mePkg: '8 LPA', company: 'Google' },
  { name: 'Kunal Shah', csePkg: '22 LPA', ecePkg: '10 LPA', mePkg: '7.5 LPA', company: 'Microsoft' },
  { name: 'Riya Sen', csePkg: '16 LPA', ecePkg: '8.5 LPA', mePkg: '6 LPA', company: 'Amazon' },
  { name: 'Priya Nair', csePkg: '14 LPA', ecePkg: '8 LPA', mePkg: '6.5 LPA', company: 'Infosys' },
  { name: 'Aditya Verma', csePkg: '12 LPA', ecePkg: '7.5 LPA', mePkg: '5.8 LPA', company: 'Wipro' },
  { name: 'Sneha Patel', csePkg: '9.5 LPA', ecePkg: '6.8 LPA', mePkg: '5.2 LPA', company: 'TCS' },
  { name: 'Rohan Gupta', csePkg: '8.4 LPA', ecePkg: '6.2 LPA', mePkg: '4.8 LPA', company: 'Cognizant' },
  { name: 'Ananya Roy', csePkg: '7.8 LPA', ecePkg: '5.5 LPA', mePkg: '4.5 LPA', company: 'Accenture' },
];

export const buildDynamicReportContent = (inputContent = {}, type = 'placement', title = '') => {
  const content = typeof inputContent === 'string' ? JSON.parse(inputContent || '{}') : { ...inputContent };

  const dept = content.department || 'CSE';
  const comp = content.company || 'All Companies';
  const batch = content.batch || '2026';
  const yrSuffix = batch.length >= 2 ? batch.slice(-2) : '26';

  const preset = deptPresets[dept] || deptPresets.CSE;
  const prefix = preset.prefix;

  // Filter or build summary
  const summary = content.summary || {
    totalRegistered: preset.reg,
    totalPlaced: preset.placed,
    placementRate: preset.rate,
    averagePackage: preset.avg,
    highestPackage: preset.max,
  };

  const filtersApplied = content.filtersApplied || {
    department: dept,
    company: comp,
    batch,
  };

  // Build parameter-specific student records if empty
  const records = (Array.isArray(content.records) && content.records.length > 0)
    ? content.records
    : sampleStudents.map((s, idx) => {
        const pkg = dept === 'CSE' ? s.csePkg : (dept === 'ECE' ? s.ecePkg : s.mePkg);
        const targetComp = comp !== 'All Companies' ? comp : s.company;
        return {
          sNo: idx + 1,
          rollNo: `${prefix}${yrSuffix}${String(idx + 1).padStart(2, '0')}`,
          studentName: s.name,
          department: dept !== 'All Departments' ? dept : (idx % 2 === 0 ? 'CSE' : 'ECE'),
          company: targetComp,
          package: pkg,
          status: 'Placed',
        };
      });

  const chartData = (Array.isArray(content.chartData) && content.chartData.length > 0)
    ? content.chartData
    : [
        { label: 'CSE', rate: 94, count: 169 },
        { label: 'ECE', rate: 86, count: 120 },
        { label: 'ME', rate: 72, count: 86 },
        { label: 'CE', rate: 68, count: 61 },
        { label: 'MBA', rate: 82, count: 65 },
      ];

  return {
    ...content,
    department: dept,
    company: comp,
    batch,
    generatedBy: content.generatedBy || 'Placement Officer',
    description: content.description || `Comprehensive ${type} report compiled for department ${dept}, batch ${batch}, and company ${comp}.`,
    filtersApplied,
    summary,
    records,
    chartData,
  };
};

const normalizeType = (value) => {
  const normalized = typeof value === 'string' ? value.toLowerCase() : '';
  return Object.values(REPORT_TYPES).includes(normalized) ? normalized : REPORT_TYPES.DASHBOARD;
};

const normalizeFormat = (value) => {
  const normalized = typeof value === 'string' ? value.toLowerCase() : '';
  return Object.values(REPORT_FORMATS).includes(normalized) ? normalized : REPORT_FORMATS.JSON;
};

const buildReportPayload = ({
  title,
  type,
  format,
  content,
  createdBy,
  status = REPORT_STATUSES.COMPLETED,
} = {}) => {
  const normType = normalizeType(type);
  const enrichedContent = buildDynamicReportContent(content, normType, title);

  return {
    title: title || 'Generated Report',
    type: normType,
    format: normalizeFormat(format),
    content: enrichedContent,
    createdBy,
    status,
  };
};

const buildReportSummary = (report = {}) => ({
  id: report.id || null,
  title: report.title || 'Generated Report',
  type: normalizeType(report.type),
  status: report.status || REPORT_STATUSES.COMPLETED,
  format: normalizeFormat(report.format),
  generatedAt: report.createdAt || report.created_at || null,
});

export {
  buildReportPayload,
  buildReportSummary,
};
