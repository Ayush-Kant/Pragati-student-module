import { pool } from '../../config/db.js';

export const seedAssignments = async () => {
    const count = await pool.query('SELECT COUNT(*)::int AS count FROM assignments');
    if (count.rows[0].count > 0) {
        return;
    }

    await pool.query(
        `INSERT INTO assignments (student_id, title, subject, description, due_date, total_marks, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [1, 'Intro to React', 'Frontend', 'Create a simple component', '2026-08-15', 100, 'Open'],
    );
};
