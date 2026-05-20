import React from "react";

const AdminFooter = ({ darkMode }) => {
  return (
    <footer
      className={`
        border-t px-6 py-4 text-sm
        flex flex-col md:flex-row
        items-center justify-between
        transition-all duration-300

        ${
          darkMode
            ? "bg-gray-900 border-gray-700 text-gray-400"
            : "bg-white border-gray-200 text-gray-500"
        }
      `}
    >

      {/* Left */}
      <p>
        © 2026 Pragati Admin Panel. All rights reserved.
      </p>

      {/* Right */}
      <div className="flex items-center gap-4 mt-2 md:mt-0">

        <button className="hover:text-sky-500 transition">
          Privacy Policy
        </button>

        <button className="hover:text-sky-500 transition">
          Terms
        </button>

        <button className="hover:text-sky-500 transition">
          Support
        </button>

      </div>

    </footer>
  );
};

export default AdminFooter;