import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { pool } from '../config/db.js';

const router = express.Router();

router.use(authMiddleware);

/**
 * GET /api/companies/list
 * Lightweight company list for dropdowns — accessible to any authenticated role.
 * Returns only id, name, industry, logo_url.
 * Optional query params:
 *   ?search=   — filter by name (case-insensitive prefix)
 *   ?status=   — filter by status (default: approved)
 */
router.get('/list', async (req, res, next) => {
  try {
    const { search, status = 'approved' } = req.query;

    const params = [];
    const conditions = [];

    if (status !== 'all') {
      params.push(status);
      conditions.push(`status = $${params.length}`);
    }

    if (search && search.trim()) {
      params.push(`%${search.trim()}%`);
      conditions.push(`name ILIKE $${params.length}`);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const result = await pool.query(
      `SELECT id, name, industry, logo_url
       FROM companies
       ${where}
       ORDER BY name ASC
       LIMIT 100`,
      params
    );

    return res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
