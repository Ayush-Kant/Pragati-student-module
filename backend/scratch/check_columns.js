import { pool } from "../config/db.js";

async function checkColumns() {
  try {
    const res = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'mentors'
    `);
    console.log("Mentors columns:", res.rows);

    const resUsers = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users'
    `);
    console.log("Users columns:", resUsers.rows);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

checkColumns();
