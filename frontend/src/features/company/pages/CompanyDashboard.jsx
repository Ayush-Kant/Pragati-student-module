import "./../styles/companyDashboard.css";

import ActivityFeed from "../components/ActivityFeed";
import QuickActions from "../components/QuickActions";

import CompanyStatsRow from "../components/CompanyStatsRow";
import CandidateFunnelChart from "../components/CandidateFunnelChart";
import CollegeParticipationTable from "../components/CollegeParticipationTable";

const CompanyDashboard = () => {
  const dummyStats = {
    activeDrives: 12,
    applications: 245,
    interviews: 48,
    offers: 16,
    successRate: 82,
  };

  const funnelData = [
    {
      stage: "Applied",
      count: 320,
    },
    {
      stage: "Screened",
      count: 220,
    },
    {
      stage: "Trained",
      count: 180,
    },
    {
      stage: "Shortlisted",
      count: 95,
    },
    {
      stage: "Selected",
      count: 42,
    },
  ];

  const collegeStats = [
    {
      name: "IIT Hyderabad",
      count: 120,
    },
    {
      name: "NIT Warangal",
      count: 98,
    },
    {
      name: "VIT Chennai",
      count: 85,
    },
    {
      name: "SRM University",
      count: 76,
    },
    {
      name: "JNTU Hyderabad",
      count: 64,
    },
  ];

  const activities = [
  {
    initials: "RK",
    message:
      "Rahul Kumar completed interview round.",
    time: "2 mins ago",
  },
  {
    initials: "SP",
    message:
      "Sneha Patel accepted the offer letter.",
    time: "10 mins ago",
  },
  {
    initials: "AJ",
    message:
      "Aman Jain applied for Frontend Developer role.",
    time: "25 mins ago",
  },
  {
    initials: "NT",
    message:
      "Niharika T scheduled technical interview.",
    time: "1 hour ago",
  },
];

  return (
    <div className="company-dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>

        <p>
          Welcome back! Here's what's happening
          with your recruitment.
        </p>
      </div>

      <CompanyStatsRow stats={dummyStats} />

      <div className="dashboard-grid">
        <CandidateFunnelChart data={funnelData} />

        <CollegeParticipationTable
          data={collegeStats}
        />
      </div>
      <div className="dashboard-bottom-grid">
  <ActivityFeed activities={activities} />

  <QuickActions />
</div>
    </div>
  );
};

export default CompanyDashboard;