import React from "react";
import {
  Menu,
  Bell,
  Search,
  UserCircle2,
} from "lucide-react";
import ThemeToggle from "../../../../components/common/ThemeToggle";

const Navbar = ({
  openSidebar,
  setOpenSidebar,
}) => {
  return (
    <header
      className="fixed top-0 right-0 left-0 md:left-64 h-20 z-30 border-b bg-white dark:bg-[#1A1A1A] border-gray-200 dark:border-[#2D2D2D] text-gray-800 dark:text-gray-100 shadow-sm transition-colors duration-300"
    >
      <div className="h-full px-6 flex items-center justify-between">

        {/* Left */}
        <div className="flex items-center gap-4">

          {/* Mobile Menu */}
          <button
            onClick={() => setOpenSidebar(true)}
            className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <Menu size={24} />
          </button>

          {/* Branding */}
          <div className="hidden md:hidden items-center gap-3 mr-4 pr-4 border-r border-gray-200 dark:border-gray-700">
            <img
              src="https://uptoskills.com/uslogo.webp"
              alt="Uptoskills"
              className="h-9 w-9"
            />
            <div>
              <h1 className="font-bold text-base leading-tight text-[#ff6d34]">
                Uptoskills LMS
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                College Management
              </p>
            </div>
          </div>

          {/* Search */}
          <div
            className="hidden md:flex items-center gap-3 rounded-lg px-4 py-2 w-80 bg-gray-100 dark:bg-[#2D2D2D] text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 transition-colors duration-300"
          >
            <Search size={18} className="text-gray-500 dark:text-gray-400" />

            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none flex-1 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-sm"
            />
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notification */}
          <button className="relative p-2 rounded-full text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition">
            <Bell size={20} />

            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
          </button>

          {/* Profile */}
          <div className="flex items-center gap-3">

            <UserCircle2
              size={40}
              className="text-[#ff6d34]"
            />

            <div className="hidden md:block">
              <h4 className="font-semibold">
                College Admin
              </h4>

              <p className="text-xs text-gray-500">
                Administrator
              </p>
            </div>

          </div>

        </div>

      </div>
    </header>
  );
};

export default Navbar;