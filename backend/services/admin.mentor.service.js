import { pool } from '../config/db.js';
import bcrypt from 'bcrypt';
import { 
  sendMentorWelcomeEmail, 
  sendBatchAssignmentEmail, 
  sendReplacementNotificationEmail 
} from './mentor.email.service.js';

export const listMentors = async ({ search, expertise, ratingMin, active, page = 1, limit = 20 }) => {
  const parsedPage = parseInt(page) || 1;
  const parsedLimit = parseInt(limit) || 20;
  const offset = (parsedPage - 1) * parsedLimit;

  let query = `
    SELECT m.*, COALESCE(COUNT(mba.id) FILTER (WHERE mba.status = 'active'), 0)::INTEGER AS "activeBatches"
    FROM mentors m
    LEFT JOIN mentor_batch_assignments mba ON m.id = mba.mentor_id
    WHERE 1=1
  `;
  const values = [];

  if (active !== undefined && active !== '') {
    values.push(active === 'true' || active === true);
    query += ` AND m.is_active = $${values.length}`;
  }

  if (search) {
    values.push(`%${search}%`);
    query += ` AND (m.name ILIKE $${values.length} OR m.email ILIKE $${values.length})`;
  }

  if (expertise) {
    values.push(expertise);
    query += ` AND $${values.length} = ANY(m.expertise)`;
  }

  if (ratingMin) {
    values.push(parseFloat(ratingMin));
    query += ` AND m.rating >= $${values.length}`;
  }

  query += ` GROUP BY m.id`;

  // Get total count
  const countQuery = `SELECT COUNT(*)::INTEGER FROM (${query}) AS temp`;
  const countResult = await pool.query(countQuery, values);
  const total = countResult.rows[0].count;

  // Add order, limit, offset
  values.push(parsedLimit);
  values.push(offset);
  query += ` ORDER BY m.id DESC LIMIT $${values.length - 1} OFFSET $${values.length}`;

  const result = await pool.query(query, values);

  return {
    mentors: result.rows,
    total,
    page: parsedPage,
    limit: parsedLimit
  };
};

export const getMentorById = async (id) => {
  const mentorRes = await pool.query('SELECT * FROM mentors WHERE id = $1', [id]);
  if (mentorRes.rows.length === 0) return null;
  const mentor = mentorRes.rows[0];

  const assignmentsRes = await pool.query(`
    SELECT mba.*, rd.title AS "driveTitle"
    FROM mentor_batch_assignments mba
    LEFT JOIN recruitment_drives rd ON mba.drive_id = rd.id
    WHERE mba.mentor_id = $1
    ORDER BY mba.assigned_at DESC
  `, [id]);

  mentor.batchHistory = assignmentsRes.rows;
  return mentor;
};

export const getMentorPerf = async (id) => {
  const mentorRes = await pool.query(
    'SELECT id, rating, total_reviews, completion_rate, avg_assignment_score FROM mentors WHERE id = $1',
    [id]
  );
  if (mentorRes.rows.length === 0) return null;
  const metrics = mentorRes.rows[0];

  const feedbackRes = await pool.query(`
    SELECT mf.*, u.full_name AS "studentName"
    FROM mentor_feedback mf
    LEFT JOIN users u ON mf.student_id = u.id
    WHERE mf.mentor_id = $1
    ORDER BY mf.submitted_at DESC
    LIMIT 5
  `, [id]);

  return {
    metrics,
    recentFeedback: feedbackRes.rows
  };
};

