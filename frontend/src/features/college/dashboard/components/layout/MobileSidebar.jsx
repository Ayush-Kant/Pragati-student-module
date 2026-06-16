import React from "react";
import { X } from "lucide-react";
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
  dashboardOverview,
  dashboardNavigation,
} from "../../types/dashboardDummyData";

const iconMap = {
  LayoutDashboard,
  User,
  Users,
  Briefcase,
  Building2,
  Settings,
};

const MobileSidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white z-50 transform transition-transform duration-300 md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="font-bold text-orange-600 text-lg">
            {dashboardOverview.collegeName}
          </h2>

          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100"
          >
            <X size={22} />
          </button>
        </div>

        {/* Profile Section */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <img
              src={dashboardOverview.profileImage}
              alt={dashboardOverview.collegeName}
              className="w-12 h-12 rounded-full object-cover border border-gray-200"
            />

            <div>
              <h3 className="text-sm font-semibold text-gray-800">
                {dashboardOverview.collegeName}
              </h3>

              <p className="text-xs text-gray-500">
                College Admin
              </p>

              <p className="text-xs text-orange-600 font-medium mt-1">
                {dashboardOverview.profileCompletion}% Complete
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-2">
            {dashboardNavigation.map((item) => {
              const Icon = iconMap[item.icon];

              return (
                <li key={item.id}>
                  <NavLink
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                        isActive
                          ? "bg-orange-500 text-white"
                          : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                      }`
                    }
                  >
                    <Icon size={20} />
                    <span className="font-medium">
                      {item.label}
                    </span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default MobileSidebar;