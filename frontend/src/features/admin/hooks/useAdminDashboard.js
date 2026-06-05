import { useState, useEffect } from "react";
import {
  fetchDashboardStats,
  fetchDashboardFunnel,
  fetchCompanyStats,
  fetchCollegePerformance,
  fetchActivityFeed
} from "../services/adminService";

// Mock Data
const mockStats = {
  totalDrives: 12, totalStudents: 476,
  totalCompanies: 18, totalColleges: 34
};

const mockFunnel = [
  { stage: "Applied", count: 476 },
  { stage: "Tested", count: 310 },
  { stage: "Trained", count: 198 },
  { stage: "Selected", count: 87 }
];

const mockCompanies = [
  { companyId: "cmp_01", name: "TechCorp", totalHired: 32, activeDrives: 3 },
  { companyId: "cmp_02", name: "FinServe", totalHired: 18, activeDrives: 1 },
  { companyId: "cmp_03", name: "DataSystems", totalHired: 12, activeDrives: 2 }
];

const mockColleges = [
  { collegeId: "col_01", name: "BITS Pilani", totalStudents: 80, selected: 42, selectionRate: 52.5 },
  { collegeId: "col_02", name: "NIT Trichy", totalStudents: 65, selected: 30, selectionRate: 46.2 },
  { collegeId: "col_03", name: "VIT Vellore", totalStudents: 90, selected: 38, selectionRate: 42.2 }
];

const mockActivities = [
  { logId: "log_001", action: "verified_mentor", targetType: "mentor", targetId: 110, performedBy: "Ananya Rao", createdAt: "2025-05-12T09:00:00Z" },
  { logId: "log_002", action: "closed_drive", targetType: "drive", targetId: 4, performedBy: "Ananya Rao", createdAt: "2025-05-11T14:30:00Z" },
  { logId: "log_003", action: "rejected_mentor", targetType: "mentor", targetId: 115, performedBy: "Vikram Nair", createdAt: "2025-05-10T11:00:00Z" }
];

// Custom Hook
const useAdminDashboard = () => {
  const [stats, setStats] = useState(mockStats);
  const [funnel, setFunnel] = useState(mockFunnel);
  const [companies, setCompanies] = useState(mockCompanies);
  const [colleges, setColleges] = useState(mockColleges);
  const [activities, setActivities] = useState(mockActivities);
  
  // const [stats, setStats] = useState(null);
  // const [funnel, setFunnel] = useState([]);
  // const [companies, setCompanies] = useState([]);
  // const [colleges, setColleges] = useState([]);
  // const [activities, setActivities] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Loading all Dashboard Data
  const loadAll = async () => {
    try {
      const [statsRes, funnelRes, companyRes, collegeRes, activityRes] =
        await Promise.all([
          fetchDashboardStats(),
          fetchDashboardFunnel(),
          fetchCompanyStats(),
          fetchCollegePerformance(),
          fetchActivityFeed(),
        ]);

      // Safe Fallbacks
      setStats(statsRes);
      setFunnel(funnelRes.funnel);
      setCompanies(companyRes.companies);
      setColleges(collegeRes.colleges);
      setActivities(activityRes.activities);
      setError(null);
    } catch (err) {
      // Falling back to Mock Data
      // setStats(mockStats);
      // setFunnel(mockFunnel);
      // setCompanies(mockCompanies);
      // setColleges(mockColleges);
      // setActivities(mockActivities);

      // setError('Failed to load dashboard data.');
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    const interval = setInterval(loadAll, 30000); // Refetch every 30s
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return { stats, funnel, companies, colleges, activities, loading, error, refetch: loadAll };
};

export default useAdminDashboard;