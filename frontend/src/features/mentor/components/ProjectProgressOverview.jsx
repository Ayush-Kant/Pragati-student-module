export default function ProjectProgressOverview() {
  return (
    <div className="bg-white rounded-2xl border p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-[#141b2b]">
        Project Progress Overview
      </h2>

      <p className="text-gray-500 mt-1">
        Aggregate performance data across all enterprise tracks.
      </p>

      <div className="mt-8 flex flex-col lg:flex-row items-center gap-12">

        {/* Circular Progress */}
        <div className="relative w-56 h-56 flex items-center justify-center">

          <svg
            className="w-56 h-56 -rotate-45"
            viewBox="0 0 200 200"
          >
            {/* Background Circle */}
            <circle
              cx="100"
              cy="100"
              r="82"
              fill="none"
              stroke="#DCEBFF"
              strokeWidth="14"
            />

            {/* Progress Circle (78%) */}
            <circle
              cx="100"
              cy="100"
              r="82"
              fill="none"
              stroke="#2563EB"
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray="515"
              strokeDashoffset="113"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <h2 className="text-6xl font-bold text-[#141b2b]">
              78%
            </h2>

            <p className="text-gray-500 text-xl">
              Overall
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex-1">

          <p className="text-gray-600 text-lg leading-7">
            Velocity is up by{" "}
            <span className="font-semibold">12%</span> compared to the last
            sprint cycle.
          </p>

          <div className="grid grid-cols-3 gap-10 mt-10">

            {/* Active */}
            <div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-600"></div>

                <span className="text-gray-600">
                  Active
                </span>
              </div>

              <h3 className="text-4xl font-bold mt-2">
                14
              </h3>

              <p className="text-gray-500">
                Projects
              </p>
            </div>

            {/* Completed */}
            <div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-600"></div>

                <span className="text-gray-600">
                  Completed
                </span>
              </div>

              <h3 className="text-4xl font-bold mt-2">
                8
              </h3>

              <p className="text-gray-500">
                Projects
              </p>
            </div>

            {/* Delayed */}
            <div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-600"></div>

                <span className="text-gray-600">
                  Delayed
                </span>
              </div>

              <h3 className="text-4xl font-bold mt-2">
                2
              </h3>

              <p className="text-gray-500">
                Projects
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}