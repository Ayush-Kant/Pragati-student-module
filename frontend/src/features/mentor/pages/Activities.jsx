import React from 'react';
import ActivityFeed from '../components/activities/ActivityFeed';

import { Link } from 'react-router-dom';

const Activities = () => {
  const handleExportReport = () => {
    // A simple functional export by invoking the print dialog which allows "Save as PDF"
    window.print();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .printable-container, .printable-container * {
            visibility: visible;
          }
          .printable-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print, .no-print * {
            display: none !important;
          }
        }
        @media (max-width: 768px) {
          .activity-header {
            flex-direction: column;
            align-items: flex-start;
          }
          .activity-actions {
            width: 100%;
            justify-content: space-between;
            margin-top: 1rem;
          }
        }
      `}</style>
      <header className="flex flex-wrap items-center justify-between gap-4 mb-6 activity-header">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold leading-tight tracking-tight text-gray-900">
            Activity Report
          </h1>
          <p className="text-sm text-gray-500 no-print mt-1">
            Create, assign, and track all learning activities and engagement.
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 no-print activity-actions">
          <button onClick={handleExportReport} className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">
            Export Report (.pdf)
          </button>
          <Link to="/mentor/activities/create" className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700">
            + Create Activity
          </Link>
        </div>
      </header>
      <div className="printable-container">
        <h1 className="text-2xl sm:text-3xl font-bold leading-tight tracking-tight text-gray-900 mb-4 hidden print:block">
          Activity Report
        </h1>
        <ActivityFeed />
      </div>
    </div>
  );
};

export default Activities;
