import EmptyState from "../common/EmptyState";
import SectionHeader from "../common/SectionHeader";

const EvaluationSummary = ({ criteria = [] }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
    <SectionHeader title="📊 Evaluation Summary" />

    {criteria.length === 0 ? (
      <EmptyState
        icon="📋"
        title="No evaluation data"
        description="Marks breakdown will appear after grading."
      />
    ) : (
      <div className="flex flex-col gap-3">
        {criteria.map((item, index) => {
          const pct = item.total > 0
            ? Math.round((item.score / item.total) * 100)
            : 0;

          return (
            <div key={index}>
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span className="font-medium text-gray-700">{item.label}</span>
                <span className="font-semibold text-gray-700">
                  {item.score}/{item.total}
                  <span className="text-gray-400 ml-1">({pct}%)</span>
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}

        {/* Total */}
        {criteria.length > 1 && (
          <div className="mt-2 pt-3 border-t border-gray-100 flex items-center justify-between text-sm font-bold text-gray-800">
            <span>Total</span>
            <span>
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
