import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import sidebarMenu from "./sidebarMenu";
import { GraduationCap, X, LogOut } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

const CollegeSidebar = ({ openSidebar, setOpenSidebar, darkMode }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
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
            ? "bg-slate-900 border-slate-800 text-white"
            : "bg-white border-gray-200 text-gray-900"
        }
        ${
          openSidebar
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }
      `}
    >
      {/* Logo */}
      <div className="h-20 flex items-center justify-between px-6 border-b border-inherit">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white p-2 rounded-xl">
            <GraduationCap size={22} />
          </div>

          <div>
            <h1 className="font-bold text-lg">
              College Portal
            </h1>

            <p className="text-xs text-gray-500">
              Placement Management
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
      <div className="overflow-y-auto h-[calc(100vh-80px)] px-4 py-6 flex flex-col justify-between">
        <div>
          {sidebarMenu.map((section) => (
            <div key={section.title} className="mb-8">
              <h3 className="text-xs uppercase font-semibold tracking-wider text-gray-400 mb-3 px-3">
                {section.title}
              </h3>

              <div className="space-y-2">
                {section.items.map((item) => {
                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      onClick={() => setOpenSidebar(false)}
                      className={({ isActive }) =>
                        `
                          flex items-center gap-3
                          px-4 py-3
                          rounded-xl
                          transition-all
                          ${
                            isActive
                              ? "bg-blue-600 text-white shadow"
                              : darkMode
                              ? "hover:bg-slate-800"
                              : "hover:bg-gray-100"
                          }
                        `
                      }
                    >
                      <Icon size={20} />

                      <span className="text-sm font-medium">
                        {item.name}
                      </span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Logout Button */}
        <div className="mt-8 border-t border-inherit pt-6">
          <button
            onClick={handleLogout}
            className={`
              flex items-center gap-3 w-full
              px-4 py-3 rounded-xl font-medium
              transition-all text-red-600
              ${darkMode ? "hover:bg-red-900/20 hover:text-red-500" : "hover:bg-red-50"}
            `}
          >
            <LogOut size={20} />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default CollegeSidebar;