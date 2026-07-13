import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import CompanyFooter from "../components/CompanyFooter";
import CompanySideBar from "../components/CompanySideBar";
import CompanyNavBar from "../navbar/components/Navbar";
import { useCompanyProfile } from "../hooks/useCompanyProfile";

const CompanyLayout = () => {

  const {
    profile,
    loading,
    error,
    saveProfile
  } = useCompanyProfile();

  // Sidebar Toggle
  const [openSidebar, setOpenSidebar] = useState(false);

  // Dark Mode
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div
      className={`
        min-h-screen transition-all duration-300
        ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}
      `}
    >

      {/* Navbar */}
      <CompanyNavBar
        openSidebar={openSidebar}
        setOpenSidebar={setOpenSidebar}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        profile={profile}
      />

      <div className="flex">

        {/* Sidebar */}
        <CompanySideBar
          openSidebar={openSidebar}
          setOpenSidebar={setOpenSidebar}
          darkMode={darkMode}
        />

        {/* Mobile Sidebar Overlay Backdrop */}
        {openSidebar && (
          <div
            onClick={() => setOpenSidebar(false)}
            className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300"
          />
        )}

        {/* Main Section */}
        <div className="flex-1 md:ml-64 flex flex-col min-h-screen">

          {/* Page Content */}
          <main className="flex-1 pt-20 p-6">

            <Outlet
              context={{
                profile,
                loading,
                error,
                saveProfile,
                darkMode,
              }}
            />

          </main>

          {/* Footer */}
          <CompanyFooter darkMode={darkMode} />

        </div>

      </div>

    </div>
  );
};

export default CompanyLayout;