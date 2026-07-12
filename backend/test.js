import { pool } from "./config/db.js";

const result = await pool.query(`
SELECT conname,
       pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conname = 'recruitment_drives_status_check';
`);

console.log(result.rows);

process.exit();