import { Building2, Briefcase, Award } from "lucide-react";

export const SummaryCards = ({ darkMode, data }) => {
  const items = [
    { label: "Top Recruiter", value: data?.topRecruiter ?? "N/A", icon: Award, accent: "text-blue-500" },
    { label: "Active Drives", value: data?.activeDrives ?? 0, icon: Briefcase, accent: "text-emerald-500" },
    { label: "Total Companies", value: data?.totalCompanies ?? 0, icon: Building2, accent: "text-amber-500" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {items.map(({ label, value, icon: Icon, accent }) => (
        <div
          key={label}
          className={`flex items-center gap-4 rounded-2xl border p-4 ${
            darkMode ? "bg-[#2D2D2D] border-[#3D3D3D]" : "bg-white border-gray-100"
          }`}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${darkMode ? "bg-[#3D3D3D]" : "bg-gray-50"}`}>
            <Icon className={`w-5 h-5 ${accent}`} />
          </div>
          <div>
            <p className={`text-xs font-medium ${darkMode ? "text-gray-500" : "text-gray-400"}`}>{label}</p>
            <p className={`text-lg font-bold ${darkMode ? "text-white" : "text-[#2D3436]"}`}>{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
