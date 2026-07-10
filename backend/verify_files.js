import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const assessmentModule = {
  controllers: [
    "student.assessment.controller.js"
  ],
  services: [
    "student.assessment.service.js"
  ],
  routes: [
    "student.assessment.routes.js"
  ],
  validators: [
    "student.assessment.validator.js"
  ],
  migrations: [
    "006_create_assessments.sql",
    "011_create_student_assessment_tables.sql"
  ],
  middleware: [
    "authMiddleware.js",
    "roleMiddleware.js"
  ]
};

console.log("🔍 Verifying Student Assessment Module Files...\n");

let allFilesExist = true;
const results = {};

Object.entries(assessmentModule).forEach(([category, files]) => {
  console.log(`📁 ${category.toUpperCase()}`);
  results[category] = { total: files.length, exist: 0 };
  
  files.forEach(file => {
    let filePath;
    if (category === "migrations") {
      filePath = path.join(__dirname, "migrations", file);
    } else if (category === "middleware") {
      filePath = path.join(__dirname, "middleware", file);
    } else {
      filePath = path.join(__dirname, category, file);
    }
    
    const exists = fs.existsSync(filePath);
    results[category].exist += exists ? 1 : 0;
    
    const status = exists ? "✓" : "✗";
    console.log(`  ${status} ${file}`);
    
    if (!exists) allFilesExist = false;
  });
  console.log("");
});

console.log("📊 SUMMARY");
console.log("=".repeat(40));
Object.entries(results).forEach(([category, { total, exist }]) => {
  const percentage = Math.round((exist / total) * 100);
  console.log(`${category}: ${exist}/${total} (${percentage}%)`);
});

console.log("\n" + (allFilesExist ? "✅ All required files present" : "⚠️  Some files missing!"));
