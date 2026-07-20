import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { getProfile } from "../services/collegeService";

import CollegeNavbar from "../navbar/components/navbar";
import CollegeSidebar from "../components/CollegeSidebar";
import MobileSidebar from "../dashboard/components/layout/MobileSidebar";
import CollegeFooter from "../components/CollegeFooter";

const CollegeLayout = () => {
  // Sidebar Toggle
  const [openSidebar, setOpenSidebar] = useState(false);

  // Dark Mode
  const [darkMode, setDarkMode] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkProfile = async () => {
      // Don't redirect if they are already on the add-profile page
      if (location.pathname === "/college/add-profile") return;
      
      try {
        const result = await getProfile();
        // If the API returns success:true but data is null, or if it outright fails
        if (!result || !result.data) {
          navigate("/college/add-profile", { replace: true });
        }
      } catch (err) {
        console.error("Failed to fetch profile during layout mount:", err);
      }
    };
    
    checkProfile();
  }, [navigate, location.pathname]);

  if (location.pathname === "/college/add-profile") {
    return (
      <div className={`min-h-screen transition-all duration-300 flex items-center justify-center ${
        darkMode ? "bg-slate-900 text-white" : "bg-slate-100 text-black"
      }`}>
        <div className="w-full max-w-4xl p-6">
          <Outlet context={{ darkMode }} />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        darkMode ? "bg-slate-900 text-white" : "bg-slate-100 text-black"
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
