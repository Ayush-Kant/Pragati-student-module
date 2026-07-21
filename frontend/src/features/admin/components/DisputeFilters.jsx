import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
const DisputeFilters = ({ filters, setFilters,setPage }) => {
  const [search, setSearch] = useState(filters.search || "");
  const { darkMode } = useOutletContext();

  // 300ms debounce for search
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({
        ...prev,
        search,
      }));

      setPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));

    setPage(1);
  };
  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-4 mb-6`}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <input
          type="text"
          placeholder="Search disputes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`${darkMode ? 'bg-gray-600 text-white placeholder:text-gray-400 border-gray-500' : 'bg-white text-gray-700 placeholder:text-gray-500 border-gray-300'} border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />

        {/* Type */}
        <select
          name="type"
          value={filters.type}
          onChange={handleChange}
          className="border rounded-md px-3 py-2"
        >
          <option value="">All Types</option>
          <option value="Mentor Issue">Mentor Issue</option>
          <option value="Payment">Payment</option>
          <option value="Attendance">Attendance</option>
          <option value="Assessment">Assessment</option>
        </select>

        {/* Status */}
        <select
          name="status"
          value={filters.status}
          onChange={handleChange}
          className="border rounded-md px-3 py-2"
        >
          <option value="">All Status</option>
          <option value="open">Open</option>
          <option value="in review">In Review</option>
          <option value="resolved">Resolved</option>
          <option value="escalated">Escalated</option>
        </select>

        {/* Priority */}
        <select
          name="priority"
          value={filters.priority}
          onChange={handleChange}
          className="border rounded-md px-3 py-2"
        >
          <option value="">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>
    </div>
  );
};

export default DisputeFilters;