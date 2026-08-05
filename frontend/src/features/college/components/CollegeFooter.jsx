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
            ? "bg-[#1A1A1A] border-[#2D2D2D] text-gray-400"
            : "bg-white border-gray-200 text-gray-500"
        }
      `}
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-2">
        <p>
          &copy; {new Date().getFullYear()} <strong>Uptoskills LMS</strong>. All rights
          reserved.
        </p>

        <div className="flex items-center gap-5">
          <button className="hover:text-[#ff6d34] transition-colors">
            Privacy Policy
          </button>

          <button className="hover:text-[#ff6d34] transition-colors">
            Terms & Conditions
          </button>

          <button className="hover:text-[#ff6d34] transition-colors">
            Help
          </button>
        </div>
      </div>
    </footer>
  );
};

export default CollegeFooter;