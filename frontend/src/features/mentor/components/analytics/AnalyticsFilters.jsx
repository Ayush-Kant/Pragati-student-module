export default function AnalyticsFilters() {
  return (
    <div className="bg-white border rounded-xl p-4 mb-6 flex gap-4">

      <select className="border rounded-lg px-4 py-2">
        <option>All Projects</option>
      </select>

      <select className="border rounded-lg px-4 py-2">
        <option>All Batches</option>
      </select>

      <select className="border rounded-lg px-4 py-2">
        <option>This Week</option>
      </select>

    </div>
  );
}