import PDFDocument from 'pdfkit';
import { buildDynamicReportContent } from './reportGenerator.js';

/**
 * Generates a beautiful, highly readable, tabular PDF document buffer using PDFKit.
 * @param {Object} report - Report metadata and content payload.
 * @returns {Promise<Buffer>} - Resolves to a Buffer containing PDF binary data.
 */
export const generateReportPdf = (report = {}) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 40, size: 'A4' });
      const buffers = [];

      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', (err) => reject(err));

      const title = report.title || report.reportName || 'Placement & Academic Performance Report';
      const type = report.type ? (report.type.charAt(0).toUpperCase() + report.type.slice(1)) : 'Placement';
      const generatedAt = report.createdAt
        ? new Date(report.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
        : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
      const status = report.status ? (report.status.charAt(0).toUpperCase() + report.status.slice(1)) : 'Completed';
      
      const rawContent = typeof report.content === 'string' ? JSON.parse(report.content || '{}') : (report.content || {});
      const content = buildDynamicReportContent(rawContent, type, title);

      // --- Header Branding ---
      doc
        .fillColor('#ff6d34')
        .fontSize(22)
        .font('Helvetica-Bold')
        .text('UpToSkills', 40, 40, { continued: true })
        .fillColor('#64748b')
        .fontSize(10)
        .font('Helvetica')
        .text('   Placement & Training Portal', { align: 'right' });

      doc.moveDown(0.3);
      doc
        .strokeColor('#e2e8f0')
        .lineWidth(1)
        .moveTo(40, doc.y)
        .lineTo(555, doc.y)
        .stroke();
      doc.moveDown(0.8);

      // --- Title Banner ---
      doc
        .fillColor('#0f172a')
        .fontSize(18)
        .font('Helvetica-Bold')
        .text(title);

      doc.moveDown(0.2);
      doc
        .fillColor('#475569')
        .fontSize(9)
        .font('Helvetica')
        .text(content.description || `Comprehensive report compiled for ${type} parameters.`);

      doc.moveDown(0.6);

      // --- Parameters Box ---
      const paramBoxY = doc.y;
      doc
        .rect(40, paramBoxY, 515, 36)
        .fillAndStroke('#f8fafc', '#e2e8f0');

      doc
        .fillColor('#334155')
        .fontSize(9)
        .font('Helvetica-Bold')
        .text('Department:', 50, paramBoxY + 8, { continued: true })
        .font('Helvetica')
        .fillColor('#0f172a')
        .text(` ${content.filtersApplied?.department || 'All Departments'}    `, { continued: true })
        .font('Helvetica-Bold')
        .fillColor('#334155')
        .text('Target Company:', { continued: true })
        .font('Helvetica')
        .fillColor('#0f172a')
        .text(` ${content.filtersApplied?.company || 'All Companies'}    `, { continued: true })
        .font('Helvetica-Bold')
        .fillColor('#334155')
        .text('Batch:', { continued: true })
        .font('Helvetica')
        .fillColor('#0f172a')
        .text(` ${content.filtersApplied?.batch || '2026'}`);

      doc
        .fillColor('#64748b')
        .fontSize(8)
        .font('Helvetica')
        .text(`Status: ${status}   |   Generated: ${generatedAt}   |   Operator: ${content.generatedBy || 'Placement Officer'}`, 50, paramBoxY + 22);

      doc.y = paramBoxY + 48;

      // --- Summary Cards ---
      if (content.summary && typeof content.summary === 'object') {
        doc
          .fillColor('#0f172a')
          .fontSize(11)
          .font('Helvetica-Bold')
          .text('Key Performance Indicators');
        doc.moveDown(0.4);

        const entries = Object.entries(content.summary);
        let x = 40;
        let y = doc.y;
        const cardWidth = Math.floor((515 - (entries.length - 1) * 8) / entries.length);
        const cardHeight = 42;

        entries.forEach(([key, val]) => {
          doc
            .rect(x, y, cardWidth, cardHeight)
            .fillAndStroke('#fff0ea', '#ffe2d4');

          doc
            .fillColor('#ff6d34')
            .fontSize(12)
            .font('Helvetica-Bold')
            .text(String(val), x + 4, y + 8, { width: cardWidth - 8, align: 'center' });

          const label = key.replace(/([A-Z])/g, ' $1').trim().toUpperCase();
          doc
            .fillColor('#64748b')
            .fontSize(7)
            .font('Helvetica')
            .text(label, x + 4, y + 26, { width: cardWidth - 8, align: 'center', ellipsis: true });

          x += cardWidth + 8;
        });

        doc.y = y + cardHeight + 16;
      }

      // --- Data Table ---
      const records = Array.isArray(content.records) ? content.records : [];
      if (records.length > 0) {
        doc
          .fillColor('#0f172a')
          .fontSize(11)
          .font('Helvetica-Bold')
          .text(`Detail Records (${records.length} items parsed)`);
        doc.moveDown(0.4);

        const headers = Object.keys(records[0]);
        const startX = 40;
        const totalWidth = 515;
        const colWidth = Math.floor(totalWidth / headers.length);
        let currentY = doc.y;

        // Table Header Row
        doc
          .rect(startX, currentY, totalWidth, 20)
          .fill('#f1f5f9');

        let currentX = startX;
        headers.forEach((h) => {
          const label = h.replace(/([A-Z])/g, ' $1').toUpperCase();
          doc
            .fillColor('#334155')
            .fontSize(8)
            .font('Helvetica-Bold')
            .text(label, currentX + 4, currentY + 6, { width: colWidth - 8, ellipsis: true });
          currentX += colWidth;
        });

        currentY += 20;

        // Rows
        records.forEach((rec, idx) => {
          if (currentY > 730) {
            doc.addPage();
            currentY = 40;
          }

          const bgColor = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
          doc
            .rect(startX, currentY, totalWidth, 18)
            .fill(bgColor);

          currentX = startX;
          headers.forEach((h) => {
            const val = rec[h] !== null && rec[h] !== undefined ? String(rec[h]) : '-';
            doc
              .fillColor('#0f172a')
              .fontSize(8)
              .font('Helvetica')
              .text(val, currentX + 4, currentY + 4, { width: colWidth - 8, ellipsis: true });
            currentX += colWidth;
          });

          currentY += 18;
        });

        doc.y = currentY + 12;
      }

      // Footer
      doc
        .fontSize(8)
        .fillColor('#94a3b8')
        .font('Helvetica')
        .text('© UpToSkills LMS Placement & Training Portal — Confidential & Proprietary Report Document', 40, 770, { align: 'center', width: 515 });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

export default generateReportPdf;
