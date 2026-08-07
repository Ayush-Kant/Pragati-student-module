const ProgressCard = ({ title, completed, total, progress }) => {
  return (
    <div className="rounded-xl bg-white p-6 shadow-md transition duration-300 hover:shadow-xl">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>

        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-600">
          {progress}%
        </span>
      </div>

      <div className="mt-5 h-3 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-blue-600 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-4 flex justify-between text-sm text-gray-500">
        <span>Completed: {completed}</span>

        <span>Total: {total}</span>
      </div>
    </div>
  );
};

export default ProgressCard;