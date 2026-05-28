import React from 'react';

const ActivitySidebar = () => {
  return (
    <div className="space-y-6">
      <div className="p-4 bg-white rounded-lg shadow">
        <h3 className="font-semibold text-gray-800">Create Activity</h3>
        <p className="text-sm text-gray-500">Select activity type to get started</p>
        {/* Activity Type Picker will go here */}
      </div>
      <div className="p-4 bg-white rounded-lg shadow">
        <h3 className="font-semibold text-gray-800">Activity Overview</h3>
        {/* Donut chart and stats will go here */}
        <div className="flex items-center justify-center h-40 my-4 bg-gray-100 rounded-lg">
            <p className="text-gray-500">Chart Placeholder</p>
        </div>
      </div>
      <div className="p-4 bg-white rounded-lg shadow">
        <h3 className="font-semibold text-gray-800">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-4 mt-4">
            <button className="flex flex-col items-center p-2 text-center bg-gray-50 rounded-lg hover:bg-gray-100">
                <span className="text-xl">📄</span>
                <span className="text-sm font-medium text-gray-700">Activity Templates</span>
            </button>
            <button className="flex flex-col items-center p-2 text-center bg-gray-50 rounded-lg hover:bg-gray-100">
                <span className="text-xl">📅</span>
                <span className="text-sm font-medium text-gray-700">Manage Deadlines</span>
            </button>
            <button className="flex flex-col items-center p-2 text-center bg-gray-50 rounded-lg hover:bg-gray-100">
                <span className="text-xl">👥</span>
                <span className="text-sm font-medium text-gray-700">Bulk Assign Activity</span>
            </button>
            <button className="flex flex-col items-center p-2 text-center bg-gray-50 rounded-lg hover:bg-gray-100">
                <span className="text-xl">📊</span>
                <span className="text-sm font-medium text-gray-700">View Activity History</span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default ActivitySidebar;
