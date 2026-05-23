import "./../styles/companyStatsRow.css";

import {
  FaBriefcase,
  FaUsers,
  FaCalendarAlt,
  FaFileAlt,
  FaChartLine,
} from "react-icons/fa";

const CompanyStatsRow = ({ stats }) => {
  const cards = [
    {
      title: "Active Drives",
      value: stats?.activeDrives,
      icon: <FaBriefcase />,
      className: "cyan",
    },
    {
      title: "Applications",
      value: stats?.applications,
      icon: <FaUsers />,
      className: "purple",
    },
    {
      title: "Interviews",
      value: stats?.interviews,
      icon: <FaCalendarAlt />,
      className: "orange",
    },
    {
      title: "Offers",
      value: stats?.offers,
      icon: <FaFileAlt />,
      className: "violet",
    },
    {
      title: "Success Rate",
      value: `${stats?.successRate || 0}%`,
      icon: <FaChartLine />,
      className: "green",
    },
  ];

  return (
    <div className="stats-row">
      {cards.map((card, index) => (
        <div className="stats-card" key={index}>
          <div className={`stats-icon ${card.className}`}>
            {card.icon}
          </div>

          <h2>{card.value || 0}</h2>

          <p>{card.title}</p>
        </div>
      ))}
    </div>
  );
};

export default CompanyStatsRow;