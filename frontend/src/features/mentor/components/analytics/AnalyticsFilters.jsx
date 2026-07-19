export default function AnalyticsFilters({
  filters,
  onFilterChange,
}) {
  return (
    <div className="mt-8 mb-6 bg-white border rounded-xl p-4">
      <div className="flex flex-wrap gap-4">

        <select
          value={filters.project}
          onChange={(e) =>
            onFilterChange("project", e.target.value)
          }
          className="border rounded-lg px-4 py-2 bg-white"
        >
          <option>All Projects</option>
          <option>Frontend</option>
          <option>Backend</option>
          <option>AI</option>
        </select>

        <select
          value={filters.batch}
          onChange={(e) =>
            onFilterChange("batch", e.target.value)
          }
          className="border rounded-lg px-4 py-2 bg-white"
        >
          <option>All Batches</option>
          <option>Batch A</option>
          <option>Batch B</option>
          <option>Batch C</option>
        </select>

        <select
          value={filters.period}
          onChange={(e) =>
            onFilterChange("period", e.target.value)
          }
          className="border rounded-lg px-4 py-2 bg-white"
        >
          <option>This Week</option>
          <option>This Month</option>
        </select>

      </div>
    </div>
  );
}