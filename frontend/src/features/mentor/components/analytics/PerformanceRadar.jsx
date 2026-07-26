export default function PerformanceRadar() {
  return (
    <div className="bg-white border rounded-xl p-6 h-full">

      <h2 className="text-xl font-semibold mb-6">
        Performance Radar
      </h2>

      <div className="flex justify-center">

        <svg width="230" height="230" viewBox="0 0 220 220">

          {/* Outer Circles */}
          <circle
            cx="110"
            cy="110"
            r="80"
            fill="none"
            stroke="#E5E7EB"
          />

          <circle
            cx="110"
            cy="110"
            r="60"
            fill="none"
            stroke="#E5E7EB"
          />

          <circle
            cx="110"
            cy="110"
            r="40"
            fill="none"
            stroke="#E5E7EB"
          />

          {/* Axis */}

          <line x1="110" y1="30" x2="110" y2="190" stroke="#E5E7EB" />
          <line x1="40" y1="70" x2="180" y2="150" stroke="#E5E7EB" />
          <line x1="180" y1="70" x2="40" y2="150" stroke="#E5E7EB" />

          {/* Filled Shape */}

          <polygon
            points="
              110,50
              170,90
              155,165
              65,165
              50,90
            "
            fill="#2563EB33"
            stroke="#2563EB"
            strokeWidth="2"
          />

        </svg>

      </div>

      {/* Labels */}

      <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-500 mt-4">

        <div className="text-center">
          Architecture
        </div>

        <div className="text-center">
          Code
        </div>

        <div className="text-center">
          Docs
        </div>

        <div className="text-center">
          Testing
        </div>

      </div>

    </div>
  );
}