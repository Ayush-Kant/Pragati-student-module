const fs = require('fs');
const { execSync } = require('child_process');

try {
  const output = execSync('git diff --name-only --diff-filter=U').toString();
  const files = output.trim().split('\n').map(f => f.trim()).filter(f => f);
  let report = '';
  for (const file of files) {
    if(file.endsWith('package-lock.json') || file.endsWith('package.json')) continue;
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    report += `\n\n--- FILE: ${file} ---\n`;
    let inConflict = false;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('<<<<<<<')) {
        inConflict = true;
        report += `<<<<<<< (line ${i+1}):\n`;
        continue;
      }
      if (lines[i].startsWith('=======')) {
        report += `=======\n`;
        continue;
      }
      if (lines[i].startsWith('>>>>>>>')) {
        inConflict = false;
        report += `>>>>>>>\n`;
        continue;
      }
      if (inConflict) {
        report += lines[i] + '\n';
      }
    }
  }
  fs.writeFileSync('conflicts_report.md', report);
  console.log('Extracted conflicts to conflicts_report.md');
} catch (e) {
  console.error(e);
}
