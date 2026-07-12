import { pool } from "./config/db.js";

async function main() {
  const res = await pool.query(`
    INSERT INTO assessments
      (title, type, difficulty, time_limit_minutes, total_marks, status)
    VALUES
      ('Java Assessment', 'MCQ', 'Easy', 60, 100, 'draft')
    RETURNING id, title;
  `);

  console.table(res.rows);
  process.exit();
}

main().catch(console.error);