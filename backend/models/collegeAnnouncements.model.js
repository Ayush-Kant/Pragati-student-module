import { pool } from "../config/db.js";

// Get all announcements
export const getAllAnnouncements = async () => {
  const { rows } = await pool.query(
    `SELECT
        a.*,
        c.name AS category_name
     FROM announcements a
     LEFT JOIN announcement_categories c
     ON a.category_id = c.id
     ORDER BY a.created_at DESC`
  );

  return rows;
};

// Get announcement by ID
export const getAnnouncementById = async (id) => {
  const { rows } = await pool.query(
    `SELECT
        a.*,
        c.name AS category_name
     FROM announcements a
     LEFT JOIN announcement_categories c
     ON a.category_id = c.id
     WHERE a.id = $1`,
    [id]
  );

  return rows[0];
};

// Create announcement
export const createAnnouncement = async ({
  title,
  description,
  category_id,
  created_by,
}) => {
  const { rows } = await pool.query(
    `INSERT INTO announcements
      (title, description, category_id, created_by)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [title, description, category_id, created_by]
  );

  return rows[0];
};

// Update announcement
export const updateAnnouncement = async (id, data) => {
  const fields = [];
  const values = [];
  let index = 1;

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      fields.push(`${key} = $${index++}`);
      values.push(value);
    }
  });

  fields.push(`updated_at = CURRENT_TIMESTAMP`);
  values.push(id);

  const query = `
    UPDATE announcements
    SET ${fields.join(", ")}
    WHERE id = $${index}
    RETURNING *;
  `;

  const { rows } = await pool.query(query, values);

  return rows[0];
};

// Delete announcement
export const deleteAnnouncement = async (id) => {
  const { rows } = await pool.query(
    `DELETE FROM announcements
     WHERE id = $1
     RETURNING *`,
    [id]
  );

  return rows[0];
};

// Publish announcement
export const publishAnnouncement = async (id) => {
  const { rows } = await pool.query(
    `UPDATE announcements
     SET status='Published',
         updated_at=CURRENT_TIMESTAMP
     WHERE id=$1
     RETURNING *`,
    [id]
  );

  return rows[0];
};

// Unpublish announcement
export const unpublishAnnouncement = async (id) => {
  const { rows } = await pool.query(
    `UPDATE announcements
     SET status='Draft',
         updated_at=CURRENT_TIMESTAMP
     WHERE id=$1
     RETURNING *`,
    [id]
  );

  return rows[0];
};

export default {
  getAllAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  publishAnnouncement,
  unpublishAnnouncement,
};