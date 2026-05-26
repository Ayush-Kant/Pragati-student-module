import pg from "pg";
const { Pool } = pg;

const passwords = ["23vv1a1224", "postgres", "admin", "root", "password", "123456", "", "postgres123"];

async function testPasswords() {
  for (const pwd of passwords) {
    try {
      const pool = new Pool({
        user: "postgres",
        host: "localhost",
        database: "postgres", // try default db first
        password: pwd,
        port: 5432,
      });
      await pool.query("SELECT 1");
      console.log(`✅ Success with password: "${pwd}"`);
      process.exit(0);
    } catch (err) {
      console.log(`❌ Failed with password: "${pwd}"`);
    }
  }
  console.log("Could not find the correct password.");
  process.exit(1);
}

testPasswords();
