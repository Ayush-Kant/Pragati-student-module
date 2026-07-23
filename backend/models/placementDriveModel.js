import { pool } from "../config/db.js";

const BASE_DRIVE_QUERY = `
  SELECT 
    pd.id,
    pd.company,
    pd.role,
    pd.package,
    pd.drive_date,
    pd.deadline,
    pd.status,
    pd.created_at,
    pd.updated_at,
    de.cgpa_cutoff,
    de.allowed_branches,
    COALESCE(ds.total_applied, 0) AS total_applied,
    COALESCE(ds.total_selected, 0) AS total_selected,
    COALESCE(
      (
        SELECT json_agg(
          json_build_object(
            'id', ir.id,
            'round_name', ir.round_name,
            'description', ir.description,
            'round_order', ir.round_order
          ) ORDER BY ir.round_order ASC
        )
        FROM interview_rounds ir
        WHERE ir.drive_id = pd.id
      ),
      '[]'::json
    ) AS rounds
  FROM placement_drives pd
  LEFT JOIN drive_eligibility de ON pd.id = de.drive_id
  LEFT JOIN drive_statistics ds ON pd.id = ds.drive_id
`;

export const getAllPlacementDrives = async () => {
  const result = await pool.query(
    `${BASE_DRIVE_QUERY} ORDER BY pd.drive_date DESC`
  );
  return result.rows;
};

export const getPlacementDriveById = async (id) => {
  const result = await pool.query(
    `${BASE_DRIVE_QUERY} WHERE pd.id = $1`,
    [id]
  );
  return result.rows[0];
};

export const createPlacementDrive = async (data) => {
  const { company, role, package: pkg, drive_date, deadline, status, eligibility, rounds } = data;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const driveResult = await client.query(
      `INSERT INTO placement_drives
      (company, role, package, drive_date, deadline, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [company, role, pkg, drive_date, deadline, status || "Upcoming"]
    );

    const newDrive = driveResult.rows[0];

    // Insert Eligibility if provided
    if (eligibility) {
      const cgpa = eligibility.cgpa !== undefined ? eligibility.cgpa : 6.0;
      let branches = eligibility.department || [];
      if (typeof branches === "string") {
        branches = branches.split(",").map((b) => b.trim());
      }
      await client.query(
        `INSERT INTO drive_eligibility (drive_id, cgpa_cutoff, allowed_branches)
         VALUES ($1, $2, $3)`,
        [newDrive.id, cgpa, branches]
      );
    }

    // Insert Rounds if provided
    if (Array.isArray(rounds) && rounds.length > 0) {
      for (let i = 0; i < rounds.length; i++) {
        const r = rounds[i];
        const roundName = r.round_name || r.name || `Round ${i + 1}`;
        const desc = r.description || "";
        const order = r.round_order || r.order || (i + 1);
        await client.query(
          `INSERT INTO interview_rounds (drive_id, round_name, description, round_order)
           VALUES ($1, $2, $3, $4)`,
          [newDrive.id, roundName, desc, order]
        );
      }
    }

    // Initialize statistics
    await client.query(
      `INSERT INTO drive_statistics (drive_id, total_applied, total_selected)
       VALUES ($1, 0, 0)
       ON CONFLICT (drive_id) DO NOTHING`,
      [newDrive.id]
    );

    await client.query("COMMIT");

    return await getPlacementDriveById(newDrive.id);
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

export const updatePlacementDrive = async (id, data) => {
  const { company, role, package: pkg, drive_date, deadline, status, eligibility, rounds } = data;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const driveResult = await client.query(
      `UPDATE placement_drives
       SET company = $1,
           role = $2,
           package = $3,
           drive_date = $4,
           deadline = $5,
           status = $6,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $7
       RETURNING *`,
      [company, role, pkg, drive_date, deadline, status, id]
    );

    if (driveResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return null;
    }

    // Update eligibility if provided
    if (eligibility) {
      const cgpa = eligibility.cgpa !== undefined ? eligibility.cgpa : 6.0;
      let branches = eligibility.department || [];
      if (typeof branches === "string") {
        branches = branches.split(",").map((b) => b.trim());
      }
      await client.query(
        `INSERT INTO drive_eligibility (drive_id, cgpa_cutoff, allowed_branches)
         VALUES ($1, $2, $3)
         ON CONFLICT (id) DO UPDATE SET cgpa_cutoff = EXCLUDED.cgpa_cutoff, allowed_branches = EXCLUDED.allowed_branches`,
        [id, cgpa, branches]
      );
    }

    // Re-sync rounds if provided
    if (Array.isArray(rounds)) {
      await client.query(`DELETE FROM interview_rounds WHERE drive_id = $1`, [id]);
      for (let i = 0; i < rounds.length; i++) {
        const r = rounds[i];
        const roundName = r.round_name || r.name || `Round ${i + 1}`;
        const desc = r.description || "";
        const order = r.round_order || r.order || (i + 1);
        await client.query(
          `INSERT INTO interview_rounds (drive_id, round_name, description, round_order)
           VALUES ($1, $2, $3, $4)`,
          [id, roundName, desc, order]
        );
      }
    }

    await client.query("COMMIT");

    return await getPlacementDriveById(id);
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

export const deletePlacementDrive = async (id) => {
  const result = await pool.query(
    "DELETE FROM placement_drives WHERE id=$1 RETURNING *",
    [id]
  );

  return result.rows[0];
};

export const searchPlacementDrives = async (query) => {
  const searchPattern = `%${query}%`;

  const result = await pool.query(
    `${BASE_DRIVE_QUERY}
     WHERE pd.company ILIKE $1 OR pd.role ILIKE $1
     ORDER BY pd.drive_date DESC`,
    [searchPattern]
  );

  return result.rows;
};

export const getDriveStatistics = async () => {
  const result = await pool.query(`
    SELECT
      pd.id,
      pd.company,
      pd.role,
      pd.package,
      pd.drive_date,
      pd.deadline,
      pd.status,
      COALESCE(ds.total_applied,0) AS registered_students,
      0 AS eligible_students,
      COALESCE(ds.total_selected,0) AS selected_students,
      0 AS rejected_students
    FROM placement_drives pd
    LEFT JOIN drive_statistics ds
      ON pd.id = ds.drive_id
    ORDER BY pd.drive_date DESC;
  `);

  return result.rows;
};