const ProgressCard = ({
  label,
  value,
  total,
  color = "bg-blue-500",
  icon,
  iconBg = "bg-blue-50",
  textColor = "text-blue-600",
}) => {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div className="relative bg-white rounded-2xl border border-gray-100 shadow-sm p-5 overflow-hidden group hover:shadow-lg hover:shadow-gray-200/70 hover:-translate-y-0.5 transition-all duration-300">

      {/* Tinted gradient wash — gives card a warm color identity */}
      <div
        className="absolute inset-0 rounded-2xl opacity-[0.04] pointer-events-none"
        style={{ background: "linear-gradient(135deg, currentColor 0%, transparent 60%)" }}
      />

      <div className="relative flex flex-col gap-4">

        {/* Row 1: label + icon */}
        <div className="flex items-start justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 leading-none pr-2">
            {label}
          </p>
          {icon && (
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconBg} shadow-sm`}
            >
              {icon}
            </div>
          )}
        </div>

        {/* Row 2: large number */}
        <div className="flex items-baseline gap-2">
          <p className={`text-4xl font-bold tracking-tight leading-none ${textColor}`}>
            {value}
          </p>
          <span className="text-sm font-medium text-gray-400 leading-none">
            / {total}
          </span>
        </div>

        {/* Row 3: progress bar + pct label */}
        <div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${color}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="text-[11px] text-gray-400 mt-1.5 font-medium">
            {percentage}% completion rate
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProgressCard;
