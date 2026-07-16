import { ClipboardCheck } from "lucide-react";

const categoryColor = {
  Strength: "border-l-emerald-400 bg-emerald-50/50",
  Improvement: "border-l-amber-400 bg-amber-50/50",
  Note: "border-l-blue-400 bg-blue-50/50",
};

const categoryBadge = {
  Strength: "bg-emerald-100 text-emerald-700",
  Improvement: "bg-amber-100 text-amber-700",
  Note: "bg-blue-100 text-blue-700",
};

const InstructorRemarks = ({ remarks = [] }) => {
  if (!remarks || remarks.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
          <ClipboardCheck className="w-4 h-4 text-blue-600" />
        </div>
        <h3 className="text-base font-semibold text-gray-900">
          Instructor Remarks
        </h3>
      </div>

      <div className="flex flex-col gap-2.5">
        {remarks.map((remark, index) => {
          const borderBg =
            categoryColor[remark.category] ??
            "border-l-gray-300 bg-gray-50/50";
          const badge =
            categoryBadge[remark.category] ?? "bg-gray-100 text-gray-600";

          return (
            <div
              key={index}
              className={`border-l-[3px] pl-3.5 py-2.5 pr-3 rounded-r-xl ${borderBg}`}
            >
              {remark.category && (
                <span
                  className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md mb-1.5 ${badge}`}
                >
                  {remark.category}
                </span>
              )}
              <p className="text-sm text-gray-700 leading-relaxed">
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