export const registerMentor = async ({ name, email, password, expertise, bio, phone }) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Check conflict
    const conflictRes = await client.query('SELECT id FROM auth_users WHERE email = $1', [email]);
    if (conflictRes.rows.length > 0) {
      const err = new Error('Email already exists');
      err.code = 409;
      throw err;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Insert into auth_users
    const authRes = await client.query(
      `INSERT INTO auth_users (email, password_hash, role) 
       VALUES ($1, $2, 'mentor') 
       RETURNING id`,
      [email, hashedPassword]
    );
    const authUserId = authRes.rows[0].id;

    // Insert into users
    const userRes = await client.query(
      `INSERT INTO users (full_name, auth_user_id, email, role) 
       VALUES ($1, $2, $3, 'mentor') 
       RETURNING id`,
      [name, authUserId, email]
    );
    const userId = userRes.rows[0].id;

    // Insert into mentors
    const mentorRes = await client.query(
      `INSERT INTO mentors (user_id, name, email, phone, bio, expertise, is_active) 
       VALUES ($1, $2, $3, $4, $5, $6, TRUE) 
       RETURNING *`,
      [userId, name, email, phone || null, bio || null, expertise]
    );
    const mentor = mentorRes.rows[0];

    await client.query('COMMIT');

    // Trigger welcome email asynchronously
    sendMentorWelcomeEmail(email, name);

    return mentor;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const assignMentor = async (id, { courseId, batchId, driveId, title }) => {
  const mentorRes = await pool.query('SELECT * FROM mentors WHERE id = $1 AND is_active = TRUE', [id]);
  if (mentorRes.rows.length === 0) {
    const err = new Error('Mentor not found or inactive');
    err.code = 404;
    throw err;
  }
  const mentor = mentorRes.rows[0];

  // Insert assignment
  let finalDriveId = driveId;
  if (!finalDriveId) {
    const defaultDriveRes = await pool.query("SELECT id FROM recruitment_drives LIMIT 1");
    if (defaultDriveRes.rows.length > 0) {
      finalDriveId = defaultDriveRes.rows[0].id;
    } else {
      const err = new Error("No recruitment drive exists to assign this batch to");
      err.code = 400;
      throw err;
    }
  }

  const assignmentRes = await pool.query(
    `INSERT INTO mentor_batch_assignments (mentor_id, drive_id, course_id, batch_id, title, status)
     VALUES ($1, $2, $3, $4, $5, 'active')
     RETURNING *`,
    [id, finalDriveId, courseId, batchId, title || `Batch ${batchId}`]
  );


  const assignment = assignmentRes.rows[0];

  // Trigger email notification asynchronously
  sendBatchAssignmentEmail(mentor.email, mentor.name, assignment.title);

  return assignment;
};

export const replaceMentor = async (id, { newMentorId, batchId, reason }) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Verify old mentor exists
    const oldMentorRes = await client.query('SELECT * FROM mentors WHERE id = $1', [id]);
    if (oldMentorRes.rows.length === 0) {
      const err = new Error('Current mentor not found');
      err.code = 404;
      throw err;
    }
    const oldMentor = oldMentorRes.rows[0];

    // Verify new mentor exists and is active
    const newMentorRes = await client.query('SELECT * FROM mentors WHERE id = $1 AND is_active = TRUE', [newMentorId]);
    if (newMentorRes.rows.length === 0) {
      const err = new Error('New mentor not found or inactive');
      err.code = 400;
      throw err;
    }
    const newMentor = newMentorRes.rows[0];

    // Find active assignment for this batch
    const assignmentRes = await client.query(
      `SELECT * FROM mentor_batch_assignments 
       WHERE mentor_id = $1 AND batch_id = $2 AND status = 'active'`,
      [id, batchId]
    );

    if (assignmentRes.rows.length === 0) {
      const err = new Error('Active batch assignment not found for this mentor');
      err.code = 404;
      throw err;
    }
    const activeAssignment = assignmentRes.rows[0];

    // Update old assignment to status = 'replaced'
    await client.query(
      `UPDATE mentor_batch_assignments 
       SET status = 'replaced' 
       WHERE id = $1`,
      [activeAssignment.id]
    );

    // Insert new assignment
    const newAssignmentRes = await client.query(
      `INSERT INTO mentor_batch_assignments (mentor_id, drive_id, course_id, batch_id, title, status)
       VALUES ($1, $2, $3, $4, $5, 'active')
       RETURNING *`,
      [newMentorId, activeAssignment.drive_id, activeAssignment.course_id, batchId, activeAssignment.title]
    );

    await client.query('COMMIT');

    // Notify old mentor of replacement
    sendReplacementNotificationEmail(oldMentor.email, oldMentor.name, activeAssignment.title);

    // Notify new mentor of assignment
    sendBatchAssignmentEmail(newMentor.email, newMentor.name, activeAssignment.title);

    return newAssignmentRes.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const removeMentor = async (id) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Check mentor exists
    const mentorRes = await client.query('SELECT * FROM mentors WHERE id = $1 AND is_active = TRUE', [id]);
    if (mentorRes.rows.length === 0) {
      const err = new Error('Mentor not found or already removed');
      err.code = 404;
      throw err;
    }

    // Soft delete mentor
    await client.query(
      `UPDATE mentors 
       SET is_active = FALSE 
       WHERE id = $1`,
      [id]
    );

    // Set all active assignments of this mentor to 'replaced'
    await client.query(
      `UPDATE mentor_batch_assignments 
       SET status = 'replaced' 
       WHERE mentor_id = $1 AND status = 'active'`,
      [id]
    );

    await client.query('COMMIT');

    return {
      success: true,
      message: "Mentor removed from platform.",
      mentorId: id,
      removedAt: new Date().toISOString()
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};