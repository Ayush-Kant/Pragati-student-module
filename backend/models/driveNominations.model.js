import { pool } from '../config/db.js';
import { MIN_CGPA_FOR_ELIGIBILITY } from '../constants/collegeStudentNominations.constants.js';

// ─── Eligible Students for a Drive ───────────────────────────────────────────
// Queries the eligible_students VIEW (backed by the students table) so that
// every student added to the student database is automatically included.
// Filters by:
//   - drive's CGPA cutoff (falls back to MIN_CGPA_FOR_ELIGIBILITY)
//   - drive's allowed_branches (skipped when no eligibility row exists)
//   - placement_status != 'Placed'
//   - optional college_id so each college only sees their own students
export const getEligibleForDrive = async (driveId, collegeId = null) => {
  const params = [driveId, MIN_CGPA_FOR_ELIGIBILITY];
  let collegeFilter = '';
  if (collegeId) {
    params.push(collegeId);
    collegeFilter = `AND es.college_id = $${params.length}`;
  }

  const result = await pool.query(
    `SELECT
       es.*,
       CASE WHEN dn.id IS NOT NULL THEN true ELSE false END AS already_nominated
     FROM eligible_students es
     LEFT JOIN drive_nominations dn
       ON dn.student_id = es.id AND dn.drive_id = $1
     WHERE
       es.placement_status != 'Placed'
       ${collegeFilter}
       AND es.cgpa >= (
         SELECT COALESCE(MAX(de.cgpa_cutoff), $2)
         FROM drive_eligibility de
         WHERE de.drive_id = $1
       )
       AND (
         -- pass if drive has no branch restrictions
         NOT EXISTS (
           SELECT 1 FROM drive_eligibility
           WHERE drive_id = $1
             AND allowed_branches IS NOT NULL
             AND array_length(allowed_branches, 1) > 0
         )
         OR es.department = ANY(
           SELECT UNNEST(allowed_branches)
           FROM drive_eligibility
           WHERE drive_id = $1
         )
       )
     ORDER BY es.cgpa DESC`,
    params
  );
  return result.rows;
};

// ─── Get Drive Nominees (registered / pending approval) ──────────────────────
export const getDriveNominees = async (driveId) => {
  const result = await pool.query(
    `SELECT
       dn.*,
       es.name           AS student_name,
       es.enrollment_no,
       es.department,
       es.course,
       es.cgpa,
       es.batch,
       es.email,
       es.skills
     FROM drive_nominees dn
     JOIN eligible_students es ON es.id = dn.student_id
     WHERE dn.drive_id = $1
     ORDER BY dn.registered_at DESC`,
    [driveId]
  );
  return result.rows;
};

// ─── Approve / Reject a nominee's eligibility ────────────────────────────────
export const setNomineeEligibility = async (driveId, studentId, approved, approvedBy) => {
  const status = approved ? 'Approved' : 'Rejected';
  const result = await pool.query(
    `INSERT INTO drive_nominees (drive_id, student_id, status, approved_by)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (drive_id, student_id)
     DO UPDATE SET
       status      = EXCLUDED.status,
       approved_by = EXCLUDED.approved_by,
       updated_at  = NOW()
     RETURNING *`,
    [driveId, studentId, status, approvedBy]
  );
  return result.rows[0];
};

// ─── Get all nominations for a drive (paginated) ─────────────────────────────
export const getDriveNominations = async (driveId, { status, limit, offset } = {}) => {
  const params = [driveId];
  let statusFilter = '';
  if (status) {
    params.push(status);
    statusFilter = `AND dn.status = $${params.length}`;
  }

  const countRes = await pool.query(
    `SELECT COUNT(*)
     FROM drive_nominations dn
     WHERE dn.drive_id = $1 ${statusFilter}`,
    params
  );
  const total = parseInt(countRes.rows[0].count);

  const dataParams = [...params, limit ?? 100, offset ?? 0];

  const result = await pool.query(
    `SELECT
       dn.*,
       es.name           AS student_name,
       es.enrollment_no,
       es.department,
       es.course,
       es.cgpa,
       es.batch,
       es.email,
       pd.company,
       pd.role,
       pd.package
     FROM drive_nominations dn
     JOIN eligible_students   es ON es.id    = dn.student_id
     JOIN placement_drives    pd ON pd.id    = dn.drive_id
     WHERE dn.drive_id = $1
     ${statusFilter}
     ORDER BY dn.nominated_at DESC
     LIMIT $${dataParams.length - 1} OFFSET $${dataParams.length}`,
    dataParams
  );

  return { rows: result.rows, total };
};

