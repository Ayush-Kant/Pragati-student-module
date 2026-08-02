import { Settings2 } from "lucide-react";

export default function PenaltyConfiguration() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Settings2 className="w-5 h-5 text-gray-500" />

        <h3 className="text-sm font-semibold text-gray-800">
          Late Configuration
        </h3>
      </div>

      <label className="text-xs text-gray-500 block mb-2">
        Penalty Type
      </label>

      <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
        <option>Percentage (-%)</option>
        <option>Fixed Marks</option>
      </select>
    </div>
  );
}