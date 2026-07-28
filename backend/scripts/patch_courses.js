import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filesToPatch = [
    'migrations/009_create_college_department_courses.sql',
    'migrations/college.department.course.seeddata.sql',
    'models/college.course.models.js',
    'models/college.departmentstatistics.models.js'
];

for (const relPath of filesToPatch) {
    const filePath = path.join(__dirname, relPath);
    if (!fs.existsSync(filePath)) {
        console.log(`File not found: ${filePath}`);
        continue;
    }
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace table references
    // We want to replace "courses" with "college_courses" in FROM, JOIN, INTO, UPDATE, TABLE
    content = content.replace(/\bFROM courses\b/g, 'FROM college_courses');
    content = content.replace(/\bJOIN courses\b/g, 'JOIN college_courses');
    content = content.replace(/\bINTO courses\b/g, 'INTO college_courses');
    content = content.replace(/\bUPDATE courses\b/g, 'UPDATE college_courses');
    content = content.replace(/\bTABLE IF NOT EXISTS courses\b/g, 'TABLE IF NOT EXISTS college_courses');
    content = content.replace(/\bREFERENCES courses\b/g, 'REFERENCES college_courses');
    content = content.replace(/\bON courses\b/g, 'ON college_courses');
    content = content.replace(/\idx_courses_/g, 'idx_college_courses_');
    content = content.replace(/\uq_courses_/g, 'uq_college_courses_');
    content = content.replace(/\fk_courses_/g, 'fk_college_courses_');
    content = content.replace(/\trg_courses_/g, 'trg_college_courses_');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Patched ${relPath}`);
}
