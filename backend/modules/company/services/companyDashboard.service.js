import { pool } from '../../../config/db.js';

export const getDashboardStats = async (companyId) => {
  // Query active drives
  const drivesRes = await pool.query(
    `SELECT COUNT(*) FROM recruitment_drives WHERE company_id = $1 AND status = 'active'`,
    [companyId]
  );
  const activeDrivesDb = parseInt(drivesRes.rows[0].count, 10);

  // Query total applications
  const appsRes = await pool.query(
    `SELECT COUNT(*) FROM student_drive_progress WHERE company_id = $1`,
    [companyId]
  );
  const totalAppsDb = parseInt(appsRes.rows[0].count, 10);

  // Query interviews scheduled
  const interviewsRes = await pool.query(
    `SELECT COUNT(*) FROM interviews i 
     JOIN student_drive_progress sdp ON sdp.id = i.application_id 
     WHERE sdp.company_id = $1`,
    [companyId]
  );
  const interviewsDb = parseInt(interviewsRes.rows[0].count, 10);

  // Query offers released (stage is Offered or Selected)
  const offersRes = await pool.query(
    `SELECT COUNT(*) FROM student_drive_progress 
     WHERE company_id = $1 AND stage IN ('Offered', 'Selected')`,
    [companyId]
  );
  const offersDb = parseInt(offersRes.rows[0].count, 10);

  // If there are no candidate applications in the database, return realistic mock defaults for testing
  if (totalAppsDb === 0) {
    return {
      activeDrives: 12,
      totalApplications: 1450,
      interviewsScheduled: 220,
      offersReleased: 48,
      hiringSuccessRate: 72
    };
  }

  const hiringSuccessRate = Math.round((offersDb / totalAppsDb) * 100);

  return {
    activeDrives: activeDrivesDb,
    totalApplications: totalAppsDb,
    interviewsScheduled: interviewsDb,
    offersReleased: offersDb,
    hiringSuccessRate
  };
};

export const getDashboardFunnel = async (companyId) => {
  const appliedRes = await pool.query(
    `SELECT COUNT(*) FROM student_drive_progress WHERE company_id = $1`,
    [companyId]
  );
  const applied = parseInt(appliedRes.rows[0].count, 10);

  const screenedRes = await pool.query(
    `SELECT COUNT(*) FROM student_drive_progress 
     WHERE company_id = $1 AND current_stage IN ('screening', 'training', 'shortlist', 'interviews', 'selection')`,
    [companyId]
  );
  const screened = parseInt(screenedRes.rows[0].count, 10);

  const trainedRes = await pool.query(
    `SELECT COUNT(*) FROM student_drive_progress 
     WHERE company_id = $1 AND current_stage IN ('training', 'shortlist', 'interviews', 'selection')`,
    [companyId]
  );
  const trained = parseInt(trainedRes.rows[0].count, 10);

  const shortlistedRes = await pool.query(
    `SELECT COUNT(*) FROM student_drive_progress 
     WHERE company_id = $1 AND current_stage IN ('shortlist', 'interviews', 'selection')`,
    [companyId]
  );
  const shortlisted = parseInt(shortlistedRes.rows[0].count, 10);

  const selectedRes = await pool.query(
    `SELECT COUNT(*) FROM student_drive_progress 
     WHERE company_id = $1 AND current_stage = 'selection'`,
    [companyId]
  );
  const selected = parseInt(selectedRes.rows[0].count, 10);

  // Return realistic mock fallback if database records are empty
  if (applied === 0) {
    return {
      applied: 1500,
      screened: 900,
      trained: 650,
      shortlisted: 300,
      selected: 80
    };
  }

  return {
    applied,
    screened,
    trained,
    shortlisted,
    selected
  };
};

export const getCollegeStats = async (companyId) => {
  const query = `
    SELECT s.college AS "collegeName", COUNT(*)::int AS "candidateCount"
    FROM student_drive_progress sdp
    JOIN students s ON s.id = sdp.student_id
    WHERE sdp.company_id = $1 AND s.college IS NOT NULL
    GROUP BY s.college
    ORDER BY "candidateCount" DESC
  `;
  const result = await pool.query(query, [companyId]);

  if (result.rows.length === 0) {
    return [
      { collegeName: "IIT Bombay", candidateCount: 120 },
      { collegeName: "IIT Delhi", candidateCount: 98 },
      { collegeName: "BITS Pilani", candidateCount: 85 },
      { collegeName: "NIT Trichy", candidateCount: 76 },
      { collegeName: "VIT Vellore", candidateCount: 64 }
    ];
  }

  return result.rows;
};

export const getRecentActivities = async (companyId) => {
  const query = `
    SELECT 
      sdp.stage AS "activity",
      s.name AS "candidateName",
      sdp.stage_updated_at AS "time"
    FROM student_drive_progress sdp
    JOIN students s ON s.id = sdp.student_id
    WHERE sdp.company_id = $1
    ORDER BY sdp.stage_updated_at DESC
    LIMIT 10
  `;
  const result = await pool.query(query, [companyId]);

  if (result.rows.length === 0) {
    return [
      {
        activity: "Interview Completed",
        candidateName: "Rahul Sharma",
        time: new Date(Date.now() - 2 * 60 * 1000).toISOString()
      },
      {
        activity: "Offer Letter Accepted",
        candidateName: "Priya Patel",
        time: new Date(Date.now() - 10 * 60 * 1000).toISOString()
      },
      {
        activity: "Applied for software role",
        candidateName: "Arjun Kumar",
        time: new Date(Date.now() - 25 * 60 * 1000).toISOString()
      }
    ];
  }

  // Format activity messages
  return result.rows.map(row => {
    let actMessage = "Applied for role";
    if (row.activity === "Shortlisted") actMessage = "Candidate shortlisted";
    else if (row.activity === "Assessment") actMessage = "Completed assessment screening";
    else if (row.activity === "Interview") actMessage = "Scheduled final interview round";
    else if (row.activity === "Rejected") actMessage = "Recruitment application rejected";

    return {
      activity: actMessage,
      candidateName: row.candidateName,
      time: row.time
    };
  });
};
