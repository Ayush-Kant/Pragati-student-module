// EmptyState.jsx
// Shown when a list (courses, lessons, resources) has no items to display

const EmptyState = ({ title = "Nothing here yet", message, icon = "📭" }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed border-gray-200 rounded-xl bg-gray-50">
      <span className="text-4xl mb-3">{icon}</span>
      <h3 className="text-base font-semibold text-gray-700">{title}</h3>
      {message && <p className="text-sm text-gray-500 mt-1 max-w-sm">{message}</p>}
    </div>
  );
};

export default EmptyState;
