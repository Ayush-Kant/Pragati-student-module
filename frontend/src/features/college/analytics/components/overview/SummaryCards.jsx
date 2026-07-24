import { Building2, Briefcase, Award } from "lucide-react";
import { cardClass, headingText, subtleText } from "../../utils/analyticsHelpers";

export const SummaryCards = ({ darkMode, data }) => {
  const items = [
    {
      label: "Top Recruiter",
      value: data?.topRecruiter ?? "N/A",
      icon: Award,
      iconBg: "bg-gradient-to-br from-orange-50 to-amber-50 text-[#ff6d34] border border-orange-200/80",
    },
    {
      label: "Active Drives",
      value: data?.activeDrives ?? 0,
      icon: Briefcase,
      iconBg: "bg-gradient-to-br from-teal-50 to-emerald-50 text-[#00bea3] border border-teal-200/80",
    },
    {
      label: "Total Companies",
      value: data?.totalCompanies ?? 0,
      icon: Building2,
      iconBg: "bg-gradient-to-br from-orange-50 to-rose-50 text-[#ff6d34] border border-orange-200/80",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {items.map(({ label, value, icon: Icon, iconBg }) => (
        <div key={label} className={cardClass(darkMode)}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className={`text-xs font-bold uppercase tracking-wider ${subtleText(darkMode)}`}>{label}</p>
              <p className={`text-xl font-extrabold mt-0.5 ${headingText(darkMode)}`}>{value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
