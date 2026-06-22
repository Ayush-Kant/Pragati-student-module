import React from 'react';
import { Link } from 'react-router-dom';

const ActivityTemplates = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <header className="mb-6">
        <div className="flex items-center gap-4">
            <Link to="/mentor/activities" className="text-sm text-indigo-600 hover:text-indigo-800 items-center flex">
                &larr; Back to Activities
            </Link>
        </div>
        <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-gray-900">
          Activity Templates
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Manage and use your saved templates for quick activity creation.
        </p>
      </header>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <p className="text-gray-500 text-center py-8">Templates feature is coming soon...</p>
      </div>
    </div>
  );
};

export default ActivityTemplates;