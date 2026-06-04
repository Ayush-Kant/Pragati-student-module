export default function CompanyPerformanceMetrics({ company, darkMode = false }) {
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
          className={`rounded-xl p-4 shadow-sm transition ${darkMode ? "bg-slate-950 border border-slate-700" : "bg-white border border-slate-200"}`} >
          <p className={`text-sm ${darkMode ? "text-slate-400" : "text-gray-500"}`}>
            {metric.title}
          </p>

          <h3 className={`text-2xl font-bold mt-2 ${darkMode ? "text-white" : "text-slate-900"}`}>
            {metric.value}
          </h3>
        </div>
      ))}
    </div>
  );
}