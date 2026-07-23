import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Users,
  Briefcase,
  ClipboardList,
  GraduationCap,
  BarChart3,
  FileText,
  Building2,
  Building,
  BookOpen,
  Settings,
  HelpCircle,
  LogOut,
  X,
} from "lucide-react";

const menuItems = [
  {
    section: "MAIN",
    items: [
      {
        title: "Dashboard",
        icon: LayoutDashboard,
        path: "/college/dashboard",
      },
      {
        title: "Profile",
        icon: User,
        path: "/college/profile",
      },
      {
        title: "Students",
        icon: Users,
        path: "/college/student",
      },
      {
        title: "Placements",
        icon: Briefcase,
        path: "/college/placements",
      },
      {
        title: "Drive Management",
        icon: ClipboardList,
        path: "/college/drives",
      },
      {
        title: "Assessments",
        icon: GraduationCap,
        path: "/college/assessments",
      },
      {
        title: "Analytics",
        icon: BarChart3,
        path: "/college/analytics",
      },
      {
        title: "Reports",
        icon: FileText,
        path: "/college/reports",
      },
    ],
  },

  {
    section: "MANAGEMENT",
    items: [
      {
        title: "Faculty",
        icon: Users,
        path: "/college/faculty",
      },
      {
        title: "Companies",
        icon: Building2,
        path: "/college/companies",
      },
      {
        title: "Internships",
        icon: Building,
        path: "/college/internships",
      },
    ],
  },

  {
    section: "ACCOUNT",
    items: [
      {
        title: "Settings",
        icon: Settings,
        path: "/college/settings",
      },
      {
        title: "Help & Support",
        icon: HelpCircle,
        path: "/college/help",
      },
      {
        title: "Logout",
        icon: LogOut,
        path: "/logout",
      },
    ],
  },
];

const CollegeSidebar = ({ openSidebar, setOpenSidebar }) => {
  return (
    <>
      {/* Mobile Overlay */}
      {openSidebar && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpenSidebar(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen
          w-64 bg-white border-r border-gray-200
          transition-transform duration-300

          ${
            openSidebar
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-20 px-6 border-b">
          <div>
            <h1 className="text-3xl font-bold">
              <span className="text-orange-500">Upto</span>
              <span className="text-gray-900">Skills</span>
            </h1>

            <p className="text-[10px] text-gray-500 mt-1">
              Learn | Advance | Grow
            </p>
          </div>

          <button
            className="md:hidden"
            onClick={() => setOpenSidebar(false)}
          >
            <X size={22} />
          </button>
        </div>

        {/* Menu */}
        <div className="overflow-y-auto h-[calc(100vh-80px)] px-4 py-6">
          {menuItems.map((section) => (
            <div key={section.section} className="mb-8">
              <p className="text-xs uppercase text-gray-400 font-semibold mb-3 px-3">
                {section.section}
              </p>

              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={item.title}
                      to={item.path}
                      className={({ isActive }) =>
                        `
                        flex items-center gap-3
                        px-3 py-3 rounded-xl
                        text-sm font-medium
                        transition-all

                        ${
                          isActive
                            ? "bg-emerald-50 text-emerald-600"
                            : "text-gray-600 hover:bg-gray-100"
                        }
                      `
                      }
                      onClick={() => setOpenSidebar(false)}
                    >
                      <Icon size={18} />
                      {item.title}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
};

export default CollegeSidebar;