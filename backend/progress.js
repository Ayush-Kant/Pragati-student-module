import 'dotenv/config';
import { pool } from './config/db.js';

async function main() {
  const result = await pool.query(`
    INSERT INTO student_drive_progress
    (
      student_id,
      drive_id,
      college_id,
      company_id,
      stage,
      current_stage,
      assessment_score,
      training_completion,
      updated_at,
      stage_updated_at
    )
    VALUES
    (1,1,2,1,'applied','applied',85,80,NOW(),NOW())
    RETURNING *;
  `);

  console.table(result.rows);
  await pool.end();
}

main().catch(err => {
  console.error(err);
  pool.end();
});