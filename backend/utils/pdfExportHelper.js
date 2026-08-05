const escapePdfText = (value) => String(value ?? '').replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');

const wrap = (text, width = 92) => {
  const words = String(text ?? '').split(/\s+/); const lines = []; let line = '';
  for (const word of words) { const next = line ? `${line} ${word}` : word; if (next.length > width && line) { lines.push(line); line = word; } else line = next; }
  if (line) lines.push(line); return lines;
};

/** Creates a small, dependency-free, standards-compliant PDF for analytics exports. */
export const createAnalyticsPdf = ({ title, headers, rows }) => {
  const lines = [title, `Generated: ${new Date().toISOString()}`, '', headers.join(' | '), ...rows.flatMap((row) => wrap(headers.map((header) => row[header] ?? '-').join(' | ')))];
  const pageLines = []; for (let index = 0; index < lines.length; index += 44) pageLines.push(lines.slice(index, index + 44));
  const objects = []; const add = (body) => { objects.push(body); return objects.length; };
  const fontId = add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
  const pageIds = [];
  for (const page of pageLines) {
    const stream = ['BT', '/F1 10 Tf', '50 760 Td', ...page.flatMap((line, i) => [`(${escapePdfText(line)}) Tj`, i < page.length - 1 ? '0 -16 Td' : '']), 'ET'].join('\n');
    const contentId = add(`<< /Length ${Buffer.byteLength(stream, 'utf8')} >>\nstream\n${stream}\nendstream`);
    pageIds.push(add(`<< /Type /Page /Parent PAGES_ID 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 ${fontId} 0 R >> >> /Contents ${contentId} 0 R >>`));
  }
  const pagesId = add(`<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pageIds.length} >>`);
  const catalogId = add(`<< /Type /Catalog /Pages ${pagesId} 0 R >>`);
  for (const id of pageIds) objects[id - 1] = objects[id - 1].replace('PAGES_ID', String(pagesId));
  let pdf = '%PDF-1.4\n'; const offsets = [0];
  for (let id = 1; id <= objects.length; id += 1) { offsets[id] = Buffer.byteLength(pdf, 'utf8'); pdf += `${id} 0 obj\n${objects[id - 1]}\nendobj\n`; }
  const xref = Buffer.byteLength(pdf, 'utf8'); pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.slice(1).map((offset) => `${String(offset).padStart(10, '0')} 00000 n \n`).join('')}trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return Buffer.from(pdf, 'utf8');
};
