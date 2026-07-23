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
  },
  {
    title: "Nominated Students",
    value: 42,
    trend: "+5 this week",
    icon: UserCheck,
  },
  {
    title: "Waiting",
    value: 11,
    trend: "+2 this week",
    icon: Clock3,
  },
  {
    title: "Shortlisted",
    value: 28,
    trend: "+3 this week",
    icon: BadgeCheck,
  },
];

const NominationStatistics = () => {
  const { darkMode } = useOutletContext();

  return (
    /* Changed grid-cols-1 to grid-cols-2 for 2x2 grid layout on mobile */
    <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;

        return (
          <div
            key={index}
            className={`group relative overflow-hidden rounded-2xl md:rounded-3xl p-4 md:p-6 min-h-[140px] md:min-h-51.25 hover:-translate-y-1 transition-all duration-300 cursor-pointer
            ${
              darkMode
                ? `
                  bg-[#2D2D2D]
                  border border-[#3D3D3D]
                  shadow-lg shadow-black/20
                  hover:border-[#ff6d34]/30
                  hover:shadow-2xl
                  hover:shadow-[#ff6d34]/10
                `
                : `
                  bg-white
                  border border-slate-200
                  shadow-sm
                  hover:border-[#ff7a00]/30
                  hover:shadow-xl
                  hover:shadow-[#ff7a00]/20
                `
            }`}
          >
            {/* subtle top highlight */}
            <div
              className={`absolute inset-x-0 top-0 h-px ${
                darkMode ? "bg-white/5" : "bg-slate-100"
              }`}
            />

            <div className="flex h-full flex-col justify-between">
              {/* Header */}
              <div className="flex items-start justify-between gap-1">
                <div>
                  <p
                    className={`text-[9px] md:text-[11px] uppercase tracking-[0.12em] md:tracking-[0.18em] font-semibold line-clamp-1 ${
                      darkMode ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    {stat.title}
                  </p>
                </div>

                {/* Scaled icon container size for mobile layout */}
                <div
                  className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-105 ${
                    darkMode ? "bg-[#ff6d34]/10" : "bg-[#ff7a00]/10"
                  }`}
                >
                  <Icon
                    strokeWidth={2.2}
                    className={`w-4 h-4 md:w-6 md:h-6 ${
                      darkMode ? "text-[#ff6d34]" : "text-[#ff7a00]"
                    }`}
                  />
                </div>
              </div>

              {/* Bottom content section */}
              <div className="mt-2 md:mt-0">
                {/* Scaled value text down on mobile view */}
                <h2
                  className={`text-2xl sm:text-3xl md:text-[46px] font-bold leading-none tracking-tight ${
                    darkMode ? "text-white" : "text-slate-900"
                  }`}
                >
                  {stat.value}
                </h2>

                {/* Tightened trend metric spacing wrapper */}
                <div className="mt-2 md:mt-6">
                  <div className="inline-flex items-center gap-1 md:gap-2 rounded-full bg-green-500/10 px-2.5 py-1 md:px-4 md:py-2">
                    <TrendingUp
                      strokeWidth={2.4}
                      className={`w-3 h-3 md:w-3.5 md:h-3.5 ${
                        darkMode ? "text-green-400" : "text-green-600"
                      }`}
                    />

                    <span
                      className={`text-[10px] md:text-xs font-semibold whitespace-nowrap ${
                        darkMode ? "text-green-400" : "text-green-600"
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