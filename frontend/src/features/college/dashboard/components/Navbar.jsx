import React from "react";
import {
  Menu,
  Bell,
  Search,
  Moon,
  Sun,
  UserCircle,
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
        h-20 px-6
        flex items-center justify-between
        border-b z-30
        ${
          darkMode
            ? "bg-gray-900 border-gray-700"
            : "bg-white border-gray-200"
        }
      `}
    >
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          className="md:hidden"
          onClick={() => setOpenSidebar(true)}
        >
          <Menu size={24} />
        </button>

        <div className="hidden md:flex items-center bg-gray-100 rounded-xl px-4 py-2 w-80">
          <Search
            size={18}
            className="text-gray-500"
          />

          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none ml-3 w-full"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-5">
        {/* Dark Mode */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          {darkMode ? (
            <Sun size={20} />
          ) : (
            <Moon size={20} />
          )}
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-gray-100">
          <Bell size={20} />

          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* User */}
        <div className="flex items-center gap-3">
          <UserCircle size={38} />

          <div className="hidden md:block">
            <h3 className="font-semibold">
              College Admin
            </h3>

            <p className="text-xs text-gray-500">
              Administrator
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;