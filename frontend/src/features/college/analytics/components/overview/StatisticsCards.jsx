import { Users, GraduationCap, TrendingUp, IndianRupee } from "lucide-react";
import { cardClass, headingText, subtleText } from "../../utils/analyticsHelpers";

const cards = [
  {
    key: "totalStudents",
    label: "Total Students",
    icon: Users,
    iconBg: "bg-gradient-to-br from-orange-50 to-amber-50 text-[#ff6d34] border border-orange-200/80",
  },
  {
    key: "totalPlaced",
    label: "Total Placed",
    icon: GraduationCap,
    iconBg: "bg-gradient-to-br from-teal-50 to-emerald-50 text-[#00bea3] border border-teal-200/80",
  },
  {
    key: "placementRate",
    label: "Placement Rate",
    icon: TrendingUp,
    iconBg: "bg-gradient-to-br from-orange-50 to-rose-50 text-[#ff6d34] border border-orange-200/80",
  },
  {
    key: "averagePackage",
    label: "Avg Package",
    icon: IndianRupee,
    iconBg: "bg-gradient-to-br from-teal-50 to-cyan-50 text-[#00bea3] border border-teal-200/80",
  },
];

export const StatisticsCards = ({ darkMode, data }) => {
  const values = {
    totalStudents: data?.totalStudents ?? 0,
    totalPlaced: data?.totalPlaced ?? 0,
    placementRate: data?.placementRate ?? "0%",
    averagePackage: data?.averagePackage ?? "0 LPA",
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map(({ key, label, icon: Icon, iconBg }) => (
        <div key={key} className={cardClass(darkMode)}>
          <div className="flex justify-between items-start">
            <div>
              <p className={`text-xs font-bold tracking-wider uppercase ${subtleText(darkMode)}`}>
                {label}
              </p>
              <h3 className={`text-3xl font-extrabold mt-2 tracking-tight ${headingText(darkMode)}`}>
                {values[key]}
              </h3>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg}`}>
              <Icon className="w-5.5 h-5.5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
