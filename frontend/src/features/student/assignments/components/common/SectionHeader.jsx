const SectionHeader = ({ title, subtitle, action, description, darkMode = false }) => (
  <div className="flex items-start justify-between mb-5 gap-3">
    <div className="flex flex-col gap-1">
      <h2 className={`text-sm font-semibold leading-none tracking-tight ${darkMode ? "text-slate-200" : "text-gray-800"}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`text-[11px] font-medium ${darkMode ? "text-slate-500" : "text-gray-400"}`}>{subtitle}</p>
      )}
      {description && (
        <p className={`text-sm mt-1.5 leading-relaxed ${darkMode ? "text-slate-400" : "text-gray-500"}`}>
          {description}
        </p>
      )}
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);

export default SectionHeader;
