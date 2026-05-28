import React from 'react';
import ActivityFeed from '../components/activities/ActivityFeed';

const Activities = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <header className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
            Activity
          </h1>
          <p className="text-sm text-gray-500">
            Create, assign, and track all learning activities and engagement.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">
            Export Report
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700">
            + Create Activity
          </button>
        </div>
      </header>
      <ActivityFeed />
    </div>
  );
};

export default Activities;
