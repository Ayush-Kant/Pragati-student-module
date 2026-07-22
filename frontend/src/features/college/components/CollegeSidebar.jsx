import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import sidebarMenu from "./sidebarMenu";
import { X, LogOut } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import toast from "react-hot-toast";

const CollegeSidebar = ({ openSidebar, setOpenSidebar, darkMode }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    logout();
    toast.success("Logged out successfully");
    navigate("/login", { replace: true });
  };

  return (
    <aside
      className={`
        fixed top-0 left-0 z-50
        h-screen w-64
        transition-transform duration-300
        border-r
        ${
          darkMode
            ? "bg-[#1A1A1A] border-[#2D2D2D] text-white"
            : "bg-white border-gray-200 text-[#2D3436]"
        }
        ${
          openSidebar
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }
      `}
    >
      {/* Logo */}
      <div className={`h-20 flex items-center justify-between px-6 border-b ${
        darkMode ? "border-[#2D2D2D]" : "border-gray-200"
      }`}>
        <div className="flex items-center gap-3">
          <img
            src="https://uptoskills.com/uslogo.webp"
            alt="Uptoskills"
            className="h-9 w-9"
          />
          <div>
            <h1 className="font-bold text-base leading-tight text-[#ff6d34]">
              Uptoskills LMS
            </h1>
            <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              College Management
            </p>
          </div>
        </div>

        <button
          className="md:hidden"
          onClick={() => setOpenSidebar(false)}
        >
          <X size={22} />
        </button>
      </div>

      {/* Menu */}
      <div className="overflow-y-auto h-[calc(100vh-80px)] px-3 py-6 flex flex-col justify-between">
        <div>
          {sidebarMenu.map((section) => (
            <div key={section.title} className="mb-6">
              <h3 className={`text-xs uppercase font-semibold tracking-wider px-3 mb-2 ${
                darkMode ? "text-gray-500" : "text-gray-400"
              }`}>
                {section.title}
              </h3>

              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      onClick={(e) => {
                        setOpenSidebar(false);
                        if (item.name === "Logout") {
                          handleLogout(e);
                        }
                      }}
                      className={({ isActive }) =>
                        `
                          flex items-center gap-3
                          px-4 py-2.5
                          rounded-lg
                          text-sm font-medium
                          transition-all duration-200
                          ${
                            isActive
                              ? "bg-[#ff6d34] text-white shadow-sm"
                              : darkMode
                              ? "text-gray-300 hover:bg-[#2D2D2D] hover:text-white"
                              : "text-gray-600 hover:bg-orange-50 hover:text-[#ff6d34]"
                          }
                        `
                      }
                    >
                      <Icon size={20} />

                      <span>{item.name}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Logout Button */}
        {/* <div className={`mt-4 border-t pt-4 ${
          darkMode ? "border-[#2D2D2D]" : "border-gray-200"
        }`}>
          <button
            onClick={handleLogout}
            className={`
              flex items-center gap-3 w-full
              px-4 py-2.5 rounded-lg text-sm font-medium
              transition-all duration-200
              ${darkMode
                ? "text-red-400 hover:bg-red-900/20 hover:text-red-300"
                : "text-red-500 hover:bg-red-50"
              }
            `}
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div> */}
      </div>
    </aside>
  );
};

export default CollegeSidebar;