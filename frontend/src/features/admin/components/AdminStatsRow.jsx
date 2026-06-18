import {
  Rocket,
  UserRound,
  GraduationCap,
  Building
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
      bgColor: darkMode ? "bg-orange-900/20" : "bg-orange-100",
      textColor: "text-orange-500",
      borderColor: darkMode ? "border-orange-800" : "border-orange-300",
      icon: Rocket,
    },
    {
      id: 2,
      label: "Total Students",
      value: safeStats.totalStudents,
      bgColor: darkMode ? "bg-green-900/20" : "bg-green-100",
      textColor: "text-green-500",
      borderColor: darkMode ? "border-green-800" : "border-green-300",
      icon: UserRound,
    },
    {
      id: 3,
      label: "Total Companies",
      value: safeStats.totalCompanies,
      bgColor: darkMode ? "bg-blue-900/20" : "bg-blue-100",
      textColor: "text-blue-500",
      borderColor: darkMode ? "border-blue-800" : "border-blue-300",
      icon: Building,
    },
    {
      id: 4,
      label: "Total Colleges",
      value: safeStats.totalColleges,
      bgColor: darkMode ? "bg-purple-900/20" : "bg-purple-100",
      textColor: "text-purple-500",
      borderColor: darkMode ? "border-purple-800" : "border-purple-300",
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
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className={`text-3xl font-bold ${card.textColor}`}>
                {card.value}
              </h3>
            </div>

            <div className={`text-3xl ${card.textColor}`}>
              <card.icon size={30} />
            </div>
          </div>

          <p
            className={`
              text-sm font-medium
              ${
                darkMode
                  ? "text-gray-300"
                  : "text-gray-700"
              }
            `}
          >
            {card.label}
          </p>
        </div>
      ))}
    </div>
  );
};

export default AdminStatsRow;