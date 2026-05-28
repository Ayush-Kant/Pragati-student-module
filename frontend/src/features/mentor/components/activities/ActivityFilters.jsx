import React from 'react';

const ActivityFilters = () => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-lg shadow">
      <div className="flex-grow">
        <input
          type="text"
          placeholder="Search activities by title or type..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div className="flex items-center gap-4">
        <select className="px-4 py-2 border border-gray-300 rounded-md">
          <option>All Types</option>
          <option>Assignment</option>
          <option>Quiz</option>
          <option>Coding</option>
          <option>Case Study</option>
        </select>
        <select className="px-4 py-2 border border-gray-300 rounded-md">
          <option>All Status</option>
          <option>Pending</option>
          <option>Completed</option>
          <option>In Progress</option>
          <option>Draft</option>
        </select>
        <select className="px-4 py-2 border border-gray-300 rounded-md">
          <option>All Mentees</option>
        </select>
        <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
          Filter
        </button>
      </div>
    </div>
  );
};

export default ActivityFilters;
