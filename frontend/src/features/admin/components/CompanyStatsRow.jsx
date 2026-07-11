export default function CompanyStatsRow({ company, darkMode = false }) {
  const stats = [
    {
      label: "Total Jobs",
      value: company.totalJobs || 0,
      color: "border-blue-500",
    },
    {
      label: "Total Hires",
      value: company.totalHires || 0,
      color: "border-green-500",
    },
    {
      label: "Acceptance Rate",
      value: `${company.acceptanceRate || 0}%`,
      color: "border-purple-500",
    },
    {
      label: "Engagement Score",
      value: company.engagementScore || 0,
      color: "border-orange-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`border rounded-lg p-4 shadow-sm hover:shadow-md transition-all border-l-4 ${stat.color} ${darkMode ? "bg-slate-950 border-slate-700" : "bg-white border-slate-200"}`} >
          <p className={`text-sm ${darkMode ? "text-slate-400" : "text-gray-500"}`}>
            {stat.label}
          </p>

          <h3 className={`text-2xl font-bold mt-2 ${darkMode ? "text-white" : "text-slate-900"}`}>
            {stat.value}
          </h3>
        </div>
      ))}
    </div>
  );
}