import React from "react";
import {
  Menu,
  Bell,
  Search,
  Moon,
  Sun,
  UserCircle2,
} from "lucide-react";

const Navbar = ({
  openSidebar,
  setOpenSidebar,
  darkMode,
  setDarkMode,
}) => {
  return (
    <header
      className={`
        fixed top-0 right-0 left-0 md:left-64
        h-20 z-30
        border-b
        ${
          darkMode
            ? "bg-slate-900 border-slate-800"
            : "bg-white border-gray-200"
        }
      `}
    >
      <div className="h-full px-6 flex items-center justify-between">

        {/* Left */}
        <div className="flex items-center gap-4">

          {/* Mobile Menu */}
          <button
            onClick={() => setOpenSidebar(true)}
            className="md:hidden"
          >
            <Menu size={24} />
          </button>

          {/* Search */}
          <div
            className={`
              hidden md:flex
              items-center gap-3
              rounded-xl
              px-4 py-2
              w-80
              ${
                darkMode
                  ? "bg-slate-800"
                  : "bg-gray-100"
              }
            `}
          >
            <Search size={18} className="text-gray-500" />

            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none flex-1"
            />
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-5">

          {/* Dark Mode */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800"
          >
            {darkMode ? (
              <Sun size={20} />
            ) : (
              <Moon size={20} />
            )}
          </button>

          {/* Notification */}
          <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800">
            <Bell size={20} />

            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500" />
          </button>

          {/* Profile */}
          <div className="flex items-center gap-3">

            <UserCircle2
              size={40}
              className="text-blue-600"
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