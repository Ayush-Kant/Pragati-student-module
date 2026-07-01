export default function RubricCriterionCard({
  title,
  description,
  score,
  onScoreChange,
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5">

      {/* Header */}

      <div className="flex justify-between items-start">

        <div>

          <h3 className="text-xl font-semibold text-gray-900">
            {title}
          </h3>

          <p className="mt-2 text-gray-500 leading-6">
            {description}
          </p>

        </div>

        {/* Score */}

        <div className="flex items-center gap-2">

          <input
            type="number"
            min={0}
            max={15}
            value={score}
            onChange={(e) =>
              onScoreChange(
                Math.min(
                  15,
                  Math.max(0, Number(e.target.value))
                )
              )
            }
            className="
              w-18
              h-11
              border
              border-gray-300
              rounded-lg
              text-center
              font-semibold
              outline-none
              focus:ring-2
              focus:ring-blue-500
            "
          />

          <span className="text-gray-400 font-medium">
            / 15
          </span>

        </div>

      </div>

      {/* Feedback */}

      <textarea
        rows={3}
        placeholder="Add specific feedback for this criterion..."
        className="
          mt-5
          w-full
          rounded-xl
          border
          border-gray-300
          p-4
          resize-none
          outline-none
          focus:ring-2
          focus:ring-blue-500
          placeholder:text-gray-400
        "
      />

    </div>
  );
}