import { pool } from "../../../config/db.js";

export const createOffer = async (data) => {
  const query = `
    INSERT INTO offers_v2 (
      drive_id,
      candidate_id,
      offer_letter_number,
      gross_ctc,
      net_ctc,
      fixed_component,
      variable_component,
      joining_date,
      offer_document_url,
      offer_status
    )
    VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10
    )
    RETURNING *;
  `;

  const values = [
    data.drive_id,
    data.candidate_id,
    data.offer_letter_number,
    data.gross_ctc,
    data.net_ctc,
    data.fixed_component,
    data.variable_component,
    data.joining_date,
    data.offer_document_url,
    data.offer_status || "SENT",
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const getAllOffers = async () => {
  const { rows } = await pool.query(`
    SELECT *
    FROM offers_v2
    ORDER BY created_at DESC
  `);

  return rows;
};

export const getOfferById = async (id) => {
  const { rows } = await pool.query(
    `
      SELECT *
      FROM offers_v2
      WHERE id = $1
    `,
    [id],
  );

  return rows[0];
};

export const updateOfferStatus = async (id, status) => {
  const { rows } = await pool.query(
    `
      UPDATE offers_v2
      SET
        offer_status = $2,
        updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `,
    [id, status],
  );

  return rows[0];
};

export const deleteOffer = async (id) => {
  const { rows } = await pool.query(
    `
      DELETE FROM offers_v2
      WHERE id = $1
      RETURNING *
    `,
    [id],
  );

  return rows[0];
};
