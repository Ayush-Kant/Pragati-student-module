export default function ScoreSummary({ score }) {
  const maxScore = 60;
  const percentage = score / maxScore;

  const radius = 34;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="relative flex items-center justify-center">
      <svg
        width="84"
        height="84"
        viewBox="0 0 84 84"
        className="-rotate-90"
      >
        {/* Background circle */}
        <circle
          cx="42"
          cy="42"
          r={radius}
          stroke="#E5E7EB"
          strokeWidth="6"
          fill="none"
        />

        {/* Progress circle */}
        <circle
          cx="42"
          cy="42"
          r={radius}
          stroke="#2563EB"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - percentage)}
        />
      </svg>

      {/* Score */}
      <div className="absolute text-3xl font-bold text-gray-900">
        {score}
      </div>
    </div>
  );
}