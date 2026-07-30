import { useState } from "react";

export default function SubmissionVelocityChart() {
  const [view, setView] = useState("week");

  const weeklyValues = [45, 28, 58, 50, 62, 70, 60];
  const weeklyLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const monthlyValues = [30, 55, 42, 68];
  const monthlyLabels = ["Week 1", "Week 2", "Week 3", "Week 4"];

  const values = view === "week" ? weeklyValues : monthlyValues;
  const labels = view === "week" ? weeklyLabels : monthlyLabels;

  return (
    <div className="bg-white border rounded-xl p-6 h-full">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">

        <h2 className="font-semibold text-lg">
          Submission Velocity
        </h2>

        <div className="flex gap-2">

          <button
            onClick={() => setView("week")}
            className={`px-3 py-1 rounded text-sm transition ${
              view === "week"
                ? "bg-slate-100 font-semibold"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            W
          </button>

          <button
            onClick={() => setView("month")}
            className={`px-3 py-1 rounded text-sm transition ${
              view === "month"
                ? "bg-slate-100 font-semibold"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            M
          </button>

        </div>

      </div>

      {/* Bars */}
      <div className="flex items-end justify-between h-64">

        {values.map((value, index) => (

          <div
            key={labels[index]}
            className="flex flex-col items-center gap-3 flex-1"
          >

            <div
              className={`w-14 rounded-t-md ${
                index === values.length - 2
                  ? "bg-teal-600"
                  : index === 3
                  ? "bg-blue-700"
                  : "bg-blue-500"
              }`}
              style={{
                height: `${value * 2.5}px`,
              }}
            />

            <span className="text-xs text-gray-500">
              {labels[index]}
            </span>

          </div>

        ))}

      </div>

    </div>
  );
}