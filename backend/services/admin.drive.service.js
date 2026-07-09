// admin.drive.service.js

import { pool } from '../config/db.js';

const STAGE_ORDER = [
  'application', 'screening', 'training', 'shortlist', 'interviews', 'selection'
];

// req.user.userId from the JWT is a UUID (auth_users.uuid_id), but foreign key
// columns like created_by / frozen_by reference users.id (a plain integer).
// This looks up the real integer id from the UUID before any insert/update.
const resolveUserIntId = async (uuid) => {
  const result = await pool.query(
    `SELECT users.id
     FROM users
     JOIN auth_users ON auth_users.id = users.auth_user_id
     WHERE auth_users.uuid_id = $1`,
    [uuid]
  );
  return result.rows[0]?.id ?? null;
};

// ----------------------------------------------------
// 1. LIST DRIVES (search, filter, pagination)
// ----------------------------------------------------
export const listDrives = async ({ search, company, status, stage, page = 1, limit = 20 }) => {
  const conditions = [];
  const values = [];
  let i = 1;

  if (search) {
    conditions.push(`d.title ILIKE $${i++}`);
    values.push(`%${search}%`);
  }
  if (company) {
    conditions.push(`c.name ILIKE $${i++}`);
    values.push(`%${company}%`);
  }
  if (status) {
    conditions.push(`d.status = $${i++}`);
    values.push(status);
  }
  if (stage) {
    conditions.push(`d.current_stage = $${i++}`);
    values.push(stage);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const offset = (page - 1) * limit;

  const countResult = await pool.query(
    `SELECT COUNT(*) FROM recruitment_drives d
     JOIN companies c ON c.id = d.company_id
     ${whereClause}`,
    values
  );

  const dataResult = await pool.query(
    `SELECT
        d.id, d.title, d.status, d.current_stage, d.created_at,
        c.id AS company_id, c.name AS company_name,
        (SELECT COUNT(*) FROM student_drive_progress sdp WHERE sdp.drive_id = d.id) AS candidate_count
     FROM recruitment_drives d
     JOIN companies c ON c.id = d.company_id
     ${whereClause}
     ORDER BY d.created_at DESC
     LIMIT $${i++} OFFSET $${i++}`,
    [...values, limit, offset]
  );

  return {
    drives: dataResult.rows.map((row) => ({
      id: `drive_${row.id}`,
      title: row.title,
      company: { id: `comp_${row.company_id}`, name: row.company_name },
      status: row.status,
      currentStage: row.current_stage,
      candidates: parseInt(row.candidate_count, 10),
      createdAt: row.created_at,
    })),
    total: parseInt(countResult.rows[0].count, 10),
  };
};

// ----------------------------------------------------
// 2. CREATE DRIVE
// ----------------------------------------------------
export const createDrive = async ({ title, companyId, criteria, applicationDeadline, createdBy }) => {
  const createdByIntId = await resolveUserIntId(createdBy);

  const result = await pool.query(
    `INSERT INTO recruitment_drives
        (company_id, title, min_gpa, required_skills, max_openings, application_deadline, created_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      companyId,
      title,
      criteria?.minGpa ?? null,
      criteria?.requiredSkills ?? null,
      criteria.maxOpenings,
      applicationDeadline ?? null,
      createdByIntId,
    ]
  );

  const drive = result.rows[0];

  const companyResult = await pool.query(`SELECT name FROM companies WHERE id = $1`, [companyId]);

  return {
    id: `drive_${drive.id}`,
    title: drive.title,
    company: { id: `comp_${companyId}`, name: companyResult.rows[0]?.name ?? null },
    status: drive.status,
    currentStage: drive.current_stage,
    criteria: { minGpa: drive.min_gpa, maxOpenings: drive.max_openings },
    createdAt: drive.created_at,
  };
};

// ----------------------------------------------------
// 3. GET DRIVE BY ID (detail + pipeline counts)
// ----------------------------------------------------
export const getDriveById = async (id) => {
  const driveResult = await pool.query(
    `SELECT d.*, c.name AS company_name,
            a.id AS test_id, a.title AS test_title,
            co.id AS course_id, co.title AS course_title
     FROM recruitment_drives d
     JOIN companies c ON c.id = d.company_id
     LEFT JOIN assessments a ON a.id = d.assigned_test_id
     LEFT JOIN courses co ON co.id = d.assigned_course_id
     WHERE d.id = $1`,
    [id]
  );

  if (!driveResult.rows.length) return null;
  const drive = driveResult.rows[0];

  const pipelineResult = await pool.query(
    `SELECT current_stage, COUNT(*) AS count
     FROM student_drive_progress
     WHERE drive_id = $1
     GROUP BY current_stage`,
    [id]
  );

  // Start every stage at 0, then fill in real counts
  const pipeline = {
    applied: 0, screened: 0, training: 0, shortlisted: 0, interviews: 0, selected: 0,
  };
  const stageToKey = {
    application: 'applied', screening: 'screened', training: 'training',
    shortlist: 'shortlisted', interviews: 'interviews', selection: 'selected',
  };
  pipelineResult.rows.forEach((row) => {
    const key = stageToKey[row.current_stage];
    if (key) pipeline[key] = parseInt(row.count, 10);
  });

  return {
    id: `drive_${drive.id}`,
    title: drive.title,
    company: { id: `comp_${drive.company_id}`, name: drive.company_name },
    status: drive.status,
    currentStage: drive.current_stage,
    criteria: { minGpa: drive.min_gpa, maxOpenings: drive.max_openings },
    pipeline,
    assignedTest: drive.test_id ? { id: `assess_${drive.test_id}`, title: drive.test_title } : null,
    assignedCourse: drive.course_id ? { id: `course_${drive.course_id}`, title: drive.course_title } : null,
  };
};

// ----------------------------------------------------
// 4. UPDATE DRIVE
// ----------------------------------------------------
export const updateDrive = async (id, { title, criteria, applicationDeadline }) => {
  const result = await pool.query(
    `UPDATE recruitment_drives
     SET title = COALESCE($1, title),
         min_gpa = COALESCE($2, min_gpa),
         required_skills = COALESCE($3, required_skills),
         max_openings = COALESCE($4, max_openings),
         application_deadline = COALESCE($5, application_deadline),
         updated_at = NOW()
     WHERE id = $6
     RETURNING *`,
    [
      title ?? null,
      criteria?.minGpa ?? null,
      criteria?.requiredSkills ?? null,
      criteria?.maxOpenings ?? null,
      applicationDeadline ?? null,
      id,
    ]
  );

  if (!result.rows.length) return null;
  const drive = result.rows[0];

  return {
    id: `drive_${drive.id}`,
    title: drive.title,
    updatedAt: drive.updated_at,
  };
};

// ----------------------------------------------------
// 5. ADVANCE DRIVE TO NEXT STAGE
// ----------------------------------------------------
export const advanceDrive = async (id, adminId) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const result = await client.query(
      `SELECT current_stage, frozen FROM recruitment_drives WHERE id = $1 FOR UPDATE`,
      [id]
    );

    if (!result.rows.length) {
      await client.query('ROLLBACK');
      return { error: 'NOT_FOUND' };
    }

    const { current_stage, frozen } = result.rows[0];

    if (frozen) {
      await client.query('ROLLBACK');
      return { error: 'FROZEN' };
    }

    const currentIndex = STAGE_ORDER.indexOf(current_stage);
    if (currentIndex === STAGE_ORDER.length - 1) {
      await client.query('ROLLBACK');
      return { error: 'FINAL_STAGE' };
    }

    const nextStage = STAGE_ORDER[currentIndex + 1];
    const isFinal = nextStage === 'selection';

    await client.query(
      `UPDATE recruitment_drives
       SET current_stage = $1,
           status = $2,
           updated_at = NOW()
       WHERE id = $3`,
      [nextStage, isFinal ? 'completed' : 'active', id]
    );

    await client.query('COMMIT');

    return {
      previousStage: current_stage,
      currentStage: nextStage,
      advancedAt: new Date().toISOString(),
      advancedBy: adminId,
    };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

// ----------------------------------------------------
// 6. FREEZE DRIVE
// ----------------------------------------------------
export const freezeDrive = async (id, adminId) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const frozenByIntId = await resolveUserIntId(adminId);

    const result = await client.query(
      `SELECT frozen FROM recruitment_drives WHERE id = $1 FOR UPDATE`,
      [id]
    );

    if (!result.rows.length) {
      await client.query('ROLLBACK');
      return { error: 'NOT_FOUND' };
    }
    if (result.rows[0].frozen) {
      await client.query('ROLLBACK');
      return { error: 'ALREADY_FROZEN' };
    }

    const updateResult = await client.query(
      `UPDATE recruitment_drives
       SET frozen = TRUE, status = 'frozen', frozen_at = NOW(), frozen_by = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING frozen_at`,
      [frozenByIntId, id]
    );

    await client.query('COMMIT');

    return {
      frozen: true,
      frozenAt: updateResult.rows[0].frozen_at,
      frozenBy: adminId,
    };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

// ----------------------------------------------------
// 7. UNFREEZE DRIVE
// ----------------------------------------------------
export const unfreezeDrive = async (id) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const result = await client.query(
      `SELECT frozen FROM recruitment_drives WHERE id = $1 FOR UPDATE`,
      [id]
    );

    if (!result.rows.length) {
      await client.query('ROLLBACK');
      return { error: 'NOT_FOUND' };
    }
    if (!result.rows[0].frozen) {
      await client.query('ROLLBACK');
      return { error: 'NOT_FROZEN' };
    }

    await client.query(
      `UPDATE recruitment_drives
       SET frozen = FALSE, status = 'active', frozen_at = NULL, frozen_by = NULL, updated_at = NOW()
       WHERE id = $1`,
      [id]
    );

    await client.query('COMMIT');

    return { frozen: false, unfrozenAt: new Date().toISOString() };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

// ----------------------------------------------------
// 8. GET CANDIDATES IN A DRIVE
// ----------------------------------------------------
export const getCandidates = async (driveId, { stage, page = 1, limit = 20 }) => {
  const conditions = [`sdp.drive_id = $1`];
  const values = [driveId];
  let i = 2;

  if (stage) {
    conditions.push(`sdp.current_stage = $${i++}`);
    values.push(stage);
  }

  const whereClause = `WHERE ${conditions.join(' AND ')}`;
  const offset = (page - 1) * limit;

  const countResult = await pool.query(
    `SELECT COUNT(*) FROM student_drive_progress sdp ${whereClause}`,
    values
  );

  const dataResult = await pool.query(
  `SELECT
      sdp.student_id,
      s.name,
      s.college,
      sdp.current_stage,
      sdp.assessment_score,
      sdp.training_completion
   FROM student_drive_progress sdp
   JOIN students s ON s.id = sdp.student_id
   ${whereClause}
   ORDER BY sdp.stage_updated_at DESC
   LIMIT $${i++} OFFSET $${i++}`,
  [...values, limit, offset]
);

  return {
   candidates: dataResult.rows.map((row) => ({
  studentId: `stu_${row.student_id}`,
  name: row.name,
  college: row.college,
  currentStage: row.current_stage,
  assessmentScore: row.assessment_score !== null ? Number(row.assessment_score) : null,
  trainingCompletion: `${row.training_completion ?? 0}%`,
})),
    total: parseInt(countResult.rows[0].count, 10),
  };
};

// ----------------------------------------------------
// 9. MOVE A SINGLE CANDIDATE TO A STAGE
// ----------------------------------------------------
export const moveCandidate = async (driveId, studentId, targetStage) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const driveResult = await client.query(
      `SELECT frozen FROM recruitment_drives WHERE id = $1 FOR UPDATE`,
      [driveId]
    );
    if (!driveResult.rows.length) {
      await client.query('ROLLBACK');
      return { error: 'DRIVE_NOT_FOUND' };
    }
    if (driveResult.rows[0].frozen) {
      await client.query('ROLLBACK');
      return { error: 'FROZEN' };
    }

    const progressResult = await client.query(
      `SELECT current_stage FROM student_drive_progress
       WHERE drive_id = $1 AND student_id = $2 FOR UPDATE`,
      [driveId, studentId]
    );
    if (!progressResult.rows.length) {
      await client.query('ROLLBACK');
      return { error: 'STUDENT_NOT_FOUND' };
    }

    const previousStage = progressResult.rows[0].current_stage;

    await client.query(
      `UPDATE student_drive_progress
       SET current_stage = $1, stage_updated_at = NOW()
       WHERE drive_id = $2 AND student_id = $3`,
      [targetStage, driveId, studentId]
    );

    await client.query('COMMIT');

    return { previousStage, currentStage: targetStage, movedAt: new Date().toISOString() };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

// ----------------------------------------------------
// 10. AUTO-SHORTLIST CANDIDATES BY CRITERIA
// ----------------------------------------------------
export const shortlistCandidates = async (driveId, { minAssessmentScore, minTrainingCompletion, topN }) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const driveResult = await client.query(
      `SELECT frozen FROM recruitment_drives WHERE id = $1 FOR UPDATE`,
      [driveId]
    );
    if (!driveResult.rows.length) {
      await client.query('ROLLBACK');
      return { error: 'NOT_FOUND' };
    }
    if (driveResult.rows[0].frozen) {
      await client.query('ROLLBACK');
      return { error: 'FROZEN' };
    }

    const conditions = [`drive_id = $1`, `current_stage = 'training'`];
    const values = [driveId];
    let i = 2;

    if (minAssessmentScore !== undefined) {
      conditions.push(`assessment_score >= $${i++}`);
      values.push(minAssessmentScore);
    }
    if (minTrainingCompletion !== undefined) {
      conditions.push(`training_completion >= $${i++}`);
      values.push(minTrainingCompletion);
    }

    const evaluatedResult = await client.query(
      `SELECT id FROM student_drive_progress WHERE ${conditions.join(' AND ')}`,
      values
    );
    const totalEvaluated = evaluatedResult.rows.length;

    const topResult = await client.query(
      `SELECT id FROM student_drive_progress
       WHERE ${conditions.join(' AND ')}
       ORDER BY assessment_score DESC NULLS LAST
       LIMIT $${i++}`,
      [...values, topN]
    );

    const idsToShortlist = topResult.rows.map((r) => r.id);

    if (idsToShortlist.length) {
      await client.query(
        `UPDATE student_drive_progress
         SET current_stage = 'shortlist', stage_updated_at = NOW()
         WHERE id = ANY($1::int[])`,
        [idsToShortlist]
      );
    }

    await client.query('COMMIT');

    return { shortlisted: idsToShortlist.length, totalEvaluated };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

// ----------------------------------------------------
// 11. ASSIGN TEST
// ----------------------------------------------------
export const assignTest = async (driveId, assessmentId) => {
  const checkResult = await pool.query(`SELECT id FROM assessments WHERE id = $1`, [assessmentId]);
  if (!checkResult.rows.length) return { error: 'ASSESSMENT_NOT_FOUND' };

  const updateResult = await pool.query(
    `UPDATE recruitment_drives SET assigned_test_id = $1, updated_at = NOW() WHERE id = $2 RETURNING id`,
    [assessmentId, driveId]
  );
  if (!updateResult.rows.length) return { error: 'DRIVE_NOT_FOUND' };

  return { success: true };
};

// ----------------------------------------------------
// 12. ASSIGN COURSE
// ----------------------------------------------------
export const assignCourse = async (driveId, courseId) => {
  const checkResult = await pool.query(`SELECT id FROM courses WHERE id = $1`, [courseId]);
  if (!checkResult.rows.length) return { error: 'COURSE_NOT_FOUND' };

  const updateResult = await pool.query(
    `UPDATE recruitment_drives SET assigned_course_id = $1, updated_at = NOW() WHERE id = $2 RETURNING id`,
    [courseId, driveId]
  );
  if (!updateResult.rows.length) return { error: 'DRIVE_NOT_FOUND' };

  return { success: true };
};