const EmptyState = ({ title = "No students found", description = "Try adjusting your filters or add a new student.", darkMode }) => (
  <div className={`flex flex-col items-center justify-center py-20 gap-3 ${darkMode ? '' : ''}`}>
    <span className="text-6xl">🎓</span>
    <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-700'}`}>{title}</h3>
    <p className={`text-sm text-center max-w-sm ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>{description}</p>
  </div>
)

export default EmptyState