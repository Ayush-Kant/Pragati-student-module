import { Megaphone } from "lucide-react";

export default function NudgeWidget() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Megaphone className="w-5 h-5 text-violet-600" />
        <h3 className="text-sm font-semibold text-gray-800">
          Nudge Actions
        </h3>
      </div>

      <p className="text-xs text-gray-500 mb-5">
        Students inactive in first 30% of timeline.
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-700">
            JD
          </div>

          <div>
            <p className="text-sm font-medium text-gray-800">
              John Doe
            </p>

            <p className="text-xs text-red-500 font-medium">
              2 days left
            </p>
          </div>
        </div>

        <button className="px-3 py-1.5 text-xs rounded-lg border border-gray-300 hover:bg-gray-50">
          Nudge
        </button>
      </div>
    </div>
  );
}