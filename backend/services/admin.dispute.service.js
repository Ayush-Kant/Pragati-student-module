// admin.dispute.service.js

import { pool } from '../config/db.js';

const buildTimeline = (dispute, notes) => {
  const events = [];
  events.push({ event: 'created', status: 'open', actor: dispute.filed_by_id, timestamp: dispute.created_at });
  if (dispute.review_started_at) {
    events.push({ event: 'review_started', status: 'in_review', actor: dispute.reviewed_by, timestamp: dispute.review_started_at });
  }
  notes.forEach((n) => {
    events.push({ event: 'note_added', note: n.note, actor: n.added_by, timestamp: n.created_at });
  });
  if (dispute.escalated_at) {
    events.push({ event: 'escalated', status: 'escalated', actor: dispute.escalated_by, timestamp: dispute.escalated_at });
  }
  if (dispute.resolved_at) {
    events.push({ event: 'resolved', status: 'resolved', actor: dispute.resolved_by, resolution: dispute.resolution, timestamp: dispute.resolved_at });
  }
  return events.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
};

const listDisputes = async ({ type, status, priority, page = 1, limit = 20 }) => {
  page = parseInt(page) || 1;
  limit = Math.min(parseInt(limit) || 20, 100);
  const offset = (page - 1) * limit;

  let query = `SELECT * FROM disputes WHERE 1=1`;
  let countQuery = `SELECT COUNT(*)::int AS total FROM disputes WHERE 1=1`;
  let values = [];

  if (type) {
    values.push(type);
    query += ` AND dispute_type = $${values.length}`;
    countQuery += ` AND dispute_type = $${values.length}`;
  }
  if (status) {
    values.push(status);
    query += ` AND status = $${values.length}`;
    countQuery += ` AND status = $${values.length}`;
  }
  if (priority) {
    values.push(priority);
    query += ` AND priority = $${values.length}`;
    countQuery += ` AND priority = $${values.length}`;
  }

  const countResult = await pool.query(countQuery, values);
  const total = countResult.rows[0].total;

  values.push(limit);
  values.push(offset);
  query += ` ORDER BY created_at DESC LIMIT $${values.length - 1} OFFSET $${values.length}`;

  const result = await pool.query(query, values);
  return { disputes: result.rows, total, page, limit };
};

const getDisputeById = async (id) => {
  const disputeResult = await pool.query(`SELECT * FROM disputes WHERE id = $1`, [id]);
  if (disputeResult.rows.length === 0) return null;
  const dispute = disputeResult.rows[0];

  const notesResult = await pool.query(
    `SELECT * FROM dispute_notes WHERE dispute_id = $1 ORDER BY created_at ASC`,
    [id]
  );

  return { ...dispute, adminNotes: notesResult.rows, timeline: buildTimeline(dispute, notesResult.rows) };
};

const markInReview = async (id, reviewerId) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const existing = await client.query(`SELECT * FROM disputes WHERE id = $1`, [id]);
    if (existing.rows.length === 0) { await client.query('ROLLBACK'); return null; }
    const dispute = existing.rows[0];
    if (dispute.status !== 'open') {
      await client.query('ROLLBACK');
      return { invalidTransition: true, currentStatus: dispute.status };
    }
    const result = await client.query(
      `UPDATE disputes SET status='in_review', reviewed_by=$1, review_started_at=NOW(), updated_at=NOW() WHERE id=$2 RETURNING *`,
      [reviewerId, id]
    );
    await client.query('COMMIT');
    return result.rows[0];
  } catch (err) {
    await client.query('ROLLBACK'); throw err;
  } finally { client.release(); }
};

const resolveDispute = async (id, resolution, resolverId) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const existing = await client.query(`SELECT * FROM disputes WHERE id = $1`, [id]);
    if (existing.rows.length === 0) { await client.query('ROLLBACK'); return null; }
    const dispute = existing.rows[0];
    if (dispute.status !== 'in_review') {
      await client.query('ROLLBACK');
      return { invalidTransition: true, currentStatus: dispute.status };
    }
    const result = await client.query(
      `UPDATE disputes SET status='resolved', resolution=$1, resolved_by=$2, resolved_at=NOW(), updated_at=NOW() WHERE id=$3 RETURNING *`,
      [resolution, resolverId, id]
    );
    await client.query('COMMIT');
    return result.rows[0];
  } catch (err) {
    await client.query('ROLLBACK'); throw err;
  } finally { client.release(); }
};

const escalateDispute = async (id, reason, escalatorId) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const existing = await client.query(`SELECT * FROM disputes WHERE id = $1`, [id]);
    if (existing.rows.length === 0) { await client.query('ROLLBACK'); return null; }
    const dispute = existing.rows[0];
    if (dispute.status === 'resolved' || dispute.status === 'escalated') {
      await client.query('ROLLBACK');
      return { invalidTransition: true, currentStatus: dispute.status };
    }
    const result = await client.query(
      `UPDATE disputes SET status='escalated', priority='urgent', escalated_by=$1, escalated_at=NOW(), updated_at=NOW() WHERE id=$2 RETURNING *`,
      [escalatorId, id]
    );
    await client.query(
      `INSERT INTO dispute_notes (dispute_id, note, added_by) VALUES ($1, $2, $3)`,
      [id, `Escalated: ${reason}`, escalatorId]
    );
    await client.query('COMMIT');
    return result.rows[0];
  } catch (err) {
    await client.query('ROLLBACK'); throw err;
  } finally { client.release(); }
};

const addInternalNote = async (id, note, adminId) => {
  const existing = await pool.query(`SELECT id FROM disputes WHERE id = $1`, [id]);
  if (existing.rows.length === 0) return null;
  const result = await pool.query(
    `INSERT INTO dispute_notes (dispute_id, note, added_by) VALUES ($1, $2, $3) RETURNING *`,
    [id, note, adminId]
  );
  return result.rows[0];
};

export {
  listDisputes, getDisputeById, markInReview,
  resolveDispute, escalateDispute, addInternalNote
};