import { Target, TrendingUp } from "lucide-react";

const getGradeLabel = (pct) => {
  if (pct >= 90) return "A+";
  if (pct >= 80) return "A";
  if (pct >= 70) return "B+";
  if (pct >= 60) return "B";
  if (pct >= 50) return "C";
  return "F";
};

const GradeCard = ({ marksObtained, totalMarks, title = "Grade", darkMode = false }) => {
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
        bg: darkMode ? "bg-emerald-900/30" : "bg-emerald-50",
        border: darkMode ? "border-emerald-700" : "border-emerald-200",
        ring: darkMode ? "text-emerald-400" : "text-emerald-600",
      };
    if (pct >= 50)
      return {
        bar: "bg-amber-400",
        text: "text-amber-700",
        bg: darkMode ? "bg-amber-900/30" : "bg-amber-50",
        border: darkMode ? "border-amber-700" : "border-amber-200",
        ring: darkMode ? "text-amber-400" : "text-amber-600",
      };
    return {
      bar: "bg-red-400",
      text: "text-red-700",
      bg: darkMode ? "bg-red-900/30" : "bg-red-50",
      border: darkMode ? "border-red-700" : "border-red-200",
      ring: darkMode ? "text-red-400" : "text-red-600",
    };
  };

  const colors = percentage !== null ? getGradeColor(percentage) : null;

  return (
    <div className={`rounded-2xl border shadow-sm p-5 sm:p-6 transition-colors ${darkMode ? "bg-slate-900 border-slate-700" : "bg-white border-gray-100"}`}>
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${darkMode ? "bg-rose-900/30" : "bg-rose-50"}`}>
          <Target className="w-4 h-4 text-rose-500" />
        </div>
        <h3 className={`text-base font-semibold ${darkMode ? "text-slate-200" : "text-gray-900"}`}>{title}</h3>
      </div>

      {hasGrade ? (
        <div className="flex flex-col gap-4">
          {/* Score + grade letter */}
          <div className="flex items-end justify-between">
            <div>
              <p className={`text-4xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                {marksObtained}
                <span className={`text-xl font-semibold ${darkMode ? "text-slate-500" : "text-gray-400"}`}>
                  /{totalMarks}
                </span>
              </p>
              <p className={`text-xs mt-0.5 flex items-center gap-1 ${darkMode ? "text-slate-500" : "text-gray-400"}`}>
                <TrendingUp className="w-3 h-3" />
                marks obtained
              </p>
            </div>
            {percentage !== null && colors && (
              <div className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl border-2 ${colors.bg} ${colors.border}`}>
                <span className={`text-xl font-bold ${colors.ring}`}>
                  {getGradeLabel(percentage)}
                </span>
                <span className={`text-[10px] font-semibold ${colors.ring}`}>
                  {percentage}%
                </span>
              </div>
            )}
          </div>

          {/* Progress bar */}
          {percentage !== null && colors && (
            <div>
              <div className={`h-2 rounded-full overflow-hidden ${darkMode ? "bg-slate-700" : "bg-gray-100"}`}>
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${colors.bar}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <p className={`text-xs mt-1.5 ${darkMode ? "text-slate-500" : "text-gray-400"}`}>
                {percentage}% score
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-6 gap-2 text-center">
          <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${darkMode ? "bg-slate-800 border-slate-700" : "bg-gray-50 border-gray-100"}`}>
            <Target className={`w-6 h-6 ${darkMode ? "text-slate-600" : "text-gray-300"}`} />
          </div>
          <p className={`text-sm font-medium ${darkMode ? "text-slate-400" : "text-gray-400"}`}>Grade not available yet</p>
          <p className={`text-xs ${darkMode ? "text-slate-600" : "text-gray-300"}`}>Check back after evaluation</p>
        </div>
      )}
    </div>
  );
};

export default GradeCard;
