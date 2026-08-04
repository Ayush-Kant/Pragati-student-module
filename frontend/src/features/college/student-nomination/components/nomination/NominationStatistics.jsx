import { useOutletContext } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  UserCheck,
  BadgeCheck,
  Clock3,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { getNominationStatistics } from "../../services/studentNominationService";

const NominationStatistics = () => {
  // Safe outlet context fallback
  const { darkMode = false } = useOutletContext() || {};

  // ─── Fetch Live Statistics via React Query ─────────────────────────
  const { data: rawStatsData, isLoading, isError, refetch } = useQuery({
    queryKey: ["nominationStatistics"],
    queryFn: async () => {
      const res = await getNominationStatistics();
      return res?.data ?? res;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 2,
  });

  // Handle double-nested payload objects safely (res.data.data vs res.data)
  const statsData = rawStatsData?.data ?? rawStatsData;

  // Safe mapping with dynamic backend fallback counts
  const stats = [
    {
      title: "Eligible Students",
      value: statsData?.eligible_count ?? statsData?.eligible ?? 0,
      trend: statsData?.eligible_trend || "Active Pool",
      icon: Users,
    },
    {
      title: "Nominated Students",
      value: statsData?.nominated_count ?? statsData?.nominated ?? 0,
      trend: statsData?.nominated_trend || "In Review",
      icon: UserCheck,
    },
    {
      title: "Waiting",
      value: statsData?.waiting_count ?? statsData?.waiting ?? 0,
      trend: statsData?.waiting_trend || "Verification",
      icon: Clock3,
    },
    {
      title: "Shortlisted",
      value: statsData?.shortlisted_count ?? statsData?.shortlisted ?? 0,
      trend: statsData?.shortlisted_trend || "Advanced",
      icon: BadgeCheck,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;

        return (
          <div
            key={index}
            onClick={() => isError && refetch()}
            className={`group relative overflow-hidden rounded-2xl md:rounded-3xl p-4 md:p-6 min-h-[140px] md:min-h-[205px] transition-all duration-300 ${
              isError ? "cursor-pointer" : "cursor-default"
            } ${
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
            {/* Top Border Accent */}
            <div
              className={`absolute inset-x-0 top-0 h-px ${
                darkMode ? "bg-white/5" : "bg-slate-100"
              }`}
            />

            <div className="flex h-full flex-col justify-between">
              {/* Card Header */}
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

                {/* Icon Container */}
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

              {/* Card Body Metrics */}
              <div className="mt-2 md:mt-0">
                {isLoading ? (
                  /* Loading Skeleton */
                  <div
                    className={`h-8 w-20 rounded animate-pulse ${
                      darkMode ? "bg-slate-700" : "bg-slate-200"
                    }`}
                  />
                ) : (
                  <h2
                    className={`text-2xl sm:text-3xl md:text-[46px] font-bold leading-none tracking-tight ${
                      darkMode ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {isError ? "—" : stat.value}
                  </h2>
                )}

                {/* Metric Badge */}
                <div className="mt-2 md:mt-6">
                  {isError ? (
                    <div className="inline-flex items-center gap-1 md:gap-2 rounded-full bg-red-500/10 px-2.5 py-1 md:px-4 md:py-2 text-red-500">
                      <AlertCircle className="w-3 h-3 md:w-3.5 md:h-3.5" />
                      <span className="text-[10px] md:text-xs font-semibold whitespace-nowrap">
                        Failed to load (Click to retry)
                      </span>
                    </div>
                  ) : (
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
                  )}
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