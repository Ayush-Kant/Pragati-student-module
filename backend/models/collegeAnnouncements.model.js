import { pool } from "../config/db.js";

// Safe SQL to join creator/publisher without assuming user column names
export const getAllAnnouncements = async () => {
  const { rows } = await pool.query(
    `SELECT
        a.*,
        c.name AS category_name,
        COALESCE(u_create.email, 'Admin (' || a.created_by || ')') AS creator_name,
        COALESCE(u_pub.email, 'Admin') AS publisher_name
     FROM announcements a
     LEFT JOIN announcement_categories c ON a.category_id = c.id
     LEFT JOIN users u_create ON a.created_by = u_create.id
     LEFT JOIN users u_pub ON a.published_by = u_pub.id
     ORDER BY a.created_at DESC`
  );

  return rows;
};

// Get announcement by ID
export const getAnnouncementById = async (id) => {
  const { rows } = await pool.query(
    `SELECT
        a.*,
        c.name AS category_name,
        COALESCE(u_create.email, 'Admin (' || a.created_by || ')') AS creator_name,
        COALESCE(u_pub.email, 'Admin') AS publisher_name
     FROM announcements a
     LEFT JOIN announcement_categories c ON a.category_id = c.id
     LEFT JOIN users u_create ON a.created_by = u_create.id
     LEFT JOIN users u_pub ON a.published_by = u_pub.id
     WHERE a.id = $1`,
    [id]
  );

  return rows[0];
};

// Resolve category_id: returns a valid integer ID or null.
// Throws a 400 error if the provided value doesn't exist in announcement_categories.
const resolveCategory = async (category_id) => {
  if (category_id === undefined || category_id === null || category_id === "") {
    return null;
  }
  const parsed = parseInt(category_id, 10);
  if (isNaN(parsed)) {
    const err = new Error("category_id must be a valid integer.");
    err.statusCode = 400;
    throw err;
  }
  const { rows } = await pool.query(
    "SELECT id FROM announcement_categories WHERE id = $1",
    [parsed]
  );
  if (rows.length === 0) {
    const err = new Error(`Category with id ${parsed} does not exist.`);
    err.statusCode = 400;
    throw err;
  }
  return parsed;
};

// Get all announcement categories
export const getAllCategories = async () => {
  const { rows } = await pool.query(
    `SELECT id, name, description, created_at FROM announcement_categories ORDER BY name ASC`
  );
  return rows;
};

// Create announcement
export const createAnnouncement = async ({
  title,
  description,
  category_id,
  created_by,
  priority = "Medium",
  target_audience = "All Students",
  announcement_type = "General",
  visibility = "Public",
  tags = [],
  expiry_date = null,
  attachment_url = null,
  image_url = null,
}) => {
  const resolvedCategoryId = await resolveCategory(category_id);

  const { rows } = await pool.query(
    `INSERT INTO announcements
      (title, description, category_id, created_by, priority, target_audience, announcement_type, visibility, tags, expiry_date, attachment_url, image_url)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
     RETURNING id`,
    [
      title,
      description,
      resolvedCategoryId,
      created_by || 1,
      priority,
      target_audience,
      announcement_type,
      visibility,
      tags,
      expiry_date,
      attachment_url,
      image_url,
    ]
  );

  return getAnnouncementById(rows[0].id);
};

// Update announcement
export const updateAnnouncement = async (id, data) => {
  const fields = [];
  const values = [];
  let index = 1;

  // Validate category_id if it's being updated
  if ("category_id" in data) {
    data = { ...data, category_id: await resolveCategory(data.category_id) };
  }

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
    RETURNING id;
  `;

  const { rows } = await pool.query(query, values);
  return getAnnouncementById(rows[0].id);
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
export const publishAnnouncement = async (id, userId = null) => {
  await pool.query(
    `UPDATE announcements
     SET status = 'Published',
         published_date = CURRENT_TIMESTAMP,
         published_by = $2,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $1`,
    [id, userId]
  );

  return getAnnouncementById(id);
};

// Unpublish announcement
export const unpublishAnnouncement = async (id) => {
  await pool.query(
    `UPDATE announcements
     SET status = 'Draft',
         published_date = NULL,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $1`,
    [id]
  );

  return getAnnouncementById(id);
};

export default {
  getAllCategories,
  getAllAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  publishAnnouncement,
  unpublishAnnouncement,
};