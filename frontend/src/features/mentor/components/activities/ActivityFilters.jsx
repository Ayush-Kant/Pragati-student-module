import React from 'react';

const ActivityFilters = ({ filters = {}, setFilters }) => {
  const handleChange = (e) => {
    if (!setFilters) return;
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-4 p-4 bg-white rounded-lg shadow">
      <div className="w-full lg:flex-grow">
        <input
          name="search"
          type="text"
          value={filters.search || ''}
          onChange={handleChange}
          placeholder="Search activities by title or type..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div className="flex flex-wrap lg:flex-nowrap items-center gap-2 w-full lg:w-auto">
        <select name="type" value={filters.type || 'All Types'} onChange={handleChange} className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md">
          <option>All Types</option>
          <option>Assignment</option>
          <option>Quiz</option>
          <option>Coding</option>
          <option>Case Study</option>
        </select>
        <select name="status" value={filters.status || 'All Status'} onChange={handleChange} className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md">
          <option>All Status</option>
          <option>Pending</option>
          <option>Completed</option>
          <option>In Progress</option>
          <option>Draft</option>
        </select>
        <select name="mentee" value={filters.mentee || 'All Mentees'} onChange={handleChange} className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md">
          <option>All Mentees</option>
          <option>John Doe</option>
          <option>Jane Smith</option>
        </select>
        <button className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
          Filter
        </button>
      </div>
    </div>
  );
};

export default ActivityFilters;
