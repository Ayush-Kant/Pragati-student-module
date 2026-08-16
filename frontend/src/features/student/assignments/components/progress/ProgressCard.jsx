const ProgressCard = ({
  label,
  value,
  total,
  color = "bg-blue-500",
  icon,
  iconBg = "bg-blue-50",
  textColor = "text-blue-600",
  darkMode = false,
}) => {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div className={`relative rounded-2xl border shadow-sm p-5 overflow-hidden group hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 ${
      darkMode
        ? "bg-slate-900 border-slate-700 hover:shadow-black/30"
        : "bg-white border-gray-100 hover:shadow-gray-200/70"
    }`}>

      {/* Tinted gradient wash */}
      <div
        className="absolute inset-0 rounded-2xl opacity-[0.04] pointer-events-none"
        style={{ background: "linear-gradient(135deg, currentColor 0%, transparent 60%)" }}
      />

      <div className="relative flex flex-col gap-4">

        {/* Row 1: label + icon */}
        <div className="flex items-start justify-between">
          <p className={`text-[11px] font-semibold uppercase tracking-widest leading-none pr-2 ${darkMode ? "text-slate-500" : "text-gray-400"}`}>
            {label}
          </p>
          {icon && (
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${iconBg}`}>
              {icon}
            </div>
          )}
        </div>

        {/* Row 2: large number */}
        <div className="flex items-baseline gap-2">
          <p className={`text-4xl font-bold tracking-tight leading-none ${textColor}`}>
            {value}
          </p>
          <span className={`text-sm font-medium leading-none ${darkMode ? "text-slate-500" : "text-gray-400"}`}>
            / {total}
          </span>
        </div>

        {/* Row 3: progress bar + pct label */}
        <div>
          <div className={`h-1.5 rounded-full overflow-hidden ${darkMode ? "bg-slate-700" : "bg-gray-100"}`}>
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${color}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className={`text-[11px] mt-1.5 font-medium ${darkMode ? "text-slate-500" : "text-gray-400"}`}>
            {percentage}% completion rate
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProgressCard;
