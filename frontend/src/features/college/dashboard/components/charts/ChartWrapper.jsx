const ChartWrapper = ({ title, subtitle, children, badge }) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.06)] overflow-hidden">
      
      {/* Header */}
      <div className="flex items-start justify-between px-5 py-5 sm:px-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
            {title}
          </h1>

          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">
              {subtitle}
            </p>
          )}
        </div>

        {badge && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
            {badge}
          </span>
        )}
      </div>

      {/* Separator */}
      <div className="border-t border-gray-100" />

      {/* Chart Area */}
      <div className="p-4 sm:p-6">
        <div
          className="
            rounded-xl
            bg-gray-50/70
            ring-1
            ring-gray-100
            h-[320px]
            sm:h-[360px]
            lg:h-[380px]
            p-4
          "
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default ChartWrapper;