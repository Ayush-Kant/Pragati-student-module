import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

import AdminNavbar from "./adminNavbar/AdminNavbar";
import AdminSidebar from "./adminSidebar/AdminSidebar";
import AdminFooter from "./adminFooter/AdminFooter";
import { useAdminProfile } from "./hooks/useAdminProfile";

const AdminLayout = () => {
  const {
    profile,
    loading,
    error,
    saveProfile,
  } = useAdminProfile();

  // Sidebar Toggle
  const [openSidebar, setOpenSidebar] = useState(false);

  // Dark Mode
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    localStorage.setItem(
      "theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  return (
    <div
      className={`
        min-h-screen transition-all duration-300
        ${
          darkMode
            ? "bg-gray-900 text-white"
            : "bg-gray-100 text-black"
        }
      `}
    >
      {/* Navbar */}
      <AdminNavbar
        openSidebar={openSidebar}
        setOpenSidebar={setOpenSidebar}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        profile={profile}
      />

      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar
          openSidebar={openSidebar}
          setOpenSidebar={setOpenSidebar}
          darkMode={darkMode}
        />

        {/* Main Section */}
        <div className="flex-1 min-w-0 md:ml-[270px] flex flex-col min-h-screen overflow-x-hidden">
          {/* Page Content */}
          <main className="flex-1 min-w-0 pt-20 p-6">
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
          <AdminFooter darkMode={darkMode} />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;