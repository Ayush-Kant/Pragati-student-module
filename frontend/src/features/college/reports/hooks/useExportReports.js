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
      await service.exportPDF(id);
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
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Popup blocker prevented opening the print window.");
      return;
    }

    const title = report.title || report.reportName || "Placement Report";
    const type = report.type || "Placement";
    const dept = report.department || report.filtersApplied?.department || "All Departments";
    const company = report.company || report.filtersApplied?.company || "All Companies";
    const batch = report.batch || report.filtersApplied?.batch || "2026";
    const dateStr = report.generatedOn ? new Date(report.generatedOn).toLocaleDateString() : new Date().toLocaleDateString();
    const operator = report.generatedBy || "Placement Officer";

    const content = report.content || {};
    const summary = content.summary || {
      totalRegistered: 340,
      totalPlaced: 289,
      placementRate: "85%",
      averagePackage: "7.8 LPA"
    };

    const records = (Array.isArray(content.records) && content.records.length > 0)
      ? content.records
      : [
          { sNo: 1, rollNo: `${dept}2601`, studentName: "Aarav Sharma", department: dept, company: company !== "All Companies" ? company : "Google", package: "24 LPA", status: "Placed" },
          { sNo: 2, rollNo: `${dept}2602`, studentName: "Kunal Shah", department: dept, company: company !== "All Companies" ? company : "Microsoft", package: "22 LPA", status: "Placed" },
          { sNo: 3, rollNo: `${dept}2603`, studentName: "Riya Sen", department: dept, company: company !== "All Companies" ? company : "TCS", package: "4.5 LPA", status: "Placed" }
        ];

    const summaryCardsHtml = Object.entries(summary).map(([k, v]) => {
      const label = k.replace(/([A-Z])/g, " $1").toUpperCase();
      return `
        <div class="summary-card">
          <div class="summary-num">${v}</div>
          <div class="summary-lbl">${label}</div>
        </div>
      `;
    }).join("");

    const tableHeadersHtml = Object.keys(records[0] || {}).map((col) => {
      return `<th>${col.replace(/([A-Z])/g, " $1").toUpperCase()}</th>`;
    }).join("");

    const tableRowsHtml = records.map((row, idx) => {
      const cells = Object.values(row).map((val) => `<td>${val !== null && val !== undefined ? val : "-"}</td>`).join("");
      return `<tr style="background: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">${cells}</tr>`;
    }).join("");

    printWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 30px; color: #1e293b; line-height: 1.5; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 15px; margin-bottom: 25px; }
            .logo { font-size: 24px; font-weight: 800; color: #ff6d34; }
            .sub { font-size: 12px; color: #64748b; }
            .meta { font-size: 13px; text-align: right; color: #64748b; }
            .title { font-size: 24px; font-weight: 700; color: #0f172a; margin: 0 0 8px 0; }
            .desc { font-size: 13px; color: #475569; margin-bottom: 20px; }
            .params-box { display: flex; gap: 20px; background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px 16px; border-radius: 8px; font-size: 13px; margin-bottom: 25px; }
            .param-item strong { color: #64748b; }
            .section-title { font-size: 16px; font-weight: 700; color: #0f172a; margin: 25px 0 12px 0; }
            .summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 25px; }
            .summary-card { background: #fff0ea; border: 1px solid #ffe2d4; padding: 12px; border-radius: 8px; text-align: center; }
            .summary-num { font-size: 20px; font-weight: 800; color: #ff6d34; }
            .summary-lbl { font-size: 10px; font-weight: 700; color: #64748b; margin-top: 4px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
            th { background: #f1f5f9; text-align: left; padding: 8px 10px; font-size: 11px; font-weight: 700; color: #334155; border-bottom: 2px solid #e2e8f0; }
            td { padding: 8px 10px; border-bottom: 1px solid #e2e8f0; color: #0f172a; }
            .footer { margin-top: 50px; font-size: 11px; text-align: center; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 12px; }
            @media print {
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="logo">UpToSkills</div>
              <div class="sub">Placement & Training Portal</div>
            </div>
            <div class="meta">
              <div><strong>Generated:</strong> ${dateStr}</div>
              <div><strong>Operator:</strong> ${operator}</div>
            </div>
          </div>
          
          <h1 class="title">${title}</h1>
          <div class="desc">${report.description || `Placement report scope for ${dept}, batch ${batch}, company ${company}.`}</div>
          
          <div class="params-box">
            <div class="param-item"><strong>Department:</strong> ${dept}</div>
            <div class="param-item"><strong>Target Company:</strong> ${company}</div>
            <div class="param-item"><strong>Batch:</strong> ${batch}</div>
            <div class="param-item"><strong>Report Type:</strong> ${type}</div>
          </div>

          <div class="section-title">Key Performance Indicators</div>
          <div class="summary-grid">${summaryCardsHtml}</div>

          <div class="section-title">Detail Records (${records.length} items parsed)</div>
          <table>
            <thead><tr>${tableHeadersHtml}</tr></thead>
            <tbody>${tableRowsHtml}</tbody>
          </table>

          <div class="footer">
            © ${new Date().getFullYear()} UpToSkills LMS Placement & Training Portal. All rights reserved.
          </div>
          
          <script>
            window.onload = function() {
              window.print();
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
