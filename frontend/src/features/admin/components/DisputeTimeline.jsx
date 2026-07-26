export default function DisputeTimeline({
  timeline = [],
  darkMode,
}) {
  if (!timeline.length) {
    return (
      <div
        className={`text-center py-8 ${
          darkMode ? "text-gray-400" : "text-gray-500"
        }`}
      >
        No timeline available.
      </div>
    );
  }

  return (
    <div className="relative">

      {timeline.map((item, index) => (

        <div
          key={index}
          className="flex gap-4 pb-8 last:pb-0"
        >

          {/* Timeline Line */}

          <div className="flex flex-col items-center">

            <div className="w-4 h-4 rounded-full bg-blue-600"></div>

            {index !== timeline.length - 1 && (
              <div
                className={`w-0.5 flex-1 mt-2 ${
                  darkMode
                    ? "bg-slate-600"
                    : "bg-gray-300"
                }`}
              ></div>
            )}

          </div>

          {/* Timeline Content */}

          <div
            className={`flex-1 rounded-lg p-4 ${
              darkMode
                ? "bg-slate-800 border border-slate-700"
                : "bg-gray-50 border"
            }`}
          >

            <div className="flex justify-between items-center">

              <h3 className="font-semibold text-lg">
                {item.title}
              </h3>

              <span
                className={`text-sm ${
                  darkMode
                    ? "text-gray-400"
                    : "text-gray-500"
                }`}
              >
                {item.date}
              </span>

            </div>

            <p
              className={`mt-2 ${
                darkMode
                  ? "text-gray-300"
                  : "text-gray-600"
              }`}
            >
              {item.description}
            </p>

          </div>

        </div>

      ))}

    </div>
  );
}