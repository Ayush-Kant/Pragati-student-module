// src/features/college/dashboard/services/dashboardService.js

// 1. DUMMY DATA INTEGRATION
const dashboardApiResponse = {
  success: true,
  data: {
    dashboardStats: [
      { id: "stat-1", label: "Total Students", value: "12,450", change: "+4.2%", isPositive: true },
      { id: "stat-2", label: "Placement Rate", value: "89.4%", change: "+1.8%", isPositive: true },
      { id: "stat-3", label: "Active Courses", value: "48", change: "0%", isPositive: true },
      { id: "stat-4", label: "Outstanding Fees", value: "$23,150", change: "-5.2%", isPositive: false }
    ],
    activities: [
      { id: "act-1", type: "admission", text: "New student enrollment completed for B.Tech CS", timestamp: "10 mins ago" },
      { id: "act-2", type: "placement", text: "Microsoft scheduled a campus drive for next month", timestamp: "1 hour ago" },
      { id: "act-3", type: "revenue", text: "Quarter 2 tuition fee reconciliation completed", timestamp: "4 hours ago" }
    ],
    placementData: [
      { year: "2023", placed: 450, total: 500 },
      { year: "2024", placed: 520, total: 550 },
      { year: "2025", placed: 580, total: 600 }
    ],
    revenueData: [
      { quarter: "Q1", collected: 450000, pending: 25000 },
      { quarter: "Q2", collected: 520000, pending: 15000 },
      { quarter: "Q3", collected: 490000, pending: 30000 }
    ],
    admissionsData: [
      { stream: "Engineering", applications: 1200, admissions: 350 },
      { stream: "Management", applications: 850, admissions: 200 },
      { stream: "Science", applications: 600, admissions: 150 }
    ]
  }
};

// 2. SERVICE LAYER & API INTEGRATION STRUCTURE
export const dashboardService = {
  getDashboardSummary: async () => {
    return new Promise((resolve, reject) => {
      // Simulating a 800ms network latency
      setTimeout(() => {
        // Toggle to false to test Error Handling logic
        const simulateSuccess = true; 

        if (simulateSuccess) {
          resolve(dashboardApiResponse);
        } else {
          reject(new Error("Network Error: Failed to fetch dashboard summary from server."));
        }
      }, 800);
    });
  }
};