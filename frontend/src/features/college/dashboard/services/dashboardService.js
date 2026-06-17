// src/features/college/dashboard/services/dashboardService.js

const dashboardApiResponse = {
  success: true,
  data: {
    // matches: response.data.stats in useDashboardData
    stats: [
      { id: 1, title: 'Total Students',  value: '2,450', change: '+12%', trend: 'up' },
      { id: 2, title: 'Active Drives',   value: 18,      change: '+4%',  trend: 'up' },
      { id: 3, title: 'Placements',      value: 423,     change: '+8%',  trend: 'up' },
      { id: 4, title: 'Revenue',         value: '₹8.5L', change: '+15%', trend: 'up' },
      { id: 5, title: 'Companies',       value: 42,      change: '+5%',  trend: 'up' },
      { id: 6, title: 'Applications',    value: 320,     change: '+10%', trend: 'up' },
    ],

    // matches: response.data.activities in useDashboardData
    activities: [
      { id: 1, title: 'New Student Registered',    description: 'Rahul Sharma completed registration.',      time: '2 hours ago', status: 'success' },
      { id: 2, title: 'Placement Drive Created',   description: 'TCS Hiring Drive created successfully.',    time: '5 hours ago', status: 'info'    },
      { id: 3, title: 'Company Approved',          description: 'Infosys profile approved.',                 time: '1 day ago',   status: 'success' },
      { id: 4, title: 'Profile Updated',           description: 'College profile updated successfully.',     time: '2 days ago',  status: 'warning' },
    ],

    // matches: response.data.placements in useDashboardData
    placements: [
      { month: 'Jan', placements: 25 },
      { month: 'Feb', placements: 30 },
      { month: 'Mar', placements: 38 },
      { month: 'Apr', placements: 44 },
      { month: 'May', placements: 52 },
      { month: 'Jun', placements: 61 },
    ],

    // matches: response.data.revenue in useDashboardData
    revenue: [
      { month: 'Jan', revenue: 50000 },
      { month: 'Feb', revenue: 65000 },
      { month: 'Mar', revenue: 72000 },
      { month: 'Apr', revenue: 81000 },
      { month: 'May', revenue: 93000 },
      { month: 'Jun', revenue: 105000 },
    ],

    // matches: response.data.admissions in useDashboardData
    admissions: [
      { month: 'Jan', admissions: 120 },
      { month: 'Feb', admissions: 145 },
      { month: 'Mar', admissions: 180 },
      { month: 'Apr', admissions: 220 },
      { month: 'May', admissions: 260 },
      { month: 'Jun', admissions: 300 },
    ],
  },
};

export const dashboardService = {
  getDashboardSummary: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(dashboardApiResponse), 400);
    });
  },
};
