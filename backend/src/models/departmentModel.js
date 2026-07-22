import pool from '../../config/db.js';

/**
 * Retrieves all departments ordered by their ID.
 * @returns {Promise<Array>} Array of department objects
 */
export const getDepartments = async () => {
  const query = 'SELECT * FROM departments ORDER BY dept_id ASC';
  const result = await pool.query(query);
  return result.rows;
};

/**
 * Creates a new department in the database.
 * @param {string} name - The name of the department
 * @param {string[]} courses - Array of course names
 * @returns {Promise<Object>} The newly created department object
 */
export const createDepartment = async (name, courses) => {
  const query = `
    INSERT INTO departments (name, courses) 
    VALUES ($1, $2) 
    RETURNING *;
  `;
  const result = await pool.query(query, [name, courses]);
  return result.rows[0];
};

/**
 * Updates an existing department.
 * @param {number|string} id - The department ID
 * @param {string} name - The updated name
 * @param {string[]} courses - The updated array of course names
 * @returns {Promise<Object>} The updated department object
 */
export const updateDepartment = async (id, name, courses) => {
  const query = `
    UPDATE departments 
    SET name = $1, courses = $2 
    WHERE dept_id = $3 
    RETURNING *;
  `;
  const result = await pool.query(query, [name, courses, id]);
  return result.rows[0];
};

/**
 * Deletes a department by ID.
 * @param {number|string} id - The department ID
 * @returns {Promise<Object>} The deleted department object or undefined if not found
 */
export const deleteDepartment = async (id) => {
  const query = `
    DELETE FROM departments 
    WHERE dept_id = $1 
    RETURNING *;
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};
