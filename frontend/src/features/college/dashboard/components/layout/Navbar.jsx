import React from "react";
import { Bell, ChevronDown, Menu } from "lucide-react";
import { dashboardOverview } from "../../types/dashboardDummyData";

const Navbar = ({ onMenuClick }) => {
  return (
    <header className="fixed top-0 left-0 md:left-64 right-0 h-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 z-50">
      
      {/* Mobile Menu Button */}
      <button
        onClick={onMenuClick}
        className="md:hidden p-2 rounded-lg hover:bg-gray-100"
      >
        <Menu size={24} className="text-gray-700" />
      </button>

      {/* Desktop Spacer */}
      <div className="hidden md:block" />

      {/* Right Section */}
      <div className="flex items-center gap-6">
        {/* Notification */}
        <button className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <Bell size={22} className="text-gray-600" />

          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] h-5 w-5 rounded-full flex items-center justify-center font-medium">
            {dashboardOverview.notifications}
          </span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-xl transition-colors">
          <img
            src={dashboardOverview.profileImage}
            alt={dashboardOverview.collegeName}
            className="w-10 h-10 rounded-full border border-gray-200 object-cover"
          />

          <div className="hidden sm:block">
            <h4 className="text-sm font-semibold text-gray-800">
              {dashboardOverview.collegeName}
            </h4>

            <p className="text-xs text-gray-500">
              College Admin
            </p>
          </div>

          <ChevronDown
            size={18}
            className="text-gray-500"
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;