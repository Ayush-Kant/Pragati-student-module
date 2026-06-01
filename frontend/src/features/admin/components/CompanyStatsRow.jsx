export default function CompanyStatsRow({ company }) {
  const stats = [
    {
      label: "Total Jobs",
      value: company.totalJobs || 0,
    },
    {
      label: "Total Hires",
      value: company.totalHires || 0,
    },
    {
      label: "Acceptance Rate",
      value: `${company.acceptanceRate || 0}%`,
    },
    {
      label: "Engagement Score",
      value: company.engagementScore || 0,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="border rounded-lg p-4 shadow-sm"
        >
          <p className="text-sm text-gray-500">
            {stat.label}
          </p>

          <h3 className="text-2xl font-bold mt-2">
            {stat.value}
          </h3>
        </div>
      ))}
    </div>
  );
}