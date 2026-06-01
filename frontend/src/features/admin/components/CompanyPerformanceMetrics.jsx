export default function CompanyPerformanceMetrics({ company }) {
  const metrics = [
    {
      title: "Offer Acceptance Rate",
      value: `${company.offerAcceptanceRate}%`,
    },
    {
      title: "Interview-To-Hire",
      value: `${company.interviewToHireConversion}%`,
    },
    {
      title: "Average Response Time",
      value: company.averageResponseTime,
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-4 mt-6">
      {metrics.map((metric) => (
        <div
          key={metric.title}
          className="border rounded-lg p-4"
        >
          <p className="text-gray-500">
            {metric.title}
          </p>

          <h3 className="text-2xl font-bold mt-2">
            {metric.value}
          </h3>
        </div>
      ))}
    </div>
  );
}