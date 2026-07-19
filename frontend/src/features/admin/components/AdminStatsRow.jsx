import {
  Rocket,
  UserRound,
  GraduationCap,
  Building,
} from "lucide-react";

const AdminStatsRow = ({ stats, darkMode }) => {
  const safeStats = {
    totalDrives: Math.max(0, stats?.totalDrives || 0),
    totalStudents: Math.max(0, stats?.totalStudents || 0),
    totalCompanies: Math.max(0, stats?.totalCompanies || 0),
    totalColleges: Math.max(0, stats?.totalColleges || 0),
  };

  const statCards = [
    {
      id: 1,
      label: "Total Drives",
      value: safeStats.totalDrives,
      bgColor: "bg-orange-100",
      darkBgColor: "bg-orange-900/20",
      textColor: "text-orange-600",
      darkTextColor: "text-orange-400",
      borderColor: "border-orange-300",
      darkBorderColor: "border-orange-700",
      icon: Rocket,
    },
    {
      id: 2,
      label: "Total Students",
      value: safeStats.totalStudents,
      bgColor: "bg-green-100",
      darkBgColor: "bg-green-900/20",
      textColor: "text-green-600",
      darkTextColor: "text-green-400",
      borderColor: "border-green-300",
      darkBorderColor: "border-green-700",
      icon: UserRound,
    },
    {
      id: 3,
      label: "Total Companies",
      value: safeStats.totalCompanies,
      bgColor: "bg-blue-100",
      darkBgColor: "bg-blue-900/20",
      textColor: "text-blue-600",
      darkTextColor: "text-blue-400",
      borderColor: "border-blue-300",
      darkBorderColor: "border-blue-700",
      icon: Building,
    },
    {
      id: 4,
      label: "Total Colleges",
      value: safeStats.totalColleges,
      bgColor: "bg-purple-100",
      darkBgColor: "bg-purple-900/20",
      textColor: "text-purple-600",
      darkTextColor: "text-purple-400",
      borderColor: "border-purple-300",
      darkBorderColor: "border-purple-700",
      icon: GraduationCap,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {statCards.map((card) => (
        <div
          key={card.id}
          className={`
            ${
              darkMode
                ? `${card.darkBgColor} ${card.darkBorderColor}`
                : `${card.bgColor} ${card.borderColor}`
            }
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
              <h3
                className={`text-3xl font-bold ${
                  darkMode
                    ? card.darkTextColor
                    : card.textColor
                }`}
              >
                {card.value}
              </h3>
            </div>

            {/* Icon */}
            <div
              className={`${
                darkMode
                  ? card.darkTextColor
                  : card.textColor
              }`}
            >
              <card.icon size={30} />
            </div>
          </div>

          {/* Label */}
          <p
            className={`text-sm font-medium ${
              darkMode
                ? "text-gray-300"
                : "text-gray-700"
            }`}
          >
            {card.label}
          </p>
        </div>
      ))}
    </div>
  );
};

export default AdminStatsRow;