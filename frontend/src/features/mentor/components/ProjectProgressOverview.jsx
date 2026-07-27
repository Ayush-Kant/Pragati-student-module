export default function ProjectProgressOverview() {
  return (
    <div className="bg-white rounded-2xl border p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-[#141b2b]">
        Project Progress Overview
      </h2>

      <p className="text-gray-500 mt-1">
        Aggregate performance data across all enterprise tracks.
      </p>

      <div className="mt-8 flex flex-col lg:flex-row items-center gap-10">

        {/* Circular Progress */}

        <div className="relative w-48 h-48">

          <div
            className="
              w-48
              h-48
              rounded-full
              border-[14px]
              border-blue-600
              border-r-blue-100
              border-b-blue-100
              rotate-45
            "
          />

          <div className="absolute inset-0 flex flex-col items-center justify-center">

            <h2 className="text-5xl font-bold">
              78%
            </h2>

            <p className="text-gray-500">
              Overall
            </p>

          </div>

        </div>

        {/* Right */}

        <div className="flex-1">

          <p className="text-gray-600">
            Velocity is up by
            <span className="font-semibold">
              {" "}12%
            </span>
            {" "}compared to the last sprint cycle.
          </p>

          <div className="grid grid-cols-3 gap-8 mt-8">

            <div>
              <div className="w-3 h-3 rounded-full bg-blue-600 mb-2" />
              <p className="text-gray-500 text-sm">
                Active
              </p>

              <h3 className="text-3xl font-bold">
                14
              </h3>

              <p className="text-gray-500">
                Projects
              </p>

            </div>

            <div>
              <div className="w-3 h-3 rounded-full bg-green-600 mb-2" />
              <p className="text-gray-500 text-sm">
                Completed
              </p>

              <h3 className="text-3xl font-bold">
                8
              </h3>

              <p className="text-gray-500">
                Projects
              </p>

            </div>

            <div>
              <div className="w-3 h-3 rounded-full bg-red-600 mb-2" />
              <p className="text-gray-500 text-sm">
                Delayed
              </p>

              <h3 className="text-3xl font-bold">
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