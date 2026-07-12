import { pool } from "./config/db.js";

async function main() {
  const res = await pool.query(`
    INSERT INTO courses
      (course_name, course_code, semester, credits, description, is_active)
    VALUES
      ('Java Training', 'JAVA101', 5, 4, 'Basic Java Training Course', TRUE)
    RETURNING id, course_name;
  `);

  console.table(res.rows);
  process.exit();
}

main().catch(console.error);