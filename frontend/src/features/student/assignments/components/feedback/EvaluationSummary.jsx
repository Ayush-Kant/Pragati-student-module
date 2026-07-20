import EmptyState from "../common/EmptyState";
import SectionHeader from "../common/SectionHeader";
import { FileCheck2, ClipboardCheck } from "lucide-react";

const barColor = (pct) => {
  if (pct >= 75) return "bg-emerald-500";
  if (pct >= 50) return "bg-amber-400";
  return "bg-red-400";
};

const EvaluationSummary = ({ criteria = [], darkMode = false }) => (
  <div className={`rounded-2xl border shadow-sm p-5 sm:p-6 transition-colors ${darkMode ? "bg-slate-900 border-slate-700" : "bg-white border-gray-100"}`}>
    <SectionHeader
      title={
        <div className="flex items-center gap-2">
          <FileCheck2 className="w-5 h-5 text-blue-600" />
          <span>Evaluation Summary</span>
        </div>
      }
      darkMode={darkMode}
    />

    {criteria.length === 0 ? (
      <EmptyState
        icon={<ClipboardCheck className={`w-8 h-8 ${darkMode ? "text-slate-600" : "text-gray-400"}`} />}
        title="No evaluation data"
        description="Marks breakdown will appear after grading."
        darkMode={darkMode}
      />
    ) : (
      <div className="flex flex-col gap-4">
        {criteria.map((item, index) => {
          const pct =
            item.total > 0 ? Math.round((item.score / item.total) * 100) : 0;

          return (
            <div key={index} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className={`font-semibold ${darkMode ? "text-slate-300" : "text-gray-700"}`}>{item.label}</span>
                <span className={`font-semibold ${darkMode ? "text-slate-300" : "text-gray-700"}`}>
                  {item.score}/{item.total}
                  <span className={`ml-1 font-medium ${darkMode ? "text-slate-500" : "text-gray-400"}`}>
                    ({pct}%)
                  </span>
                </span>
              </div>
              <div className={`h-2 rounded-full overflow-hidden ${darkMode ? "bg-slate-700" : "bg-gray-100"}`}>
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${barColor(pct)}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}

        {/* Total */}
        {criteria.length > 1 && (
          <div className={`mt-1 pt-4 border-t flex items-center justify-between ${darkMode ? "border-slate-700" : "border-gray-100"}`}>
            <span className={`text-sm font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Total</span>
            <span className={`text-sm font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
              {criteria.reduce((s, c) => s + c.score, 0)}/
              {criteria.reduce((s, c) => s + c.total, 0)}
            </span>
          </div>
        )}
      </div>
    )}
  </div>
);

export default EvaluationSummary;
