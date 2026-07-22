/**
 * Location: backend/utils/exportHelper.js
 */

/**
 * Converts an array of objects into a CSV string.
 * @param {Array<Object>} data 
 * @param {Array<string>} headers Keys to extract from each object.
 * @param {Array<string>} headerLabels Human-readable labels for headers.
 */
export const convertToCSV = (data, headers, headerLabels = []) => {
  if (!Array.isArray(data)) return "";
  
  const labels = headerLabels.length > 0 ? headerLabels : headers;
  
  // Create CSV header row
  const headerRow = labels.map(label => `"${String(label).replace(/"/g, '""')}"`).join(",");
  
  // Create CSV data rows
  const dataRows = data.map(item => {
    return headers.map(key => {
      const val = item[key] !== undefined && item[key] !== null ? item[key] : "";
      return `"${String(val).replace(/"/g, '""')}"`;
    }).join(",");
  });

  return [headerRow, ...dataRows].join("\n");
};

/**
 * Converts data to HTML formatted report string (which standard PDF print layouts accept).
 */
export const convertToHTMLReport = (data, title, headers, headerLabels = []) => {
  const labels = headerLabels.length > 0 ? headerLabels : headers;
  
  const tableHeadersHtml = labels.map(label => `
    <th style="border: 1px solid #ddd; padding: 12px; text-align: left; background-color: #4CAF50; color: white;">
      ${label}
    </th>
  `).join("");

  const tableRowsHtml = data.map(item => {
    const cells = headers.map(key => {
      const val = item[key] !== undefined && item[key] !== null ? item[key] : "-";
      return `<td style="border: 1px solid #ddd; padding: 12px;">${val}</td>`;
    }).join("");
    return `<tr>${cells}</tr>`;
  }).join("");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
        h1 { color: #4CAF50; margin-bottom: 20px; }
        .footer { margin-top: 30px; font-size: 12px; color: #777; border-top: 1px solid #eee; padding-top: 10px; }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <p>Report Generated on: ${new Date().toLocaleString()}</p>
      
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <thead>
          <tr>${tableHeadersHtml}</tr>
        </thead>
        <tbody>
          ${tableRowsHtml}
        </tbody>
      </table>
      
      <div class="footer">
        <p>Pragati Placement & Training Management System - Confidential</p>
      </div>
    </body>
    </html>
  `;
};

export default {
  convertToCSV,
  convertToHTMLReport,
};
