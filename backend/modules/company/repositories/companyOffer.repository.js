import { pool } from "../../../config/db.js";

export const createOffer = async (companyId, data) => {
  let driveId = data.drive_id || data.driveId;
  const studentId = parseInt(String(data.candidate_id || data.candidateId).replace(/\D/g, ''));

  if (isNaN(studentId)) {
    throw new Error("Invalid Candidate ID format");
  }

  if (!driveId) {
    const sdpResult = await pool.query(
      `SELECT drive_id FROM student_drive_progress WHERE student_id = $1 AND company_id = $2 LIMIT 1`,
      [studentId, companyId]
    );
    driveId = sdpResult.rows[0]?.drive_id;
    if (!driveId) {
      throw new Error("Candidate is not registered in any drive for your company");
    }
  }

  const offerLetterNumber = data.offer_letter_number || `OFFER-${Date.now()}`;
  const pckg = data.package || "8 LPA";
  
  let joiningDate = data.joining_date || data.joining;
  if (!joiningDate) {
    const d = new Date();
    d.setDate(d.getDate() + 30); // 30 days from now default
    joiningDate = d.toISOString().split('T')[0];
  }

  const status = data.offer_status || data.status || "PENDING";

  const query = `
    INSERT INTO offers (
      drive_id,
      student_id,
      offer_letter_number,
      package,
      joining_date,
      offer_status
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (drive_id, student_id) 
    DO UPDATE SET 
      package = EXCLUDED.package,
      joining_date = EXCLUDED.joining_date,
      offer_status = EXCLUDED.offer_status,
      updated_at = NOW()
    RETURNING *;
  `;
  const values = [driveId, studentId, offerLetterNumber, pckg, joiningDate, status.toUpperCase()];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const getAllOffers = async (companyId) => {
  const query = `
    SELECT 
      o.id AS "id",
      o.id AS "offerId",
      o.drive_id AS "driveId",
      o.student_id AS "studentId",
      s.name AS "name",
      s.name AS "candidateName",
      d.title AS "role",
      o.package AS "package",
      to_char(o.joining_date, 'YYYY-MM-DD') AS "joining",
      o.offer_status AS "status"
    FROM offers o
    JOIN students s ON s.id = o.student_id
    JOIN recruitment_drives d ON d.id = o.drive_id
    WHERE d.company_id = $1
    ORDER BY o.created_at DESC
  `;
  const { rows } = await pool.query(query, [companyId]);
  return rows;
};

export const getOfferById = async (id, companyId) => {
  const query = `
    SELECT 
      o.id AS "id",
      o.id AS "offerId",
      o.drive_id AS "driveId",
      o.student_id AS "studentId",
      s.name AS "name",
      s.name AS "candidateName",
      d.title AS "role",
      o.package AS "package",
      to_char(o.joining_date, 'YYYY-MM-DD') AS "joining",
      o.offer_status AS "status"
    FROM offers o
    JOIN students s ON s.id = o.student_id
    JOIN recruitment_drives d ON d.id = o.drive_id
    WHERE o.id = $1 AND d.company_id = $2
  `;
  const { rows } = await pool.query(query, [id, companyId]);
  return rows[0];
};

export const updateOfferStatus = async (id, status, companyId) => {
  const query = `
    UPDATE offers o
    SET 
      offer_status = $2,
      updated_at = NOW()
    FROM recruitment_drives d
    WHERE o.id = $1 AND d.id = o.drive_id AND d.company_id = $3
    RETURNING o.id, o.offer_status AS "status";
  `;
  const { rows } = await pool.query(query, [id, status.toUpperCase(), companyId]);
  return rows[0];
};

export const deleteOffer = async (id, companyId) => {
  const query = `
    DELETE FROM offers o
    USING recruitment_drives d
    WHERE o.id = $1 AND d.id = o.drive_id AND d.company_id = $2
    RETURNING o.id;
  `;
  const { rows } = await pool.query(query, [id, companyId]);
  return rows[0];
};
