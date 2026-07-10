import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import CollegeNavbar from "../navbar/components/Navbar";
import CollegeSidebar from "../components/CollegeSidebar";
import MobileSidebar from "../dashboard/components/layout/MobileSidebar";
import CollegeFooter from "../components/CollegeFooter";

const CollegeLayout = () => {
  // Sidebar Toggle
  const [openSidebar, setOpenSidebar] = useState(false);

  // Dark Mode
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        darkMode
          ? "bg-slate-900 text-white"
          : "bg-slate-100 text-black"
      }`}
    >
      {/* Navbar */}
      <CollegeNavbar
        openSidebar={openSidebar}
        setOpenSidebar={setOpenSidebar}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <CollegeSidebar
            openSidebar={openSidebar}
            setOpenSidebar={setOpenSidebar}
            darkMode={darkMode}
          />
        </div>

        {/* Mobile Sidebar */}
        <MobileSidebar
          openSidebar={openSidebar}
          setOpenSidebar={setOpenSidebar}
          darkMode={darkMode}
        />

        {/* Main Section */}
        <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
          {/* Page Content */}
          <main className="flex-1 pt-20 p-6">
            <Outlet
              context={{
                darkMode,
              }}
            />
          </main>

          {/* Footer */}
          <CollegeFooter darkMode={darkMode} />
        </div>
      </div>
    </div>
  );
};

export default CollegeLayout;