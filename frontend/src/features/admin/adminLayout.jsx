import React, { useState } from "react";
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
    saveProfile
  } = useAdminProfile();

  // Sidebar Toggle
  const [openSidebar, setOpenSidebar] = useState(false);

  // Dark Mode
  const [darkMode, setDarkMode] = useState(false);

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
        <div className="flex-1 md:ml-64 flex flex-col min-h-screen">

          {/* Page Content */}
          <main className="flex-1 pt-20 p-6">

            <Outlet
              context={{
              profile,
              loading,
              error,
              saveProfile
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