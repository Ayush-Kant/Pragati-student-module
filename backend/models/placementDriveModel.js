import { pool } from "../config/db.js";

export const getAllPlacementDrives = async () => {
  const result = await pool.query(
    "SELECT * FROM placement_drives ORDER BY drive_date DESC"
  );
  return result.rows;
};

export const getPlacementDriveById = async (id) => {
  const result = await pool.query(
    "SELECT * FROM placement_drives WHERE id = $1",
    [id]
  );
  return result.rows[0];
};

export const createPlacementDrive = async (data) => {
  const { company, role, package: pkg, drive_date, deadline, status } = data;

  const result = await pool.query(
    `INSERT INTO placement_drives
    (company, role, package, drive_date, deadline, status)
    VALUES ($1,$2,$3,$4,$5,$6)
    RETURNING *`,
    [company, role, pkg, drive_date, deadline, status]
  );

  return result.rows[0];
};

export const updatePlacementDrive = async (id, data) => {
  const { company, role, package: pkg, drive_date, deadline, status } = data;

  const result = await pool.query(
    `UPDATE placement_drives
     SET company=$1,
         role=$2,
         package=$3,
         drive_date=$4,
         deadline=$5,
         status=$6,
         updated_at=CURRENT_TIMESTAMP
     WHERE id=$7
     RETURNING *`,
    [company, role, pkg, drive_date, deadline, status, id]
  );

  return result.rows[0];
};

export const deletePlacementDrive = async (id) => {
  const result = await pool.query(
    "DELETE FROM placement_drives WHERE id=$1 RETURNING *",
    [id]
  );

  return result.rows[0];
};

export const searchPlacementDrives = async (query) => {
  const searchPattern = `%${query}%`;

  const result = await pool.query(
    `SELECT *
     FROM placement_drives
     WHERE company ILIKE $1
        OR role ILIKE $1
     ORDER BY drive_date DESC`,
    [searchPattern]
  );

  return result.rows;
};

export const getDriveStatistics = async () => {
  const result = await pool.query(`
    SELECT
      pd.id,
      pd.company,
      pd.role,
      pd.package,
      pd.drive_date,
      pd.deadline,
      pd.status,
      COALESCE(ds.total_applied,0) AS registered_students,
      0 AS eligible_students,
      COALESCE(ds.total_selected,0) AS selected_students,
      0 AS rejected_students
    FROM placement_drives pd
    LEFT JOIN drive_statistics ds
      ON pd.id = ds.drive_id
    ORDER BY pd.drive_date DESC;
  `);

  return result.rows;
};