import React from "react";
import { User, Calendar, BookOpen, Layers, Users } from "lucide-react";

export const StudentBasicInfo = ({ student }) => {
  const safeStudent = student || {};
  const fields = [
    { label: "Gender", value: safeStudent.gender || "—", icon: User },
    { label: "Batch Year", value: safeStudent.batch || "—", icon: Calendar },
    { label: "Department", value: safeStudent.department || "—", icon: BookOpen },
    { label: "Course / Stream", value: safeStudent.course || "—", icon: Layers },
    { label: "Current Semester", value: safeStudent.semester ? `Semester ${safeStudent.semester}` : "—", icon: Layers },
    { label: "Section", value: safeStudent.section || "—", icon: Users },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
      <h3 className="text-sm font-bold text-gray-800 mb-4 pb-2 border-b border-gray-50">Personal Details</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map((field, idx) => {
          const Icon = field.icon;
          return (
            <div key={idx} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 text-slate-500">
                <Icon className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  {field.label}
                </span>
                <span className="text-sm font-semibold text-gray-700">{field.value}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StudentBasicInfo;
