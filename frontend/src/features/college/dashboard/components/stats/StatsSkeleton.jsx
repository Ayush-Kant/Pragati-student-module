
const StatsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
        <div
          key={item}
          className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse shadow-[0_4px_20px_rgba(0,0,0,0.01)]"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="h-3 bg-gray-200 rounded w-24 mb-3"></div>
              <div className="h-8 bg-gray-200 rounded w-16 mb-1"></div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex-shrink-0"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-32 mt-5"></div>
        </div>
      ))}
    </div>
  );
};

export default StatsSkeleton;
