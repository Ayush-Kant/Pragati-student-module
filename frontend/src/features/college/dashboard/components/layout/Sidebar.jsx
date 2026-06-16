import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Users,
  Briefcase,
  Building2,
  Settings,
} from "lucide-react";

import {
  dashboardNavigation,
  dashboardOverview,
} from "../../types/dashboardDummyData";

const iconMap = {
  LayoutDashboard,
  User,
  Users,
  Briefcase,
  Building2,
  Settings,
};

const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 shadow-sm">
      {/* Logo */}
      <div className="h-20 px-6 flex items-center border-b border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-orange-600">
            {dashboardOverview.collegeName}
          </h1>
          <p className="text-xs text-gray-500">
            College Management
          </p>
        </div>
      </div>

      {/* Menu */}
      <div className="overflow-y-auto h-[calc(100vh-80px)] px-4 py-5">
        <p className="text-[11px] font-semibold tracking-wider text-gray-400 mb-3">
          MAIN
        </p>

        <ul className="space-y-1">
          {dashboardNavigation.map((item) => {
            const Icon = iconMap[item.icon];

            return (
              <li key={item.id}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-orange-50 text-orange-600 border-l-4 border-orange-500"
                        : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"
                    }`
                  }
                >
                  {Icon && <Icon size={18} />}
                  <span>{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>

        {/* Profile Completion */}
        <div className="mt-8 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-4">
          <p className="text-xs text-gray-500">
            Profile Completion
          </p>

          <div className="w-full h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-orange-500 rounded-full transition-all duration-300"
              style={{
                width: `${dashboardOverview.profileCompletion}%`,
              }}
            />
          </div>

          <p className="text-xs text-gray-600 mt-2">
            {dashboardOverview.profileCompletion}% Completed
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;