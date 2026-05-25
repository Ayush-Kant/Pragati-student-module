import { CountUp } from "react-countup";
import {
  Rocket,
  UserRound,
  GraduationCap,
  Building
} from "lucide-react";

const AdminStatsRow = ({ stats }) => {
  const safeStats = {
    totalDrives: Math.max(0, stats?.totalDrives || 0),
    totalStudents: Math.max(0, stats?.totalStudents || 0),
    totalCompanies: Math.max(0, stats?.totalCompanies || 0),
    totalColleges: Math.max(0, stats?.totalColleges || 0),
  };

  // Card Data
  const statCards = [
    {
      id: 1,
      label: "Total Drives",
      value: safeStats.totalDrives,
      bgColor: "bg-orange-100",
      textColor: "text-orange-600",
      borderColor: "border-orange-300",
      icon: Rocket,
    },
    {
      id: 2,
      label: "Total Students",
      value: safeStats.totalStudents,
      bgColor: "bg-green-100",
      textColor: "text-green-600",
      borderColor: "border-green-300",
      icon: UserRound,
    },
    {
      id: 3,
      label: "Total Companies",
      value: safeStats.totalCompanies,
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
      borderColor: "border-blue-300",
      icon: Building,
    },
    {
      id: 4,
      label: "Total Colleges",
      value: safeStats.totalColleges,
      bgColor: "bg-purple-100",
      textColor: "text-purple-600",
      borderColor: "border-purple-300",
      icon: GraduationCap,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {statCards.map((card) => (
        <div
          key={card.id}
          className={`
            ${card.bgColor}
            ${card.borderColor}
            border
            rounded-2xl
            p-5
            shadow-sm
            hover:shadow-md
            transition-all
            duration-300
          `}
        >

          {/* Top Section */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className={`text-3xl font-bold ${card.textColor}`}>
                {/* <CountUp
                  end={card.value}
                  duration={1.5}
                  separator=","
                /> */}
                {card.value}
              </h3>
            </div>

            {/* Icon */}
            <div className={`text-3xl ${card.textColor}`}>
              <card.icon size={30} />
            </div>
          </div>

          {/* Label */}
          <p className="text-sm font-medium text-gray-700">
            {card.label}
          </p>
        </div>
      ))}
    </div>
  );
};

export default AdminStatsRow;