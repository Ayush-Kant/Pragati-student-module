import { spawnSync } from "node:child_process";
import path from "node:path";
import process from "node:process";

const scripts = [
  "installStudentStarterData.js",
  "seedStudentCollege.js",
  "seedStudentDemoData.js",
  "seedStudentInterviews.js",
  "seedStudentNotifications.js",
];

console.log("============================================");
console.log(" Pragati - Student Demo Data Seeder");
console.log("============================================");
console.log("This command is non-destructive: it does not run the legacy full seed.js truncation script.");
console.log("Starter data is account-agnostic: existing students are backfilled and future student registrations are seeded automatically.");

for (const script of scripts) {
  console.log(`\n▶ Running ${script}`);
  const result = spawnSync(process.execPath, [path.join(process.cwd(), "scripts", script)], {
    cwd: process.cwd(),
    stdio: "inherit",
    env: process.env,
  });

  if (result.error) {
    console.error(`✗ Could not start ${script}: ${result.error.message}`);
    process.exit(result.status ?? 1);
  }

  if (result.status !== 0) {
    console.error(`✗ ${script} failed with exit code ${result.status}.`);
    process.exit(result.status ?? 1);
  }
}

console.log("\n============================================");
console.log(" Student demo data seed completed");
console.log("============================================");
console.log("All existing student accounts have starter data, and the database trigger will seed new student accounts automatically.");
