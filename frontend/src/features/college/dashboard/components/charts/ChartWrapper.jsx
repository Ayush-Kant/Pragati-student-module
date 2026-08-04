const ChartWrapper = ({ title, subtitle, children, badge, darkMode }) => {
  return (
    <div className={`rounded-2xl border overflow-hidden ${
      darkMode
        ? "bg-[#2D2D2D] border-[#3D3D3D]"
        : "bg-white border-gray-200 shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
    }`}>
      
      {/* Header */}
      <div className="flex items-start justify-between px-5 py-5 sm:px-6">
        <div>
          <h1 className={`text-xl font-semibold tracking-tight ${
            darkMode ? "text-white" : "text-gray-900"
          }`}>
            {title}
          </h1>

          {subtitle && (
            <p className={`text-sm mt-1 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}>
              {subtitle}
            </p>
          )}
        </div>

        {badge && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ff6d34]/10 px-3 py-1 text-xs font-medium text-[#ff6d34]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ff6d34]" />
            {badge}
          </span>
        )}
      </div>

      {/* Separator */}
      <div className={`border-t ${
        darkMode ? "border-[#3D3D3D]" : "border-gray-100"
      }`} />

      {/* Chart Area */}
      <div className="p-4 sm:p-6">
        <div
          className={`
            rounded-xl
            ring-1
            h-[320px]
            sm:h-[360px]
            lg:h-[380px]
            p-4
            ${
              darkMode
                ? "bg-[#1A1A1A] ring-[#3D3D3D]"
                : "bg-gray-50/70 ring-gray-100"
            }
          `}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default ChartWrapper;