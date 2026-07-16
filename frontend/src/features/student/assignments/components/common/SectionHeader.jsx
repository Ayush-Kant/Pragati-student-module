const SectionHeader = ({ title, subtitle, action, description }) => (
  <div className="flex items-start justify-between mb-5 gap-3">
    <div className="flex flex-col gap-1">
      <h2 className="text-sm font-semibold text-gray-800 leading-none tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-[11px] font-medium text-gray-400">{subtitle}</p>
      )}
      {description && (
        <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">
          {description}
        </p>
      )}
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);

export default SectionHeader;
