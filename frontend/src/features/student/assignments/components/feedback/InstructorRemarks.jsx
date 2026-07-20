import { ClipboardCheck } from "lucide-react";

const categoryColor = {
  Strength:    "border-l-emerald-400",
  Improvement: "border-l-amber-400",
  Note:        "border-l-blue-400",
};

const categoryBg = {
  Strength:    { light: "bg-emerald-50/50",  dark: "bg-emerald-900/10" },
  Improvement: { light: "bg-amber-50/50",    dark: "bg-amber-900/10" },
  Note:        { light: "bg-blue-50/50",     dark: "bg-blue-900/10" },
};

const categoryBadge = {
  Strength:    { light: "bg-emerald-100 text-emerald-700", dark: "bg-emerald-900/40 text-emerald-400" },
  Improvement: { light: "bg-amber-100 text-amber-700",     dark: "bg-amber-900/40 text-amber-400" },
  Note:        { light: "bg-blue-100 text-blue-700",       dark: "bg-blue-900/40 text-blue-400" },
};

const InstructorRemarks = ({ remarks = [], darkMode = false }) => {
  if (!remarks || remarks.length === 0) return null;

  return (
    <div className={`rounded-2xl border shadow-sm p-5 sm:p-6 transition-colors ${darkMode ? "bg-slate-900 border-slate-700" : "bg-white border-gray-100"}`}>
      <div className="flex items-center gap-2 mb-5">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${darkMode ? "bg-blue-900/30" : "bg-blue-50"}`}>
          <ClipboardCheck className="w-4 h-4 text-blue-600" />
        </div>
        <h3 className={`text-base font-semibold ${darkMode ? "text-slate-200" : "text-gray-900"}`}>
          Instructor Remarks
        </h3>
      </div>

      <div className="flex flex-col gap-2.5">
        {remarks.map((remark, index) => {
          const borderClass =
            categoryColor[remark.category] ?? "border-l-gray-300";
          const bgClass = remark.category
            ? darkMode
              ? (categoryBg[remark.category]?.dark ?? "bg-slate-800/50")
              : (categoryBg[remark.category]?.light ?? "bg-gray-50/50")
            : darkMode
            ? "bg-slate-800/50"
            : "bg-gray-50/50";

          const badge = remark.category
            ? darkMode
              ? (categoryBadge[remark.category]?.dark ?? "bg-slate-700 text-slate-300")
              : (categoryBadge[remark.category]?.light ?? "bg-gray-100 text-gray-600")
            : darkMode
            ? "bg-slate-700 text-slate-300"
            : "bg-gray-100 text-gray-600";

          return (
            <div
              key={index}
              className={`border-l-[3px] pl-3.5 py-2.5 pr-3 rounded-r-xl ${borderClass} ${bgClass}`}
            >
              {remark.category && (
                <span
                  className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md mb-1.5 ${badge}`}
                >
                  {remark.category}
                </span>
              )}
              <p className={`text-sm leading-relaxed ${darkMode ? "text-slate-300" : "text-gray-700"}`}>
                {remark.text}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InstructorRemarks;
