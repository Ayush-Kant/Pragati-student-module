import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Users,
  Briefcase,
  Building2,
  Settings,
  GraduationCap,
  BarChart3,
  FileText,
  ClipboardCheck,
  CalendarDays,
} from "lucide-react";
import { dashboardNavigation } from "../../types/dashboardDummyData";

const menuItems = [
  {
    title: "MAIN",
    items: [
      {
        label: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        label: "Profile",
        path: "/profile",
        icon: User,
      },
      {
        label: "Students",
        path: "/students",
        icon: Users,
      },
      {
        label: "Placements",
        path: "/placements",
        icon: Briefcase,
      },
      {
        label: "Drive Management",
        path: "/drives",
        icon: CalendarDays,
      },
      {
        label: "Settings",
        path: "/settings",
        icon: Settings,
      },
    ],
  },
];

const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 shadow-sm">
      
      {/* Logo */}
      <div className="h-20 px-6 flex items-center border-b border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-orange-600">
            RGIPT
          </h1>
          <p className="text-xs text-gray-500">
            College Management
          </p>
        </div>
      </div>

      {/* Menu */}
      <div className="overflow-y-auto h-[calc(100vh-80px)] px-4 py-5">
        {menuItems.map((section) => (
          <div key={section.title} className="mb-6">
            <p className="text-[11px] font-semibold tracking-wider text-gray-400 mb-3">
              {section.title}
            </p>

            <ul className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;

                return (
                  <li key={item.label}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                        ${
                          isActive
                            ? "bg-orange-50 text-orange-600 border-l-4 border-orange-500"
                            : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                        }`
                      }
                    >
                      <Icon size={18} />
                      {item.label}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        {/* Progress Card */}
        <div className="mt-8 bg-linear-to-r from-cyan-50 to-blue-50 rounded-xl p-4">
          <p className="text-xs text-gray-500">
            Profile Completion
          </p>

          <div className="w-full h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
            <div className="h-full w-[85%] bg-orange-500 rounded-full" />
          </div>

          
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;