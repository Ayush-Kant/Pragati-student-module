import {ClipboardCheck} from 'lucide-react';

const InstructorRemarks = ({ remarks = [] }) => {
  if (!remarks || remarks.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <ClipboardCheck className="w-5 h-5 text-blue-600" />
        <h3 className="text-base font-bold text-gray-800">Instructor Remarks</h3>
      </div>

      <div className="flex flex-col gap-3">
        {remarks.map((remark, index) => (
          <div
            key={index}
            className="border-l-2 border-blue-400 pl-3 py-0.5"
          >
            {remark.category && (
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-0.5">
                {remark.category}
              </p>
            )}
            <p className="text-sm text-gray-700">{remark.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InstructorRemarks;
