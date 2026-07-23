export const LoadingSpinner = ({ darkMode = false }) => (
  <div className="flex items-center justify-center py-10">
    <div className={`w-8 h-8 border-3 border-t-transparent rounded-full animate-spin ${darkMode ? "border-gray-600 border-t-blue-500" : "border-gray-300 border-t-blue-600"}`} />
  </div>
);
