import { useState, useEffect, useRef } from "react";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  LayoutDashboard,
  LineChart,
  MonitorCheck,
  Settings,
  Search,
  Bell,
  HelpCircle,
  Briefcase,
  BookOpen,
  Activity,
  Database,
  FlaskConical,
  History,
  Users,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../../../context/AuthContext";

export default function MentorLayout() {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/mentor/dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      name: "Mentees",
      path: "/mentor/mentees",
      icon: <Users className="w-5, h-5" />,
    },
    {
      name: "Courses",
      path: "/mentor/courses",
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      name: "Projects",
      path: "/mentor/project-analytics",
      icon: <Briefcase className="w-5 h-5" />,
    },
    {
      name: "Activities",
      path: "/mentor/activities",
      icon: <Activity className="w-5 h-5" />,
    },
    {
      name: "Question Bank",
      path: "/mentor/question-bank",
      icon: <Database className="w-5 h-5" />,
    },
    {
      name: "Submission Monitoring",
      path: "/mentor/submission-monitoring",
      icon: <MonitorCheck className="w-5 h-5" />,
    },
    {
      name: "Challenge Creator",
      path: "/mentor/challenge-creator",
      icon: <FlaskConical className="w-5 h-5" />,
    },
    {
      name: "Reports & Analytics",
      path: "/mentor/export-report",
      icon: <LineChart className="w-5 h-5" />,
    },
    {
      name: "Settings",
      path: "/mentor/settings",
      icon: <Settings className="w-5 h-5" />,
    },
    // You can add as many items here as you want; the sidebar will now scroll!
  ];

  const isItemActive = (item) => {
    const path = location.pathname;
    if (item.path === "#") return false;
    if (item.path === "/mentor/dashboard") {
      return path === "/mentor/dashboard" || path === "/mentor";
    }
    if (
      item.path === "/mentor/question-bank" ||
      item.path === "/mentor/courses" ||
      item.path === "/mentor/activities"
    ) {
      return path.startsWith(item.path);
    }
    return path === item.path;
  };

  const [{ mentorName, initials }] = useState(() => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return { mentorName: "Mentor User", initials: "MU" };

      const decoded = jwtDecode(token);

      if (decoded.name) {
        return {
          mentorName: decoded.name,
          initials: decoded.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .substring(0, 2)
            .toUpperCase(),
        };
      }

      if (decoded.email) {
        const emailName = decoded.email.split("@")[0];
        const formattedName =
          emailName.charAt(0).toUpperCase() +
          emailName.slice(1).replace(/[^a-zA-Z0-9]/g, " ");

        return {
          mentorName: formattedName,
          initials: formattedName.substring(0, 2).toUpperCase(),
        };
      }
    } catch (e) {
      console.error("Failed to decode token", e);
    }
    return { mentorName: "Mentor User", initials: "MU" };
  });

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans m-0 p-0 box-border">
      {/* 1. FIXED LEFT SIDEBAR */}
      <aside className="fixed left-0 top-0 z-30 flex h-screen w-[260px] flex-col border-r border-slate-200 bg-white">
        {/* Logo - Sticky at the top */}
        <div className="shrink-0 p-6 pb-4">
          <div className="flex items-center gap-2.5 pl-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500 font-extrabold text-white">
              U
            </div>
            <span className="text-lg font-extrabold tracking-tight text-slate-900">
              UPTOSKILLS
            </span>
          </div>
        </div>

        {/* Menu Items - Scrollable Middle Section */}
        {/* Hide scrollbar for cleaner UI, but allow scrolling */}
        <nav className="flex-1 overflow-y-auto px-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex flex-col gap-1">
            {menuItems.map((item, idx) => {
              const active = isItemActive(item);
              return (
                <Link
                  key={idx}
                  to={item.path}
                  className={`flex items-center gap-3 rounded-lg px-3.5 py-3 text-sm transition-colors duration-200 ${
                    active
                      ? "bg-sky-50 text-sky-600 font-semibold"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-700 font-medium"
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Support Vector Box - Sticky at the bottom */}
        <div className="shrink-0 border-t border-slate-100 p-4">
          <div className="rounded-xl bg-sky-50 p-4 text-center">
            <div className="mb-2 flex justify-center">
              <HelpCircle className="h-8 w-8 text-sky-500" />
            </div>
            <h4 className="mb-1 text-[13px] font-bold text-slate-900">
              Need Help?
            </h4>
            <p className="mb-3 text-[11px] text-slate-500">
              Our Support Desk is open
            </p>
            <button className="w-full rounded-lg bg-sky-500 p-2 text-xs font-semibold text-white transition-colors hover:bg-sky-600">
              Get Support
            </button>
          </div>
        </div>
      </aside>

      {/* 2. RIGHT SIDE CONTENT CANVAS */}
      <div className="ml-[260px] flex min-w-0 flex-1 flex-col overflow-y-auto">
        {/* Top Header Navigation Bar */}
        <header className="sticky top-0 z-20 flex h-35 items-center justify-between border-b border-slate-200 bg-white p-3">
          {/* Search */}
          <div className="relative w-[320px]">
            <input
              type="text"
              placeholder="Search for opportunities, profiles, faqs..."
              className="w-full rounded-full border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
            <span className="absolute left-3.5 top-2.5 text-slate-400">
              <Search className="h-4 w-4 mt-0.5" />
            </span>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-6 shrink-0">
            <button className="text-slate-500 hover:text-slate-700 transition-colors">
              <Bell className="h-5 w-5" />
            </button>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 focus:outline-none"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-500 text-sm font-bold text-white">
                  {initials}
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold leading-tight text-slate-800">
                    {mentorName}
                  </div>
                  <div className="mt-0.5 text-xs text-slate-500">
                    Mentor Console
                  </div>
                </div>
              </button>

              {/* Dropdown Menu */}
              {isOpen && (
                <div className="absolute right-0 mt-3 w-48 rounded-lg border-t-2 border-t-sky-500 bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="p-2">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-md bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-500 hover:text-white"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Log out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Inner Content Injection Frame */}
        <main className="w-full p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
