
const StatsSkeleton = ({ darkMode }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
        <div
          key={item}
          className={`rounded-2xl border p-6 animate-pulse shadow-[0_4px_20px_rgba(0,0,0,0.01)] ${
            darkMode
              ? "bg-[#2D2D2D] border-[#3D3D3D]"
              : "bg-white border-gray-100"
          }`}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className={`h-3 rounded w-24 mb-3 ${darkMode ? "bg-[#3D3D3D]" : "bg-gray-200"}`}></div>
              <div className={`h-8 rounded w-16 mb-1 ${darkMode ? "bg-[#3D3D3D]" : "bg-gray-200"}`}></div>
            </div>
            <div className={`w-12 h-12 rounded-xl flex-shrink-0 ${darkMode ? "bg-[#3D3D3D]" : "bg-gray-100"}`}></div>
          </div>
          <div className={`h-4 rounded w-32 mt-5 ${darkMode ? "bg-[#3D3D3D]" : "bg-gray-200"}`}></div>
        </div>
      ))}
    </div>
  );
};

export default StatsSkeleton;
