import 'dotenv/config';
import { pool } from './config/db.js';

async function main() {
  const result = await pool.query(`
    INSERT INTO colleges
    (
      name,
      email,
      phone,
      status,
      created_at
    )
    VALUES
    (
      'ABC Engineering College',
      'college@test.com',
      '9876543210',
      'approved',
      NOW()
    )
    RETURNING id, name;
  `);

  console.table(result.rows);
  await pool.end();
}

main().catch(err => {
  console.error(err);
  pool.end();
});