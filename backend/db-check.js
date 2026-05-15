import { pool } from "./config/db.js";

async function checkTables() {
  try {
    const res = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log("Tables in the database:");
    console.log(res.rows.map(row => row.table_name));
    process.exit(0);
  } catch (err) {
    console.error("Error connecting or querying:", err);
    process.exit(1);
  }
}

checkTables();
