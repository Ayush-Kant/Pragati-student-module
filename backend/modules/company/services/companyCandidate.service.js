import { pool } from '../../../config/db.js';

export const listCandidates = async (companyId, filters = {}) => {
  let query = `
    SELECT 
      sdp.id AS "id",
      sdp.student_id AS "studentId",
      s.name AS "name",
      s.email AS "email",
      s.phone AS "phone",
      COALESCE(s.gpa, 0.00) AS "gpa",
      s.skills AS "skills",
      s.college AS "college",
      s.resume_url AS "resume",
      s.graduation_year AS "graduationYear",
      s.address AS "location",
      COALESCE(sdp.assessment_score, 0.00) AS "score",
      sdp.current_stage AS "current_stage",
      sdp.stage AS "status",
      COALESCE(sdp.training_completion, 0.00) AS "trainingProgress",
      sdp.notes AS "notes",
      sdp.interview_feedback AS "feedback"
    FROM student_drive_progress sdp
    JOIN students s ON s.id = sdp.student_id
    JOIN recruitment_drives rd ON rd.id = sdp.drive_id
    WHERE sdp.company_id = $1
  `;
  
  const values = [companyId];
  let paramCount = 1;

  if (filters.skills) {
    paramCount++;
    query += ` AND $${paramCount} = ANY(s.skills)`;
    values.push(filters.skills);
  }

  if (filters.college) {
    paramCount++;
    query += ` AND s.college ILIKE $${paramCount}`;
    values.push(`%${filters.college}%`);
  }

  if (filters.gpa) {
    paramCount++;
    query += ` AND s.gpa >= $${paramCount}`;
    values.push(parseFloat(filters.gpa));
  }

  if (filters.assessmentScore) {
    paramCount++;
    query += ` AND sdp.assessment_score >= $${paramCount}`;
    values.push(parseFloat(filters.assessmentScore));
  }

  if (filters.location) {
    paramCount++;
    query += ` AND s.address ILIKE $${paramCount}`;
    values.push(`%${filters.location}%`);
  }

  if (filters.search) {
    paramCount++;
    query += ` AND (s.name ILIKE $${paramCount} OR s.college ILIKE $${paramCount} OR s.email ILIKE $${paramCount})`;
    values.push(`%${filters.search}%`);
  }

  if (filters.status) {
    paramCount++;
    query += ` AND sdp.stage = $${paramCount}`;
    values.push(filters.status);
  }

  query += ` ORDER BY sdp.created_at DESC`;

  const result = await pool.query(query, values);
  
  return result.rows.map(row => {
    const avatar = row.name
      ? row.name.split(' ').map(n => n[0]).join('').toUpperCase()
      : 'C';
    return { ...row, avatar };
  });
};

export const getCandidateById = async (candidateId, companyId) => {
  const query = `
    SELECT 
      sdp.id AS "id",
      sdp.student_id AS "studentId",
      s.name AS "name",
      s.email AS "email",
      s.phone AS "phone",
      COALESCE(s.gpa, 0.00) AS "gpa",
      s.skills AS "skills",
      s.college AS "college",
      s.resume_url AS "resume",
      s.graduation_year AS "graduationYear",
      s.address AS "location",
      COALESCE(sdp.assessment_score, 0.00) AS "score",
      sdp.current_stage AS "current_stage",
      sdp.stage AS "status",
      COALESCE(sdp.training_completion, 0.00) AS "trainingProgress",
      sdp.notes AS "notes",
      sdp.interview_feedback AS "feedback"
    FROM student_drive_progress sdp
    JOIN students s ON s.id = sdp.student_id
    WHERE sdp.id = $1 AND sdp.company_id = $2
  `;

  const result = await pool.query(query, [candidateId, companyId]);
  if (result.rows.length === 0) return null;

  const row = result.rows[0];
  const avatar = row.name
    ? row.name.split(' ').map(n => n[0]).join('').toUpperCase()
    : 'C';

  return { ...row, avatar };
};

export const shortlistCandidate = async (candidateId, companyId) => {
  const query = `
    UPDATE student_drive_progress
    SET current_stage = 'shortlist', stage = 'Shortlisted', stage_updated_at = NOW()
    WHERE id = $1 AND company_id = $2
    RETURNING *
  `;
  const result = await pool.query(query, [candidateId, companyId]);
  return result.rows[0] || null;
};

export const rejectCandidate = async (candidateId, companyId) => {
  const query = `
    UPDATE student_drive_progress
    SET stage = 'Rejected', stage_updated_at = NOW()
    WHERE id = $1 AND company_id = $2
    RETURNING *
  `;
  const result = await pool.query(query, [candidateId, companyId]);
  return result.rows[0] || null;
};

export const moveCandidateStage = async (candidateId, companyId, currentStage, stage, notes) => {
  let query = `UPDATE student_drive_progress SET stage_updated_at = NOW()`;
  const values = [];
  let count = 0;

  if (currentStage) {
    count++;
    query += `, current_stage = $${count}`;
    values.push(currentStage);
  }

  if (stage) {
    count++;
    query += `, stage = $${count}`;
    values.push(stage);
  }

  if (notes !== undefined) {
    count++;
    query += `, notes = $${count}`;
    values.push(notes);
  }

  count++;
  query += ` WHERE id = $${count}`;
  values.push(candidateId);

  count++;
  query += ` AND company_id = $${count}`;
  values.push(companyId);

  query += ` RETURNING *`;

  const result = await pool.query(query, values);
  return result.rows[0] || null;
};

export const bulkShortlistCandidates = async (ids, companyId) => {
  const query = `
    UPDATE student_drive_progress
    SET current_stage = 'shortlist', stage = 'Shortlisted', stage_updated_at = NOW()
    WHERE id = ANY($1::int[]) AND company_id = $2
    RETURNING id
  `;
  const result = await pool.query(query, [ids, companyId]);
  return result.rows;
};

export const bulkRejectCandidates = async (ids, companyId) => {
  const query = `
    UPDATE student_drive_progress
    SET stage = 'Rejected', stage_updated_at = NOW()
    WHERE id = ANY($1::int[]) AND company_id = $2
    RETURNING id
  `;
  const result = await pool.query(query, [ids, companyId]);
  return result.rows;
};

export const bulkMoveCandidatesStage = async (ids, companyId, currentStage, stage) => {
  const query = `
    UPDATE student_drive_progress
    SET current_stage = COALESCE($1, current_stage), 
        stage = COALESCE($2, stage), 
        stage_updated_at = NOW()
    WHERE id = ANY($3::int[]) AND company_id = $4
    RETURNING id
  `;
  const result = await pool.query(query, [currentStage, stage, ids, companyId]);
  return result.rows;
};
