/* Inline spinner — use for button loading states */
export const LoadingSpinner = ({ message = "Loading..." }) => (
  <div className="flex flex-col items-center justify-center py-12 gap-3">
    <div className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-blue-500 animate-spin" />
    <p className="text-sm text-gray-400">{message}</p>
  </div>
);

/* Single skeleton line */
export const SkeletonLine = ({ className = "" }) => (
  <div className={`bg-gray-100 rounded-lg animate-pulse ${className}`} />
);

/* Skeleton for a stat card */
export const SkeletonStatCard = () => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
    <div className="flex items-center justify-between">
      <SkeletonLine className="h-4 w-28" />
      <SkeletonLine className="h-9 w-9 rounded-xl" />
    </div>
    <SkeletonLine className="h-8 w-16" />
    <SkeletonLine className="h-2 w-full rounded-full" />
    <SkeletonLine className="h-3 w-20" />
  </div>
);

/* Skeleton for an assignment card */
export const SkeletonAssignmentCard = () => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
    <div className="flex items-start justify-between gap-3">
      <SkeletonLine className="h-5 w-48" />
      <SkeletonLine className="h-6 w-20 rounded-full" />
    </div>
    <SkeletonLine className="h-4 w-32" />
    <div className="flex items-center justify-between mt-1">
      <SkeletonLine className="h-4 w-28" />
      <SkeletonLine className="h-5 w-16 rounded-full" />
    </div>
    <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
      <SkeletonLine className="h-4 w-20" />
      <SkeletonLine className="h-8 w-28 rounded-xl" />
    </div>
  </div>
);

/* Skeleton for a table row */
export const SkeletonTableRow = () => (
  <tr className="border-b border-gray-50">
    <td className="py-4 pr-4"><SkeletonLine className="h-4 w-40" /></td>
    <td className="py-4 pr-4"><SkeletonLine className="h-4 w-28" /></td>
    <td className="py-4 pr-4"><SkeletonLine className="h-4 w-24" /></td>
    <td className="py-4 pr-4"><SkeletonLine className="h-5 w-16 rounded-full" /></td>
    <td className="py-4 pr-4"><SkeletonLine className="h-5 w-20 rounded-full" /></td>
    <td className="py-4"><SkeletonLine className="h-5 w-20 rounded-full" /></td>
  </tr>
);

/* Full page skeleton for the assignments list */
export const SkeletonAssignmentPage = () => (
  <div className="flex flex-col gap-6">
    {/* Stats row */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <SkeletonStatCard key={i} />
      ))}
    </div>
    {/* Filter bar */}
    <div className="flex items-center gap-3">
      <SkeletonLine className="h-10 flex-1 rounded-xl" />
      <SkeletonLine className="h-10 w-32 rounded-xl" />
      <SkeletonLine className="h-10 w-36 rounded-xl" />
    </div>
    {/* Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonAssignmentCard key={i} />
      ))}
    </div>
  </div>
);

/* Default export kept for backward compat */
export default LoadingSpinner;
