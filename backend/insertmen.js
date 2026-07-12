import { pool } from "./config/db.js";

const main = async () => {
  const result = await pool.query(`
    INSERT INTO mentors (
      user_id,
      bio,
      expertise_tags,
      verified,
      status
    )
    VALUES (
      1,
      'Java Mentor',
      ARRAY['Java','DSA'],
      true,
      'active'
    )
    RETURNING *;
  `);

  console.table(result.rows);

  process.exit();
};

main();