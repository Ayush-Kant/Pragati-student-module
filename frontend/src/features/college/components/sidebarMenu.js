import {
  LayoutDashboard,
  User,
  Users,
  Building2,
  Briefcase,
  ClipboardList,
  BarChart3,
  FileText,
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
        name: "Profile",
        path: "/college/profile",
        icon: User,
      },
      {
        name: "Students",
        path: "/college/student",
        icon: Users,
      },
    ],
  },

  {
    title: "PLACEMENTS",
    items: [
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
        name: "Applications",
        path: "/college/applications",
        icon: ClipboardList,
      },
    ],
  },

  {
    title: "REPORTS",
    items: [
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
        name: "Help",
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