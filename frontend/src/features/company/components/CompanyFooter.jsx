import React from "react";

function CompanyFooter({ darkMode }) {
  const currentYear = new Date().getFullYear();
  return (
    <footer className={`border-t py-6 px-8 transition-colors duration-300 mt-auto ${
      darkMode 
        ? "bg-gray-900 border-gray-800 text-gray-400" 
        : "bg-white border-gray-200 text-gray-500"
    }`}>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-7xl mx-auto w-full">
        <div className="text-sm text-center md:text-left">
          &copy; {currentYear} <span className="font-semibold text-blue-600">Pragati</span> Company Portal. All rights reserved.
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
          <a href="#support" className="hover:text-blue-600 transition-colors">Support</a>
          <a href="#privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
          <a href="#terms" className="hover:text-blue-600 transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}

export default CompanyFooter;