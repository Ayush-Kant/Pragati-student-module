import {
  FiGrid,
  FiBriefcase,
  FiUsers,
  FiClipboard,
  FiCalendar,
  FiBookOpen,
  FiMessageSquare,
  FiFileText,
  FiBarChart2,
  FiSettings,
} from "react-icons/fi";

export const sidebarItems = [
  {
    name: "Dashboard",
    path: "/",
    icon: FiGrid,
    color: "#3B82F6",
  },
  {
    name: "Drives",
    path: "/drives",
    icon: FiBriefcase,
    color: "#14B8A6",
  },
  {
    name: "Candidates",
    path: "/candidates",
    icon: FiUsers,
    color: "#06B6D4",
  },
  {
    name: "Assessments",
    path: "/assessments",
    icon: FiClipboard,
    color: "#8B5CF6",
  },
  {
    name: "Interviews",
    path: "/interviews",
    icon: FiCalendar,
    color: "#F59E0B",
  },
  {
    name: "Training",
    path: "/training",
    icon: FiBookOpen,
    color: "#22C55E",
  },
  {
    name: "Messages",
    path: "/messages",
    icon: FiMessageSquare,
    color: "#EC4899",
  },
  {
    name: "Offers",
    path: "/offers",
    icon: FiFileText,
    color: "#6366F1",
  },
  {
    name: "Reports",
    path: "/reports",
    icon: FiBarChart2,
    color: "#FBBF24",
  },
  {
    name: "Settings",
    path: "/settings",
    icon: FiSettings,
    color: "#64748B",
  },
];