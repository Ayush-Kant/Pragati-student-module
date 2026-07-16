import { useOutletContext } from "react-router-dom";
import {
  Users,
  UserCheck,
  BadgeCheck,
  Clock3,
  TrendingUp,
} from "lucide-react";

const stats = [
  {
    title: "Eligible Students",
    value: 87,
    trend: "+8 this week",
    icon: Users,
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-500",
  },
  {
    title: "Nominated Students",
    value: 42,
    trend: "+5 this week",
    icon: UserCheck,
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-500",
  },
  {
    title: "Waiting",
    value: 11,
    trend: "+2 this week",
    icon: Clock3,
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-500",
  },
  {
    title: "Shortlisted",
    value: 28,
    trend: "+3 this week",
    icon: BadgeCheck,
    iconBg: "bg-violet-500/10",
    iconColor: "text-violet-500",
  },
];

const NominationStatistics = () => {
  const { darkMode } = useOutletContext();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;

        return (
          <div
            key={index}
            className={`group relative overflow-hidden rounded-3xl p-6 min-h-51.25 hover:-translate-y-1 transition-all duration-300 cursor-pointer
            ${
              darkMode
                ? `
                  bg-gradient-to-br from-[#1a2336] via-[#182133] to-[#141c2c]
                  border border-slate-700/60
                  shadow-lg shadow-black/20
                  hover:border-blue-500/20
                  hover:shadow-2xl
                  hover:shadow-blue-500/10
                `
                : `
                  bg-gradient-to-br from-white via-white to-slate-50
                  border border-slate-200
                  shadow-sm
                  hover:border-slate-300
                  hover:shadow-xl
                  hover:shadow-slate-300/40
                `
            }`}
          >
            {/* subtle top highlight */}
            <div
              className={`absolute inset-x-0 top-0 h-px ${
                darkMode
                  ? "bg-white/10"
                  : "bg-white"
              }`}
            />

            <div className="flex h-full flex-col justify-between">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <p
                    className={`text-[11px] uppercase tracking-[0.18em] font-semibold ${
                      darkMode
                        ? "text-slate-400"
                        : "text-slate-500"
                    }`}
                  >
                    {stat.title}
                  </p>
                </div>

                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 ${stat.iconBg}`}
                >
                  <Icon
                    size={24}
                    strokeWidth={2.2}
                    className={stat.iconColor}
                  />
                </div>
              </div>

              {/* Bottom */}
              <div>
                <h2
                  className={`text-[46px] font-bold leading-none tracking-tight ${
                    darkMode
                      ? "text-white"
                      : "text-slate-900"
                  }`}
                >
                  {stat.value}
                </h2>

                <div className="mt-6">
                  <div className="inline-flex items-center gap-2 rounded-full bg-green-500/10 px-4 py-2">
                    <TrendingUp
                      size={14}
                      strokeWidth={2.4}
                      className={
                        darkMode
                          ? "text-green-400"
                          : "text-green-600"
                      }
                    />

                    <span
                      className={`text-xs font-semibold ${
                        darkMode
                          ? "text-green-400"
                          : "text-green-600"
                      }`}
                    >
                      {stat.trend}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NominationStatistics;