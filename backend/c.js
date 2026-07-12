import 'dotenv/config';
import { pool } from './config/db.js';

const result = await pool.query(`
SELECT id
FROM users
ORDER BY id;
`);

console.table(result.rows);

await pool.end();