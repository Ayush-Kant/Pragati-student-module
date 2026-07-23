import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  connectionString: "postgresql://postgres:omkar1611@localhost:5432/pragati"
});

async function insertTestData() {
  const client = await pool.connect();
  try {
    console.log("Inserting test data...");
    
    // Insert test auth_user
    const authUserResult = await client.query(
      `INSERT INTO auth_users (email, password_hash, role) 
       VALUES ($1, $2, $3) 
       ON CONFLICT DO NOTHING
       RETURNING id`,
      ["test@student.com", "hashed_password", "student"]
    );
    const authUserId = authUserResult.rows[0]?.id || 1;
    console.log(`✓ Auth User ID: ${authUserId}`);

    // Insert test user
    const userResult = await client.query(
      `INSERT INTO users (full_name, auth_user_id, email, role) 
       VALUES ($1, $2, $3, $4) 
       ON CONFLICT (auth_user_id) DO NOTHING
       RETURNING id`,
      ["Test Student", authUserId, "test@student.com", "student"]
    );
    const userId = userResult.rows[0]?.id || 1;
    console.log(`✓ User ID: ${userId}`);

    // Insert test assessment
    const assessmentResult = await client.query(
      `INSERT INTO assessments (title, type, difficulty, time_limit_minutes, total_marks, status, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      ["Math Quiz", "MCQ", "Easy", 30, 100, "active", 1]
    );
    const assessmentId = assessmentResult.rows[0].id;
    console.log(`✓ Assessment ID: ${assessmentId}`);

    // Insert test questions
    await client.query(
      `INSERT INTO assessment_questions (assessment_id, type, question_text, options, correct_option, marks)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        assessmentId,
        "MCQ",
        "What is 2 + 2?",
        JSON.stringify(["3", "4", "5", "6"]),
        1,
        10
      ]
    );
    console.log(`✓ Test questions inserted`);

    // Insert assessment assignment
    await client.query(
      `INSERT INTO assessment_assignments (assessment_id, drive_id)
       VALUES ($1, $2)
       ON CONFLICT DO NOTHING`,
      [assessmentId, 1]
    );
    console.log(`✓ Assessment assigned`);

    console.log("\n✅ Test data inserted successfully");
    return { userId, assessmentId };
  } catch (error) {
    console.error("❌ Error inserting test data:", error.message);
    throw error;
  } finally {
    client.release();
  }
}

insertTestData().then(() => pool.end());
