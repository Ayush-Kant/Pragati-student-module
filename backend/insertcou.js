import { pool } from "./config/db.js";

const main = async () => {
  const result = await pool.query(`
    INSERT INTO courses (
      mentor_id,
      drive_id,
      title,
      description,
      skill_tags,
      status
    )
    VALUES (
      1,
      1,
      'Java Training',
      'Basic Java Training',
      ARRAY['Java','OOP'],
      'published'
    )
    RETURNING *;
  `);

  console.table(result.rows);

  process.exit();
};

main();