const EmptyState = ({
  title = "No Data Available",
  message = "There is no performance data to display.",
}) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white p-12">
      <div className="text-6xl">📊</div>

      <h2 className="mt-4 text-xl font-semibold text-gray-800">
        {title}
      </h2>

      <p className="mt-2 text-center text-gray-500">
        {message}
      </p>
    </div>
  );
};

export default EmptyState;