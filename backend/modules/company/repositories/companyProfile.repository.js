import pool from "../../../config/db.js";

export const getCompanyByIdRepo = async (companyId) => {
  const result = await pool.query(
    `
    SELECT *
    FROM companies
    WHERE id = $1
    `,
    [companyId],
  );

  return result.rows[0];
};

export const updateCompanyRepo = async (companyId, data) => {
  const result = await pool.query(
    `
    UPDATE companies
    SET
      name = $1,
      website = $2,
      industry = $3,
      size = $4,
      description = $5,
      logo_url = $6,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $7
    RETURNING *
    `,
    [
      data.name,
      data.website,
      data.industry,
      data.size,
      data.description,
      data.logo_url,
      companyId,
    ],
  );

  return result.rows[0];
};

export const getTeamMembersRepo = async (companyId) => {
  const result = await pool.query(
    `
    SELECT *
    FROM company_team_members
    WHERE company_id = $1
    ORDER BY created_at DESC
    `,
    [companyId],
  );

  return result.rows;
};

export const createTeamMemberRepo = async (data) => {
  const result = await pool.query(
    `
    INSERT INTO company_team_members (
      company_id,
      full_name,
      email,
      role
    )
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    [data.company_id, data.full_name, data.email, data.role],
  );

  return result.rows[0];
};

export const updateTeamMemberRepo = async (id, data) => {
  const result = await pool.query(
    `
    UPDATE company_team_members
    SET
      role = $1,
      is_active = $2,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $3
    RETURNING *
    `,
    [data.role, data.is_active, id],
  );

  return result.rows[0];
};

export const deleteTeamMemberRepo = async (id) => {
  await pool.query(
    `
    DELETE FROM company_team_members
    WHERE id = $1
    `,
    [id],
  );
};
