import { TrendingUp, TrendingDown } from "lucide-react";
import { statsData } from "../../types/profileExtraDummyData";

const colorVariants = {
  blue: {
    iconBg: "bg-blue-50",
    iconText: "text-blue-600",
    accent: "from-blue-800 to-cyan-300",
    border: "hover:border-blue-100",
  },

  purple: {
    iconBg: "bg-violet-50",
    iconText: "text-violet-600",
    accent: "from-violet-800 to-purple-300",
    border: "hover:border-violet-100",
  },

  green: {
    iconBg: "bg-emerald-50",
    iconText: "text-emerald-600",
    accent: "from-emerald-800 to-green-300",
    border: "hover:border-emerald-100",
  },

  orange: {
    iconBg: "bg-orange-50",
    iconText: "text-orange-600",
    accent: "from-orange-800 to-amber-300",
    border: "hover:border-orange-100",
  },
};

const StatCard = ({ icon: Icon, label, value, trend, color }) => {
  const colors = colorVariants[color] || colorVariants.blue;

  const isPositive = trend >= 0;

  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  const trendColor = isPositive ? "text-emerald-600" : "text-red-600";

  return (
    <div
      className={`
        group
        relative
        overflow-hidden
        rounded-3xl
        border
        border-gray-100
        bg-white
        p-4
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl

        ${colors.border}
      `}
    >
      {/* Top Accent */}
      <div
        className={`
          absolute
          top-0
          left-0
          h-1
          w-full
          bg-gradient-to-r
          ${colors.accent}
        `}
      />

      {/* Top Row */}
      <div className="flex items-center gap-3">
        <div
          className={`
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-2xl
            ${colors.iconBg}
            ${colors.iconText}
            transition-all
            duration-300
            group-hover:scale-110
          `}
        >
          <Icon size={20} />
        </div>

        <h3 className="text-2xl font-bold tracking-tight text-slate-900">
          {value}
        </h3>
      </div>

      {/* Label */}
      <p className="mt-3 text-sm font-medium text-slate-500">{label}</p>

      {/* Trend */}
      <div className="mt-4 flex items-center gap-2">
        <TrendIcon size={14} className={trendColor} />

        <span className={`text-sm font-semibold ${trendColor}`}>
          {isPositive ? `+${trend}%` : `${trend}%`}
        </span>

        <span className="text-xs text-slate-400">vs last year</span>
      </div>
    </div>
  );
};

const ProfileStats = () => {
  return (
    <div>
      <div className="m-6">
        <h2 className="text-xl font-bold text-slate-900">
          Key Statistics
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Performance and engagement overview
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 p-4">
        {statsData.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
    </div>
  );
};

export default ProfileStats;
