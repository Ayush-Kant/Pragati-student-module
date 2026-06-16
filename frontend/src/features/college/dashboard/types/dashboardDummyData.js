// ================================
// LAYOUT DATA (ASMA)
// ================================

export const dashboardOverview = {
  collegeName: "RGIPT",
  notifications: 5,
  profileCompletion: 85,
  profileImage:
    "https://images.unsplash.com/photo-1562774053-701939374585"
};

export const dashboardNavigation = [
  {
    id: 1,
    label: "Dashboard",
    path: "/dashboard",
    icon: "LayoutDashboard"
  },
  {
    id: 2,
    label: "Profile",
    path: "/profile",
    icon: "User"
  },
  {
    id: 3,
    label: "Students",
    path: "/students",
    icon: "Users"
  },
  {
    id: 4,
    label: "Placements",
    path: "/placements",
    icon: "Briefcase"
  },
  {
    id: 5,
    label: "Drives",
    path: "/drives",
    icon: "Building2"
  },
  {
    id: 6,
    label: "Settings",
    path: "/settings",
    icon: "Settings"
  }
];

// ================================
// STATS DATA (ASMA)
// ================================

export const dashboardStats = [
  {
    id: 1,
    title: "Total Students",
    value: 1250,
    change: "+12%",
    trend: "up"
  },
  {
    id: 2,
    title: "Active Drives",
    value: 18,
    change: "+4%",
    trend: "up"
  },
  {
    id: 3,
    title: "Placements",
    value: 423,
    change: "+8%",
    trend: "up"
  },
  {
    id: 4,
    title: "Revenue",
    value: "₹8.5L",
    change: "+15%",
    trend: "up"
  },
  {
    id: 5,
    title: "Companies",
    value: 42,
    change: "+5%",
    trend: "up"
  },
  {
    id: 6,
    title: "Applications",
    value: 320,
    change: "+10%",
    trend: "up"
  }
];

// ================================
// CHART DATA (ADEEB)
// ================================

export const placementData = [
  { month: "Jan", placements: 25 },
  { month: "Feb", placements: 30 },
  { month: "Mar", placements: 38 },
  { month: "Apr", placements: 44 },
  { month: "May", placements: 52 },
  { month: "Jun", placements: 61 }
];

export const revenueData = [
  { month: "Jan", revenue: 50000 },
  { month: "Feb", revenue: 65000 },
  { month: "Mar", revenue: 72000 },
  { month: "Apr", revenue: 81000 },
  { month: "May", revenue: 93000 },
  { month: "Jun", revenue: 105000 }
];

export const admissionsData = [
  { month: "Jan", admissions: 120 },
  { month: "Feb", admissions: 145 },
  { month: "Mar", admissions: 180 },
  { month: "Apr", admissions: 220 },
  { month: "May", admissions: 260 },
  { month: "Jun", admissions: 300 }
];

// ================================
// ACTIVITIES DATA (SHILPI)
// ================================

export const activities = [
  {
    id: 1,
    title: "New Student Registered",
    description: "Rahul Sharma completed registration.",
    time: "2 hours ago",
    status: "success"
  },
  {
    id: 2,
    title: "Placement Drive Created",
    description: "TCS Hiring Drive created successfully.",
    time: "5 hours ago",
    status: "info"
  },
  {
    id: 3,
    title: "Company Approved",
    description: "Infosys profile approved.",
    time: "1 day ago",
    status: "success"
  },
  {
    id: 4,
    title: "Profile Updated",
    description: "College profile updated successfully.",
    time: "2 days ago",
    status: "warning"
  }
];

export const recentUpdates = [
  {
    id: 1,
    title: "Campus Placement Week",
    date: "15 June 2026"
  },
  {
    id: 2,
    title: "New Dashboard Release",
    date: "20 June 2026"
  },
  {
    id: 3,
    title: "Student Verification Drive",
    date: "25 June 2026"
  }
];

export const quickActions = [
  {
    id: 1,
    title: "Create Drive",
    route: "/drives/create"
  },
  {
    id: 2,
    title: "Manage Students",
    route: "/students"
  },
  {
    id: 3,
    title: "Edit Profile",
    route: "/profile/edit"
  },
  {
    id: 4,
    title: "View Reports",
    route: "/reports"
  }
];

// ================================
// SERVICE DATA (RISHABH)
// ================================

export const dashboardApiResponse = {
  success: true,
  data: {
    stats: dashboardStats,
    placements: placementData,
    revenue: revenueData,
    admissions: admissionsData,
    activities,
    recentUpdates,
    quickActions
  }
};