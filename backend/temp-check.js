import { pool } from "./config/db.js";

async function check() {
  const res = await pool.query(`
    SELECT constraint_name, constraint_type 
    FROM information_schema.table_constraints 
    WHERE table_name = 'student_profiles'
  `);
  console.log("Constraints:", res.rows);
  
  const cols = await pool.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'student_profiles'
  `);
  console.log("Columns:", cols.rows);
  process.exit();
}
check();