// ─── Nominate multiple students to a drive (bulk) ────────────────────────────
export const nominateStudentsToDrive = async (driveId, studentIds, nominatedBy) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const result = await client.query(
      `INSERT INTO drive_nominations (drive_id, student_id, nominated_by, status)
       SELECT $1, unnest($2::int[]), $3, 'Nominated'
       ON CONFLICT (drive_id, student_id) DO NOTHING
       RETURNING *`,
      [driveId, studentIds, nominatedBy]
    );

    const inserted = result.rows;

    const allResult = await client.query(
      `SELECT student_id, status FROM drive_nominations WHERE drive_id = $1`,
      [driveId]
    );
    const nominatedIds = new Set(inserted.map(r => r.student_id));
    const skipped = allResult.rows
      .filter(r => !nominatedIds.has(r.student_id))
      .map(r => ({
        studentId: r.student_id,
        reason: 'Already nominated',
        existingStatus: r.status,
      }));

    await client.query(
      `UPDATE drive_statistics SET total_applied = (
         SELECT COUNT(*) FROM drive_nominations WHERE drive_id = $1 AND status != 'Withdrawn'
       ) WHERE drive_id = $1`,
      [driveId]
    );

    await client.query('COMMIT');
    return { inserted, skipped };
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('nominateStudentsToDrive error:', err.message, err.stack?.split('\n')[1]);
    throw err;
  } finally {
    client.release();
  }
};

// ─── Shortlist multiple nominated students for a drive (bulk) ────────────────
export const shortlistStudentsForDrive = async (driveId, studentIds, shortlistedBy) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const existingRes = await client.query(
      `SELECT student_id, id AS nomination_id FROM drive_nominations
       WHERE drive_id = $1 AND student_id = ANY($2::int[]) AND status = 'Nominated'`,
      [driveId, studentIds]
    );

    const existingIds = new Set(existingRes.rows.map(r => r.student_id));

    const shortlisted = [];
    const skipped = [];

    if (existingRes.rows.length > 0) {
      await client.query(
        `UPDATE drive_nominations
         SET status = 'Shortlisted', updated_at = NOW()
         WHERE drive_id = $1 AND student_id = ANY($2::int[]) AND status = 'Nominated'`,
        [driveId, studentIds]
      );

      const slResult = await client.query(
        `INSERT INTO drive_shortlists (drive_id, nomination_id, student_id, shortlisted_by, status)
         SELECT $1, dn.id, dn.student_id, $2, 'Shortlisted'
         FROM drive_nominations dn
         WHERE dn.drive_id = $1 AND dn.student_id = ANY($3::int[]) AND dn.status = 'Shortlisted'
         ON CONFLICT (drive_id, student_id)
         DO UPDATE SET status = 'Shortlisted', shortlisted_by = EXCLUDED.shortlisted_by, updated_at = NOW()
         RETURNING *`,
        [driveId, shortlistedBy, studentIds]
      );

      shortlisted.push(...slResult.rows);
    }

    for (const studentId of studentIds) {
      if (!existingIds.has(studentId)) {
        skipped.push({ studentId, reason: 'No nomination found for this drive' });
      }
    }

    await client.query(
      `UPDATE drive_statistics SET total_selected = (
         SELECT COUNT(*) FROM drive_nominations WHERE drive_id = $1 AND status = 'Selected'
       ) WHERE drive_id = $1`,
      [driveId]
    );

    await client.query('COMMIT');
    return { shortlisted, skipped };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};
