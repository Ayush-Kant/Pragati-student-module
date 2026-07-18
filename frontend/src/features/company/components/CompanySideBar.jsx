
import React from "react";
import { NavLink } from "react-router-dom";
import { sidebarItems } from "../sidebar/components/sidebarData";
import logo from "../../../assets/logo.png";
import { RiCloseLine } from "react-icons/ri";

export default function CompanySideBar({ openSidebar, setOpenSidebar }) {
  return (
    <aside
      className={`
        fixed top-0 left-0 z-50
        h-screen w-64
        overflow-y-auto
        bg-[#f7f7f8]
        border-r border-gray-200
        transition-all duration-300
        ${openSidebar ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
        md:top-[70px]
        md:h-[calc(100vh-70px)]
      `}
    >
      {/* Mobile Close Button */}
      <button
        onClick={() => setOpenSidebar && setOpenSidebar(false)}
        className="md:hidden absolute top-5 right-5 text-gray-500 text-2xl hover:text-gray-700 transition-colors"
      >
        <RiCloseLine />
      </button>

      {/* Navigation Links */}
      <div className="px-3 pt-6 pb-8 space-y-1">
        {sidebarItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={index}
              to={item.path}
              onClick={() => setOpenSidebar && setOpenSidebar(false)}
              className={({ isActive }) => `
                flex items-center gap-4
                px-4 py-3
                rounded-xl
                transition-all duration-200
                ${
                  isActive
                    ? "bg-[#e6f0ff] text-[#2563eb] shadow-sm font-semibold"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }
              `}
            >
              {({ isActive }) => (
                <>
                  <div
                    className="flex items-center justify-center text-lg transition-transform duration-200"
                    style={{ color: isActive ? "inherit" : item.color }}
                  >
                    <Icon size={18} />
                  </div>
                  <span className="text-[15px] font-medium">{item.name}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </aside>
  );
}
