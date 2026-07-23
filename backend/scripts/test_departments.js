import { pool } from "./config/db.js";
import jwt from "jsonwebtoken";

async function run() {
  try {
    // 1. Ensure table exists in Supabase
    console.log("Ensuring table exists in the database...");
    await pool.query(`
      ALTER TABLE departments ADD COLUMN IF NOT EXISTS courses TEXT[];
      ALTER TABLE departments ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
      CREATE INDEX IF NOT EXISTS idx_departments_name ON departments(name);
    `);
    console.log("Table 'departments' is ready.");

    const token = jwt.sign({ userId: 1 }, process.env.JWT_SECRET || 'your_jwt_secret_key_here', { expiresIn: '1h' });
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    const baseUrl = 'http://localhost:5001/api/departments';

    // --- POST ---
    console.log("\n--- POST /api/departments ---");
    const postRes = await fetch(baseUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: "Test Engineering",
        courses: ["Software Testing", "Quality Assurance"]
      })
    });
    const postText = await postRes.text();
    let postData;
    try {
      postData = JSON.parse(postText);
    } catch (e) {
      console.log("Raw Response:", postText);
      throw e;
    }
    console.log("Status:", postRes.status);
    console.log("Body:", postData);
    const deptId = postData.deptId;

    // --- GET ---
    console.log("\n--- GET /api/departments ---");
    const getRes = await fetch(baseUrl, { headers });
    const getData = await getRes.json();
    console.log("Status:", getRes.status);
    console.log(`Fetched ${getData.length} departments.`);
    console.log("Latest entry:", getData[getData.length - 1] || getData);

    if (deptId) {
      // --- PUT ---
      console.log(`\n--- PUT /api/departments/${deptId} ---`);
      const putRes = await fetch(`${baseUrl}/${deptId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          name: "Test Engineering Updated",
          courses: ["Software Testing", "Quality Assurance", "Automation Testing"]
        })
      });
      const putData = await putRes.json();
      console.log("Status:", putRes.status);
      console.log("Body:", putData);

      // --- DELETE ---
      console.log(`\n--- DELETE /api/departments/${deptId} ---`);
      const delRes = await fetch(`${baseUrl}/${deptId}`, {
        method: 'DELETE',
        headers
      });
      const delData = await delRes.json();
      console.log("Status:", delRes.status);
      console.log("Body:", delData);
    }

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await pool.end();
  }
}

run();
