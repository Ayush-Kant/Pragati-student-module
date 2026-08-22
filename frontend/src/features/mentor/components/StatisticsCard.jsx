import {
  FolderOpen,
  CheckCircle2,
  AlertTriangle,
  Target,
  TrendingUp,
} from "lucide-react";

const iconMap = {
  total: FolderOpen,
  active: FolderOpen,
  completed: CheckCircle2,
  risk: AlertTriangle,
  progress: Target,
};

export default function StatisticsCard({
  type = "total",
  title = "TOTAL PROJECTS",
  value = "24",
  trend = "+4",
  trendColor = "text-green-600",
}) {
  const Icon = iconMap[type] || FolderOpen;

  return (
    <div
      className="
        bg-white
        rounded-2xl
        border
        p-5
        shadow-sm
        hover:shadow-lg
        transition-all
        duration-300
      "
    >
      <div className="flex items-center justify-between">

        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
          <Icon className="w-7 h-7 text-[#004ac6]" />
        </div>

        <div className={`flex items-center gap-1 text-sm font-semibold ${trendColor}`}>
          <TrendingUp className="w-4 h-4" />
          {trend}
        </div>

      </div>

      <div className="mt-6">

        <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
          {title}
        </p>

        <h2 className="text-4xl font-bold text-[#141b2b] mt-2">
          {value}
        </h2>

      </div>
    </div>
  );
}