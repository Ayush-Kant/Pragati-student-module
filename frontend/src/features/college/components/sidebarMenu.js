import {
  LayoutDashboard,
  User,
  Building2,
  GraduationCap,
  Users,
  TrendingUp,
  Briefcase,
  UserCheck,
  BarChart3,
  FileText,
  Megaphone,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";

const sidebarMenu = [
  {
    title: "MAIN",
    items: [
      {
        name: "Dashboard",
        path: "/college/dashboard",
        icon: LayoutDashboard,
      },
      {
        name: "College Profile",
        path: "/college/profile",
        icon: User,
      },
      {
        name: "Departments",
        path: "/college/departments",
        icon: Building2,
      },
      {
        name: "Student Database",
        path: "/college/student",
        icon: GraduationCap,
      },
      {
        name: "Student Performance",
        path: "/college/student-performance",
        icon: TrendingUp,
      },
      {
        name: "Companies",
        path: "/college/companies",
        icon: Building2,
      },
      {
        name: "Placement Drives",
        path: "/college/drives",
        icon: Briefcase,
      },
      {
        name: "Student Nomination",
        path: "/college/student-nomination",
        icon: UserCheck,
      },
      {
        name: "Analytics",
        path: "/college/analytics",
        icon: BarChart3,
      },
      {
        name: "Reports",
        path: "/college/reports",
        icon: FileText,
      },
      {
        name: "Announcements",
        path: "/college/announcements",
        icon: Megaphone,
      },
    ],
  },

  {
    title: "ACCOUNT",
    items: [
      {
        name: "Settings",
        path: "/college/settings",
        icon: Settings,
      },
      {
        name: "Help & Support",
        path: "/college/help",
        icon: HelpCircle,
      },
      {
        name: "Logout",
        path: "/logout",
        icon: LogOut,
      },
    ],
  },
];

export default sidebarMenu;