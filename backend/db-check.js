import { pool } from "./config/db.js";

async function checkSchema() {
  try {
    const res = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log("Tables:");
    console.log(res.rows);

    const userCols = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users'
    `);
    console.log("\nUsers table columns:");
    console.log(userCols.rows);

  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}

checkSchema();
