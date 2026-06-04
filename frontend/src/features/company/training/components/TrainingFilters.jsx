import { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';

export const TrainingFilters = ({ filters, updateFilter, getUniqueValues }) => {
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [mentorDropdownOpen, setMentorDropdownOpen] = useState(false);

  const mentors = getUniqueValues('mentor');
  const statuses = ['Active', 'Completed'];

  const handleStatusSelect = (value) => {
    updateFilter('status', value);
    setStatusDropdownOpen(false);
  };

  const handleMentorSelect = (value) => {
    updateFilter('mentor', value);
    setMentorDropdownOpen(false);
  };

  return (
    <div className="flex items-center justify-between gap-4 bg-white border border-slate-200 rounded-t-2xl px-5 py-5 shadow-sm">
      {/* Search Input */}
      <div className="relative flex-1 flex items-center">
        <Search
          className="absolute left-4 text-gray-400"
          size={20}
        />

        <input
          type="text"
          placeholder="Search programs..."
          value={filters.search}
          onChange={(e) => updateFilter('search', e.target.value)}
          className="
            w-full
            h-12
            rounded-xl
            border
            border-slate-200
            bg-white
            pl-12
            pr-4
            text-sm
            text-gray-700
            placeholder:text-gray-400
            outline-none
            focus:ring-2
            focus:ring-blue-500
            focus:border-transparent
          "
        />
      </div>

      {/* Filters on the right */}
      <div className="flex items-center gap-4">
        {/* Status Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
            className="h-12 w-[120px] rounded-xl border border-slate-200 bg-white px-4 flex items-center justify-between text-sm font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer"
          >
            <span>{filters.status || 'Status'}</span>
            <ChevronDown className="w-4 h-4 text-gray-400" size={18} />
          </button>

          {/* Status Dropdown Menu */}
          {statusDropdownOpen && (
            <div className="absolute right-0 mt-2 w-[160px] bg-white border border-slate-200 rounded-lg shadow-lg z-50">
              <button
                onClick={() => handleStatusSelect('')}
                className={`block w-full text-left px-4 py-2 text-sm first:rounded-t-lg last:rounded-b-lg ${!filters.status ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-50'
                  }`}
              >
                All Statuses
              </button>
              {statuses.map(status => (
                <button
                  key={status}
                  onClick={() => handleStatusSelect(status)}
                  className={`block w-full text-left px-4 py-2 text-sm last:rounded-b-lg ${filters.status === status ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  {status}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Mentor Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => setMentorDropdownOpen(!mentorDropdownOpen)}
            className="h-12 w-[140px] rounded-xl border border-slate-200 bg-white px-4 flex items-center justify-between text-sm font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer"
          >
            <span>{filters.mentor || 'Mentor'}</span>
            <ChevronDown className="w-4 h-4 text-gray-400" size={18} />
          </button>

          {/* Mentor Dropdown Menu */}
          {mentorDropdownOpen && (
            <div className="absolute right-0 mt-2 w-[180px] bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
              <button
                onClick={() => handleMentorSelect('')}
                className={`block w-full text-left px-4 py-2 text-sm first:rounded-t-lg ${!filters.mentor ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-50'
                  }`}
              >
                All Mentors
              </button>
              {mentors.map(mentor => (
                <button
                  key={mentor}
                  onClick={() => handleMentorSelect(mentor)}
                  className={`block w-full text-left px-4 py-2 text-sm last:rounded-b-lg ${filters.mentor === mentor ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  {mentor}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

