const EmptyState = ({ title = "No students found", description = "Try adjusting your filters or add a new student." }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-3">
    <span className="text-6xl">🎓</span>
    <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
    <p className="text-sm text-gray-400 text-center max-w-sm">{description}</p>
  </div>
)

export default EmptyState