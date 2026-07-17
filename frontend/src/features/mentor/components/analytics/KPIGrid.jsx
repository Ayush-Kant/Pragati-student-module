export default function KPIGrid({ data }) {
  const cards = [
    {
      title: "Submission Rate",
      value: data.submissionRate,
      suffix: "%",
      change: "+2%",
      positive: true,
    },
    {
      title: "Avg Score",
      value: data.avgScore,
      suffix: "/100",
    },
    {
      title: "Avg Review Time",
      value: data.avgReviewTime,
    },
    {
      title: "Late %",
      value: data.lateRate,
      suffix: "%",
      change: "+1%",
      positive: false,
    },
    {
      title: "Pass Rate",
      value: data.passRate,
      suffix: "%",
    },
  ];

  return (
    <div className="grid grid-cols-5 gap-6">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-white rounded-xl border p-6"
        >
          <p className="text-xs uppercase tracking-wide text-gray-500">
            {card.title}
          </p>

          <div className="mt-3 flex items-end gap-2">

            <span className="text-4xl font-bold">
              {card.value}
            </span>

            {card.suffix && (
              <span className="text-gray-400 mb-1">
                {card.suffix}
              </span>
            )}

            {card.change && (
              <span
                className={`text-sm mb-1 font-medium ${
                  card.positive
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {card.change}
              </span>
            )}

          </div>
        </div>
      ))}
    </div>
  );
}