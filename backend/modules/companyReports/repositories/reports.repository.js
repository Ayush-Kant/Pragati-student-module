import { pool } from "../../../config/db.js";

export const getDashboardAnalytics = async (companyId) => {
  const query = `
    SELECT *
    FROM v_company_hiring_kpis
    WHERE company_id = $1
  `;

  const { rows } = await pool.query(query, [companyId]);
  return rows[0] || {};
};

export const getConversionAnalytics = async (companyId) => {
  const query = `
    SELECT
      p.*
    FROM v_pragati_drive_pipeline p
    JOIN recruitment_drives_v2 rd
      ON p.drive_id = rd.id
    WHERE rd.company_id = $1
  `;

  const { rows } = await pool.query(query, [companyId]);
  return rows;
};

export const getOfferAnalytics = async (companyId) => {
  const query = `
    SELECT
      oa.*
    FROM v_company_offer_analytics oa
    JOIN recruitment_drives_v2 rd
      ON oa.drive_id = rd.id
    WHERE rd.company_id = $1
  `;

  const { rows } = await pool.query(query, [companyId]);
  return rows;
};

export const getCollegePerformance = async (companyId) => {
  const query = `
    SELECT *
    FROM college_performance_metrics
    WHERE company_id = $1
    ORDER BY placement_rate DESC
  `;

  const { rows } = await pool.query(query, [companyId]);
  return rows;
};

export const getSkillGapAnalytics = async () => {
  const query = `
    SELECT *
    FROM skill_demand_metrics
    ORDER BY gap_index DESC
  `;

  const { rows } = await pool.query(query);
  return rows;
};

export const getHiringTrends = async (companyId) => {
  const query = `
    SELECT *
    FROM hiring_metrics
    WHERE company_id = $1
    ORDER BY metric_date DESC
  `;

  const { rows } = await pool.query(query, [companyId]);
  return rows;
};
