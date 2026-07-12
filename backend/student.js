import 'dotenv/config';
import { pool } from './config/db.js';

async function main() {
  const result = await pool.query(`
    UPDATE students
    SET college_id = 2
    WHERE id IN (1,2,3)
    RETURNING id, college_id;
  `);

  console.table(result.rows);
  await pool.end();
}

main().catch(err => {
  console.error(err);
  pool.end();
});