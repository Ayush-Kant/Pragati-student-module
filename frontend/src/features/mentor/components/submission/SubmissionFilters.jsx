import { Filter } from "lucide-react";

export default function SubmissionFilters() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-3">
          <select className="px-4 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option>All Status</option>
            <option>Submitted</option>
            <option>In Progress</option>
            <option>Not Started</option>
            <option>Late</option>
          </select>

          <select className="px-4 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option>All Projects</option>
            <option>Frontend</option>
            <option>Backend</option>
            <option>AI</option>
          </select>

          <select className="px-4 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option>All Batches</option>
            <option>Batch A</option>
            <option>Batch B</option>
          </select>
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 accent-indigo-600"
          />
          Late Only
        </label>
      </div>
    </div>
  );
}