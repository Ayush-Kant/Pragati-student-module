import { useState } from "react";
import * as service from "../services/reportsService";
import { validateExport } from "../validations/reportsValidation";

export const useExportReports = (onExportSuccess) => {
  const [exportingId, setExportingId] = useState(null);
  const [error, setError] = useState(null);

  const handleExport = async (report, type, actionFn) => {
    const validation = validateExport(report, type);
    if (!validation.isValid) {
      setError(Object.values(validation.errors).join(" "));
      return;
    }

    setExportingId(report.id);
    setError(null);
    try {
      await actionFn(report.id);
      if (onExportSuccess) {
        onExportSuccess();
      }
    } catch (err) {
      setError(err.message || `Failed to export as ${type}`);
    } finally {
      setExportingId(null);
    }
  };

  const exportPDF = async (report) => {
    await handleExport(report, "PDF", async (id) => {
      const response = await service.exportPDF(id);
      if (response.success) {
        // Trigger browser print for printable document window or style
        // We will pass the preview details to print window
        printReport(report);
      }
    });
  };

  const exportExcel = async (report) => {
    await handleExport(report, "EXCEL", service.exportExcel);
  };

  const exportCSV = async (report) => {
    await handleExport(report, "CSV", service.exportCSV);
  };

  const downloadReportFile = async (report) => {
    await handleExport(report, "CSV", service.downloadReport);
  };

  const printReport = (report) => {
    // Open a temporary window for printing with premium styles
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Popup blocker prevented opening the print window.");
      return;
    }
    
    // We will generate HTML representation for print styling
    const dateStr = new Date(report.generatedOn).toLocaleDateString();
    
    printWindow.document.write(`
      <html>
        <head>
          <title>${report.reportName}</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; padding: 40px; color: #1e293b; line-height: 1.5; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #ff6d34; }
            .meta { font-size: 14px; text-align: right; color: #64748b; }
            .title { font-size: 28px; font-weight: bold; color: #0f172a; margin-top: 0; }
            .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 40px; background: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; }
            .detail-item { font-size: 14px; }
            .detail-label { font-weight: 600; color: #64748b; margin-bottom: 4px; }
            .detail-val { font-size: 16px; color: #0f172a; font-weight: 500; }
            .section-title { font-size: 20px; font-weight: 600; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-top: 30px; margin-bottom: 15px; }
            .preview-summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 30px; }
            .summary-card { background: #fff0ea; border: 1px solid #ffe2d4; padding: 15px; border-radius: 6px; text-align: center; }
            .summary-num { font-size: 22px; font-weight: bold; color: #ff6d34; }
            .summary-lbl { font-size: 12px; color: #64748b; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th { background: #f1f5f9; text-align: left; padding: 10px; font-size: 13px; font-weight: 600; border-bottom: 2px solid #e2e8f0; }
            td { padding: 10px; font-size: 13px; border-bottom: 1px solid #e2e8f0; }
            .footer { margin-top: 60px; font-size: 12px; text-align: center; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 15px; }
            @media print {
              body { padding: 0; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="logo">UpToSkills</div>
              <div style="font-size: 12px; color: #64748b;">AI-Powered Placement & Training</div>
            </div>
            <div class="meta">
              <div><strong>Generated:</strong> ${dateStr}</div>
              <div><strong>Operator:</strong> ${report.generatedBy}</div>
              <div><strong>Status:</strong> ${report.status}</div>
            </div>
          </div>
          
          <h1 class="title">${report.reportName}</h1>
          <p style="color: #475569; margin-bottom: 25px;">${report.description}</p>
          
          <div class="details-grid">
            <div class="detail-item">
              <div class="detail-label">Report Type</div>
              <div class="detail-val">${report.type}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Department Scope</div>
              <div class="detail-val">${report.department || "All Departments"}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Target Company</div>
              <div class="detail-val">${report.company || "All Companies"}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Batch Year</div>
              <div class="detail-val">${report.batch || "All"}</div>
            </div>
          </div>

          <div class="section-title">Report Content Preview</div>
          <p style="font-size: 13px; color: #64748b;">Below is a structured representation of the generated report metadata. Use the official downloads for spreadsheet analytics.</p>
          
          <table>
            <thead>
              <tr>
                <th>Report ID</th>
                <th>Report Name</th>
                <th>Category</th>
                <th>Size</th>
                <th>Downloads</th>
                <th>Generated On</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#${report.id}</td>
                <td><strong>${report.reportName}</strong></td>
                <td>${report.type}</td>
                <td>${report.size || "N/A"}</td>
                <td>${report.downloadCount} downloads</td>
                <td>${report.generatedOn}</td>
              </tr>
            </tbody>
          </table>

          <div class="footer">
            © ${new Date().getFullYear()} UpToSkills. Generated via Placement Portal Admin Console. All rights reserved.
          </div>
          
          <script>
            window.onload = function() {
              window.print();
              // Close after printing dialog resolves
              setTimeout(() => { window.close(); }, 500);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return {
    exportingId,
    error,
    exportPDF,
    exportExcel,
    exportCSV,
    downloadReportFile,
    printReport
  };
};
export default useExportReports;
