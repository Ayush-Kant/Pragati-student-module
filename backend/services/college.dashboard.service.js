import { pool } from '../config/db.js';

// Helper to get college details by user_id
const getCollegeByUser = async (userId) => {
  const result = await pool.query('SELECT * FROM colleges WHERE user_id = $1', [userId]);
  return result.rows[0];
};

export const getDashboardOverview = async (userId) => {
  try {
    const college = await getCollegeByUser(userId);
    if (!college) return { success: true, data: { totalStudents: 0, activeDrives: 0, departments: 0, placementRate: "0%" } };

    const studentsResult = await pool.query('SELECT count(*) as count FROM students WHERE college = $1', [college.name]);
    const totalStudents = parseInt(studentsResult.rows[0].count, 10);
    
    // Departments count is from colleges.departments array
    const departmentsCount = college.departments ? college.departments.length : 0;
    
    // For active drives, if there is a way to link them, we can do it. Assuming drives are global or linked by some table. We'll return a dynamic dummy or 0 if none.
    // Placement Rate: number of students placed / total students
    const placedResult = await pool.query("SELECT count(*) as count FROM students WHERE college = $1 AND placement_status = 'Placed'", [college.name]);
    const totalPlaced = parseInt(placedResult.rows[0].count, 10);
    const placementRate = totalStudents > 0 ? Math.round((totalPlaced / totalStudents) * 100) + "%" : "0%";

    return {
      success: true,
      data: {
        totalStudents,
        activeDrives: 5, // Placeholder for drives as the schema linking isn't clear
        departments: departmentsCount,
        placementRate,
      },
    };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch dashboard overview");
  }
};

export const getDashboardStats = async (userId) => {
  try {
    const college = await getCollegeByUser(userId);
    const collegeName = college ? college.name : '';

    const studentsResult = await pool.query('SELECT count(*) as count FROM students WHERE college = $1', [collegeName]);
    const totalStudents = parseInt(studentsResult.rows[0].count, 10);

    const placedResult = await pool.query("SELECT count(*) as count FROM students WHERE college = $1 AND placement_status = 'Placed'", [collegeName]);
    const placements = parseInt(placedResult.rows[0].count, 10);
    const placementRate = totalStudents > 0 ? Math.round((placements / totalStudents) * 100) + "%" : "0%";

    const stats = [
      { id: 1, title: "Total Students", value: totalStudents.toLocaleString(), change: "+5%", trend: "up" },
      { id: 2, title: "Active Drives", value: "12", change: "+2%", trend: "up" }, // Procedural
      { id: 3, title: "Companies", value: "34", change: "+10%", trend: "up" }, // Procedural
      { id: 4, title: "Placements", value: placements.toLocaleString(), change: "+15%", trend: "up" },
      { id: 5, title: "Faculty", value: "45", change: "0%", trend: "neutral" },
      { id: 6, title: "Departments", value: college?.departments?.length || 0, change: "0%", trend: "neutral" },
      { id: 7, title: "Internships", value: "56", change: "+8%", trend: "up" },
      { id: 8, title: "Placement Rate", value: placementRate, change: "+3%", trend: "up" }
    ];

    return {
      success: true,
      data: stats,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch dashboard stats");
  }
};

export const getDashboardActivities = async (userId) => {
  try {
    const college = await getCollegeByUser(userId);
    const collegeName = college ? college.name : '';
    
    // Fetch recently added students
    const recentStudents = await pool.query(
      'SELECT name, created_at FROM students WHERE college = $1 ORDER BY created_at DESC LIMIT 5',
      [collegeName]
    );

    const activities = recentStudents.rows.map(student => ({
      id: Math.random().toString(36).substr(2, 9),
      type: 'student_added',
      title: 'New Student Registration',
      description: `${student.name} has registered.`,
      timestamp: student.created_at,
    }));

    return {
      success: true,
      data: activities,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch dashboard activities");
  }
};

export const getPlacementAnalytics = async (userId) => {
  try {
    const placementData = {
      totalPlacements: 0,
      averagePackage: 0,
      topRecruiters: [],
      // Recharts expects an array of objects
      placementTrends: [
        { name: "IT", placements: 120 },
        { name: "Core", placements: 80 },
        { name: "Consulting", placements: 50 },
        { name: "Finance", placements: 30 },
      ],
    };
    return {
      success: true,
      data: placementData,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch placement analytics");
  }
};

export const getRevenueAnalytics = async (userId) => {
  try {
    const revenueData = {
      totalRevenue: 0,
      monthlyRevenue: [
        { month: "Jan", revenue: 45000 },
        { month: "Feb", revenue: 52000 },
        { month: "Mar", revenue: 48000 },
        { month: "Apr", revenue: 61000 },
        { month: "May", revenue: 59000 },
        { month: "Jun", revenue: 75000 },
      ],
      revenueGrowth: 15,
    };
    return {
      success: true,
      data: revenueData,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch revenue analytics");
  }
};

export const getAdmissionsAnalytics = async (userId) => {
  try {
    const admissionsData = {
      totalAdmissions: 0,
      admissionsTrend: [
        { month: "Jan", admissions: 120 },
        { month: "Feb", admissions: 145 },
        { month: "Mar", admissions: 180 },
        { month: "Apr", admissions: 220 },
        { month: "May", admissions: 260 },
        { month: "Jun", admissions: 300 },
      ],
      conversionRate: 0,
    };
    return {
      success: true,
      data: admissionsData,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch admissions analytics");
  }
};
