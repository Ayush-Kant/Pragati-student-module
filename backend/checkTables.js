import { pool } from "./config/db.js";

try {
  const result = await pool.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    ORDER BY table_name;
  `);

  console.log("Tables:");
  console.table(result.rows);
} catch (err) {
  console.error(err);
} finally {
  await pool.end();
}