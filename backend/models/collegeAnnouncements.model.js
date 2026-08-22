import { pool } from "../config/db.js";
import {
  ANNOUNCEMENT_UPDATE_COLUMNS,
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
  MAX_LIMIT,
} from "../constants/collegeCommunication.constants.js";

// Fetch announcements with Pagination, Search, and Filtering (B2)
export const getAllAnnouncements = async (queryParams = {}) => {
  const {
    page = DEFAULT_PAGE,
    limit = DEFAULT_LIMIT,
    title,
    status,
    priority,
    category_id,
  } = queryParams;

  // Sanitize & Clamp pagination parameters
  const pageNum = Math.max(1, parseInt(page, 10) || DEFAULT_PAGE);
  const limitNum = Math.min(
    MAX_LIMIT,
    Math.max(1, parseInt(limit, 10) || DEFAULT_LIMIT)
  );
  const offset = (pageNum - 1) * limitNum;

  const conditions = [];
  const values = [];
  let paramIndex = 1;

  // Filter: Title / Search
  if (title) {
    conditions.push(`a.title ILIKE $${paramIndex++}`);
    values.push(`%${title}%`);
  }

  // Filter: Status
  if (status) {
    conditions.push(`a.status = $${paramIndex++}`);
    values.push(status);
  }

  // Filter: Priority
  if (priority) {
    conditions.push(`a.priority = $${paramIndex++}`);
    values.push(priority);
  }

  // Filter: Category ID
  if (category_id) {
    conditions.push(`a.category_id = $${paramIndex++}`);
    values.push(parseInt(category_id, 10));
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  // Append limit and offset values to query params
  values.push(limitNum, offset);
  const limitIndex = paramIndex++;
  const offsetIndex = paramIndex++;

  const query = `
    SELECT
        a.*,
        c.name AS category_name,
        COALESCE(u_create.email, 'Admin (' || a.created_by || ')') AS creator_name,
        COALESCE(u_pub.email, 'Admin') AS publisher_name,
        COUNT(*) OVER() AS total_count
     FROM announcements a
     LEFT JOIN announcement_categories c ON a.category_id = c.id
     LEFT JOIN users u_create ON a.created_by = u_create.id
     LEFT JOIN users u_pub ON a.published_by = u_pub.id
     ${whereClause}
     ORDER BY a.created_at DESC
     LIMIT $${limitIndex} OFFSET $${offsetIndex};
  `;

  const { rows } = await pool.query(query, values);

  const total = rows.length > 0 ? parseInt(rows[0].total_count, 10) : 0;
  const totalPages = Math.ceil(total / limitNum) || 0;

  return {
    rows,
    meta: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages,
    },
  };
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

// Update announcement (Protected against SQL Column Injection - B1)
export const updateAnnouncement = async (id, data) => {
  const fields = [];
  const values = [];
  let index = 1;

  // Validate category_id if it's being updated
  if ("category_id" in data) {
    data = { ...data, category_id: await resolveCategory(data.category_id) };
  }

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && ANNOUNCEMENT_UPDATE_COLUMNS.has(key)) {
      fields.push(`${key} = $${index++}`);
      values.push(value);
    }
  });

  if (fields.length === 0) {
    throw new Error("No valid or editable fields provided for update.");
  }

  fields.push(`updated_at = CURRENT_TIMESTAMP`);
  values.push(id);

  const query = `
    UPDATE announcements
    SET ${fields.join(", ")}
    WHERE id = $${index}
    RETURNING id;
  `;

  const { rows } = await pool.query(query, values);
  if (!rows[0]) return null;
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