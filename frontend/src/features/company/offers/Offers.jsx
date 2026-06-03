import "./Offers.css";
import { useState } from "react";

import {
  FiSearch,
  FiFilter,
  FiDownload,
  FiMoreVertical,
  FiCalendar,
  FiFileText,
} from "react-icons/fi";

const offersData = [
  {
    initials: "RP",
    name: "Rahul Patil",
    role: "Senior Software Engineer",
    package: "₹18 LPA",
    status: "Accepted",
    joining: "Jul 1, 2026",
  },
  {
    initials: "SR",
    name: "Sneha Reddy",
    role: "UI/UX Designer",
    package: "₹12 LPA",
    status: "Pending",
    joining: "Jul 15, 2026",
  },
  {
    initials: "AK",
    name: "Amit Kumar",
    role: "Product Manager",
    package: "₹22 LPA",
    status: "Accepted",
    joining: "Jun 20, 2026",
  },
  {
    initials: "PS",
    name: "Priya Sharma",
    role: "Data Analyst",
    package: "₹14 LPA",
    status: "Sent",
    joining: "Jul 10, 2026",
  },
  {
    initials: "RV",
    name: "Ravi Verma",
    role: "DevOps Engineer",
    package: "₹16 LPA",
    status: "Accepted",
    joining: "Jul 5, 2026",
  },
  {
    initials: "MI",
    name: "Meera Iyer",
    role: "Full Stack Developer",
    package: "₹15 LPA",
    status: "Declined",
    joining: "Jun 25, 2026",
  },
];

const Offers = () => {
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    role: '',
  });
  
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  // Get unique statuses and roles from data
  const statuses = ['Accepted', 'Pending', 'Sent', 'Declined'];
  const roles = [...new Set(offersData.map(offer => offer.role))].sort();

  // Filter logic
  const filteredOffers = offersData.filter(offer => {
    const matchSearch = offer.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                       offer.role.toLowerCase().includes(filters.search.toLowerCase());
    const matchStatus = !filters.status || offer.status === filters.status;
    const matchRole = !filters.role || offer.role === filters.role;
    
    return matchSearch && matchStatus && matchRole;
  });

  const handleSearchChange = (e) => {
    setFilters(prev => ({
      ...prev,
      search: e.target.value
    }));
  };

  const handleStatusSelect = (status) => {
    setFilters(prev => ({
      ...prev,
      status: status
    }));
    setStatusDropdownOpen(false);
  };

  const handleRoleSelect = (role) => {
    setFilters(prev => ({
      ...prev,
      role: role
    }));
    setRoleDropdownOpen(false);
  };

  return (
    <div className="offers-page">

      <div className="offers-header">

        <div>
          <h1>Offer Management</h1>

          <p>
            Track and manage candidate offers
          </p>
        </div>

        <button className="generate-btn">
          <FiFileText />
          Generate Offer
        </button>

      </div>

      <div className="offers-stats">

        <div className="stat-card">
          <h2 style={{ color: "#101828" }}>42</h2>
          <p>Total Offers</p>
        </div>

        <div className="stat-card">
          <h2 style={{ color: "#22c55e" }}>28</h2>
          <p>Accepted</p>
        </div>

        <div className="stat-card">
          <h2 style={{ color: "#f59e0b" }}>9</h2>
          <p>Pending</p>
        </div>

        <div className="stat-card">
          <h2 style={{ color: "#ef4444" }}>5</h2>
          <p>Declined</p>
        </div>

      </div>

      <div className="offers-table-card">

        <div className="offers-filters">

          <div className="search-box">

            <FiSearch />

            <input
              type="text"
              placeholder="Search offers..."
              value={filters.search}
              onChange={handleSearchChange}
            />

          </div>

          {/* Status Filter Dropdown */}
          <div className="filter-dropdown-wrapper">
            <button 
              className="filter-btn"
              onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
            >
              <FiFilter />
              {filters.status || 'Status'}
            </button>
            
            {statusDropdownOpen && (
              <div className="filter-dropdown-menu">
                <button
                  className={`dropdown-item ${!filters.status ? 'active' : ''}`}
                  onClick={() => handleStatusSelect('')}
                >
                  All Statuses
                </button>
                {statuses.map(status => (
                  <button
                    key={status}
                    className={`dropdown-item ${filters.status === status ? 'active' : ''}`}
                    onClick={() => handleStatusSelect(status)}
                  >
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Role Filter Dropdown */}
          <div className="filter-dropdown-wrapper role-filter-dropdown">
            <button 
              className="filter-btn"
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            >
              <FiFilter />
              {filters.role || 'Role'}
            </button>
            
            {roleDropdownOpen && (
              <div className="filter-dropdown-menu role-dropdown-menu">
                <button
                  className={`dropdown-item ${!filters.role ? 'active' : ''}`}
                  onClick={() => handleRoleSelect('')}
                >
                  All Roles
                </button>
                {roles.map(role => (
                  <button
                    key={role}
                    className={`dropdown-item ${filters.role === role ? 'active' : ''}`}
                    onClick={() => handleRoleSelect(role)}
                  >
                    {role}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

        <div className="table-wrapper">

          {filteredOffers.length === 0 ? (
            <div className="empty-state">
              <p>No offers found</p>
            </div>
          ) : (
            <table className="offers-table">

              <thead>

                <tr>
                  <th>CANDIDATE</th>
                  <th>ROLE</th>
                  <th>PACKAGE</th>
                  <th>STATUS</th>
                  <th>JOINING DATE</th>
                  <th>ACTIONS</th>
                </tr>

              </thead>

              <tbody>

                {filteredOffers.map((offer, index) => (

                  <tr key={index}>

                    <td>

                      <div className="candidate-cell">

                        <div className="avatar">
                          {offer.initials}
                        </div>

                        <span>{offer.name}</span>

                      </div>

                    </td>

                    <td>{offer.role}</td>

                    <td className="package">
                      {offer.package}
                    </td>

                    <td>

                      <span
                        className={`status-badge ${offer.status.toLowerCase()}`}
                      >
                        {offer.status}
                      </span>

                    </td>

                    <td>

                      <div className="joining-date">

                        <FiCalendar />

                        {offer.joining}

                      </div>

                    </td>

                    <td>

                      <div className="actions">

                        <FiDownload />

                        <FiMoreVertical />

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>
          )}

        </div>

      </div>

    </div>
  );
};

export default Offers;
