import "./Offers.css";

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
            />

          </div>

          <button className="filter-btn">
            <FiFilter />
            Status
          </button>

          <button className="filter-btn">
            <FiFilter />
            Role
          </button>

        </div>

        <div className="table-wrapper">

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

              {offersData.map((offer, index) => (

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

        </div>

      </div>

    </div>
  );
};

export default Offers;