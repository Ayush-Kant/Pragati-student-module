import { Target, TrendingUp } from "lucide-react";

const getGradeLabel = (pct) => {
  if (pct >= 90) return "A+";
  if (pct >= 80) return "A";
  if (pct >= 70) return "B+";
  if (pct >= 60) return "B";
  if (pct >= 50) return "C";
  return "F";
};

const GradeCard = ({ marksObtained, totalMarks, title = "Grade" }) => {
  const hasGrade = marksObtained !== null && marksObtained !== undefined;
  const percentage =
    hasGrade && totalMarks > 0
      ? Math.round((marksObtained / totalMarks) * 100)
      : null;

  const getGradeColor = (pct) => {
    if (pct >= 75)
      return {
        bar: "bg-emerald-500",
        text: "text-emerald-700",
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        ring: "text-emerald-600",
      };
    if (pct >= 50)
      return {
        bar: "bg-amber-400",
        text: "text-amber-700",
        bg: "bg-amber-50",
        border: "border-amber-200",
        ring: "text-amber-600",
      };
    return {
      bar: "bg-red-400",
      text: "text-red-700",
      bg: "bg-red-50",
      border: "border-red-200",
      ring: "text-red-600",
    };
  };

  const colors = percentage !== null ? getGradeColor(percentage) : null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center">
          <Target className="w-4 h-4 text-rose-500" />
        </div>
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      </div>

      {hasGrade ? (
        <div className="flex flex-col gap-4">
          {/* Score + grade letter */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-4xl font-bold text-gray-900">
                {marksObtained}
                <span className="text-xl font-semibold text-gray-400">
                  /{totalMarks}
                </span>
              </p>
              <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                marks obtained
              </p>
            </div>
            {percentage !== null && colors && (
              <div
                className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl border-2 ${colors.bg} ${colors.border}`}
              >
                <span className={`text-xl font-bold ${colors.ring}`}>
                  {getGradeLabel(percentage)}
                </span>
                <span className={`text-[10px] font-semibold ${colors.text}`}>
                  {percentage}%
                </span>
              </div>
            )}
          </div>

          {/* Progress bar */}
          {percentage !== null && colors && (
            <div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${colors.bar}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1.5">
                {percentage}% score
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-6 gap-2 text-center">
          <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
            <Target className="w-6 h-6 text-gray-300" />
          </div>
          <p className="text-sm text-gray-400 font-medium">Grade not available yet</p>
          <p className="text-xs text-gray-300">Check back after evaluation</p>
        </div>
      )}
    </div>
  );
};

export default GradeCard;
