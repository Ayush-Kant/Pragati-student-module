export const LoadingSpinner = ({ darkMode = false }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-10">
    <div className={`w-8 h-8 border-[3px] border-t-transparent rounded-full animate-spin ${
      darkMode ? "border-[#3D3D3D] border-t-[#00bea3]" : "border-gray-200 border-t-[#00bea3]"
    }`} />
    <p className={`text-xs font-medium ${darkMode ? "text-gray-500" : "text-gray-400"}`}>Loading analytics...</p>
  </div>
);
