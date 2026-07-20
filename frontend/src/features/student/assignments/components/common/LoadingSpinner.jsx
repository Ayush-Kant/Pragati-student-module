/* LoadingSpinner.jsx — all skeleton/loading components with dark mode support */

/* Inline spinner — use for button loading states */
export const LoadingSpinner = ({ message = "Loading...", darkMode = false }) => (
  <div className="flex flex-col items-center justify-center py-12 gap-3">
    <div className={`w-8 h-8 rounded-full border-2 border-t-blue-500 animate-spin ${darkMode ? "border-slate-600" : "border-gray-200"}`} />
    <p className={`text-sm ${darkMode ? "text-slate-500" : "text-gray-400"}`}>{message}</p>
  </div>
);

/* Single skeleton line */
export const SkeletonLine = ({ className = "", darkMode = false }) => (
  <div className={`rounded-lg animate-pulse ${darkMode ? "bg-slate-700" : "bg-gray-100"} ${className}`} />
);

/* Skeleton for a stat card */
export const SkeletonStatCard = ({ darkMode = false }) => (
  <div className={`rounded-2xl border shadow-sm p-5 flex flex-col gap-3 ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-100"}`}>
    <div className="flex items-center justify-between">
      <SkeletonLine className="h-4 w-28" darkMode={darkMode} />
      <SkeletonLine className="h-9 w-9 rounded-xl" darkMode={darkMode} />
    </div>
    <SkeletonLine className="h-8 w-16" darkMode={darkMode} />
    <SkeletonLine className="h-2 w-full rounded-full" darkMode={darkMode} />
    <SkeletonLine className="h-3 w-20" darkMode={darkMode} />
  </div>
);

/* Skeleton for an assignment card */
export const SkeletonAssignmentCard = ({ darkMode = false }) => (
  <div className={`rounded-2xl border shadow-sm p-5 flex flex-col gap-3 ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-100"}`}>
    <div className="flex items-start justify-between gap-3">
      <SkeletonLine className="h-5 w-48" darkMode={darkMode} />
      <SkeletonLine className="h-6 w-20 rounded-full" darkMode={darkMode} />
    </div>
    <SkeletonLine className="h-4 w-32" darkMode={darkMode} />
    <div className="flex items-center justify-between mt-1">
      <SkeletonLine className="h-4 w-28" darkMode={darkMode} />
      <SkeletonLine className="h-5 w-16 rounded-full" darkMode={darkMode} />
    </div>
    <div className={`pt-3 border-t flex items-center justify-between ${darkMode ? "border-slate-700" : "border-gray-100"}`}>
      <SkeletonLine className="h-4 w-20" darkMode={darkMode} />
      <SkeletonLine className="h-8 w-28 rounded-xl" darkMode={darkMode} />
    </div>
  </div>
);

/* Skeleton for a table row */
export const SkeletonTableRow = ({ darkMode = false }) => (
  <tr className={`border-b ${darkMode ? "border-slate-700" : "border-gray-50"}`}>
    <td className="py-4 pr-4"><SkeletonLine className="h-4 w-40" darkMode={darkMode} /></td>
    <td className="py-4 pr-4"><SkeletonLine className="h-4 w-28" darkMode={darkMode} /></td>
    <td className="py-4 pr-4"><SkeletonLine className="h-4 w-24" darkMode={darkMode} /></td>
    <td className="py-4 pr-4"><SkeletonLine className="h-5 w-16 rounded-full" darkMode={darkMode} /></td>
    <td className="py-4 pr-4"><SkeletonLine className="h-5 w-20 rounded-full" darkMode={darkMode} /></td>
    <td className="py-4"><SkeletonLine className="h-5 w-20 rounded-full" darkMode={darkMode} /></td>
  </tr>
);

/* Full page skeleton for the assignments list */
export const SkeletonAssignmentPage = ({ darkMode = false }) => (
  <div className="flex flex-col gap-6">
    {/* Stats row */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <SkeletonStatCard key={i} darkMode={darkMode} />
      ))}
    </div>
    {/* Filter bar */}
    <div className="flex items-center gap-3">
      <SkeletonLine className="h-10 flex-1 rounded-xl" darkMode={darkMode} />
      <SkeletonLine className="h-10 w-32 rounded-xl" darkMode={darkMode} />
      <SkeletonLine className="h-10 w-36 rounded-xl" darkMode={darkMode} />
    </div>
    {/* Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonAssignmentCard key={i} darkMode={darkMode} />
      ))}
    </div>
  </div>
);

/* Default export kept for backward compat */
export default LoadingSpinner;
