// fixDeadlines.js
import { pool } from "../config/db.js";

(async () => {
  try {
    await pool.query(
      "UPDATE projects SET final_due_at = '2028-06-01T23:59:00Z' WHERE title = 'E-Commerce Capstone'"
    );
    await pool.query(
      "UPDATE projects SET final_due_at = '2028-07-15T23:59:00Z' WHERE title = 'DevOps Pipeline Automation'"
    );
    await pool.query(
      "UPDATE project_milestones SET due_at = '2028-05-15T23:59:00Z' WHERE title = 'Database Schema Design'"
    );
    await pool.query(
      "UPDATE project_milestones SET due_at = '2028-05-25T23:59:00Z' WHERE title = 'API Implementation'"
    );
    await pool.query(
      "UPDATE project_milestones SET due_at = '2028-06-15T23:59:00Z' WHERE title = 'Dockerization'"
    );
    console.log("✅ Deadlines updated to 2028 successfully.");
  } catch (err) {
    console.error("❌ Failed:", err.message);
  } finally {
    await pool.end();
  }
})();
