import React from "react";

const CollegeFooter = ({ darkMode }) => {
  return (
    <footer
      className={`
        border-t
        px-6 py-4
        text-sm
        transition-all duration-300
        ${
          darkMode
            ? "bg-slate-900 border-slate-800 text-gray-400"
            : "bg-white border-gray-200 text-gray-600"
        }
      `}
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-2">
        <p>
          © {new Date().getFullYear()} <strong>Pragati</strong>. All rights
          reserved.
        </p>

        <div className="flex items-center gap-5">
          <button className="hover:text-blue-600 transition-colors">
            Privacy Policy
          </button>

          <button className="hover:text-blue-600 transition-colors">
            Terms & Conditions
          </button>

          <button className="hover:text-blue-600 transition-colors">
            Help
          </button>
        </div>
      </div>
    </footer>
  );
};

export default CollegeFooter;