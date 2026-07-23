import { Users, GraduationCap, TrendingUp, IndianRupee } from "lucide-react";

const cards = [
  { key: "totalStudents", label: "Total Students", icon: Users, color: "bg-blue-50 text-blue-600 border-blue-100" },
  { key: "totalPlaced", label: "Total Placed", icon: GraduationCap, color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  { key: "placementRate", label: "Placement Rate", icon: TrendingUp, color: "bg-amber-50 text-amber-600 border-amber-100" },
  { key: "averagePackage", label: "Avg Package", icon: IndianRupee, color: "bg-purple-50 text-purple-600 border-purple-100" },
];

export const StatisticsCards = ({ darkMode, data }) => {
  const values = {
    totalStudents: data?.totalStudents ?? 0,
    totalPlaced: data?.totalPlaced ?? 0,
    placementRate: data?.placementRate ?? "0%",
    averagePackage: data?.averagePackage ?? "0 LPA",
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ key, label, icon: Icon, color }) => (
        <div
          key={key}
          className={`rounded-2xl border p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 ${
            darkMode ? "bg-[#2D2D2D] border-[#3D3D3D]" : "bg-white border-gray-100"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <p className={`text-xs font-bold tracking-wider uppercase ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              {label}
            </p>
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center border ${color}`}>
              <Icon className="w-4 h-4" />
            </div>
          </div>
          <h3 className={`text-2xl font-extrabold tracking-tight ${darkMode ? "text-white" : "text-[#2D3436]"}`}>
            {values[key]}
          </h3>
        </div>
      ))}
    </div>
  );
};
