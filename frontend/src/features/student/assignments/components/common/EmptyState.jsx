const EmptyState = ({ icon = "📂", title = "Nothing here yet", description = "" }) => (
  <div className="flex flex-col items-center justify-center py-14 gap-3 text-center">
    <span className="text-4xl">{icon}</span>
    <p className="text-sm font-semibold text-gray-700">{title}</p>
    {description && <p className="text-xs text-gray-400 max-w-xs">{description}</p>}
  </div>
);

export default EmptyState;
