import { Target } from "lucide-react";
const GradeCard = ({ marksObtained, totalMarks, title = "Grade" }) => {
  const hasGrade = marksObtained !== null && marksObtained !== undefined;
  const percentage = hasGrade && totalMarks > 0
    ? Math.round((marksObtained / totalMarks) * 100)
    : null;

  const getGradeColor = (pct) => {
    if (pct >= 75) return { bar: "bg-green-500", text: "text-green-600", bg: "bg-green-50" };
    if (pct >= 50) return { bar: "bg-yellow-400", text: "text-yellow-600", bg: "bg-yellow-50" };
    return { bar: "bg-red-400", text: "text-red-600", bg: "bg-red-50" };
  };

  const colors = percentage !== null ? getGradeColor(percentage) : null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-5 h-5 text-red-500" />
        <h3 className="text-base font-bold text-gray-800">{title}</h3>
      </div>

      {hasGrade ? (
        <div className="flex flex-col gap-3">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900">
                {marksObtained}
                <span className="text-lg font-semibold text-gray-400">
                  /{totalMarks}
                </span>
              </p>
              <p className="text-xs text-gray-400 mt-0.5">marks obtained</p>
            </div>
            {percentage !== null && (
              <span
                className={`text-sm font-bold px-3 py-1 rounded-full ${colors.text} ${colors.bg}`}
              >
                {percentage}%
              </span>
            )}
          </div>

          {/* Progress bar */}
          {percentage !== null && (
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${colors.bar}`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm text-gray-400 italic">Grade not available yet.</p>
      )}
    </div>
  );
};

export default GradeCard;
