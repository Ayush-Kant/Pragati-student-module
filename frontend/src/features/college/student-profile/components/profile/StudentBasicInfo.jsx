import React from "react";
import { User, Calendar, BookOpen, Layers, Users } from "lucide-react";

export const StudentBasicInfo = ({ student, darkMode }) => {
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
    <div className={`rounded-2xl border p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] ${darkMode ? 'bg-[#2D2D2D] border-[#3D3D3D]' : 'bg-white border-gray-100'}`}>
      <h3 className={`text-sm font-bold mb-4 pb-2 border-b ${darkMode ? 'text-white border-[#3D3D3D]' : 'text-gray-800 border-gray-50'}`}>Personal Details</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map((field, idx) => {
          const Icon = field.icon;
          return (
            <div key={idx} className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${darkMode ? 'bg-[#1A1A1A] border-[#3D3D3D] text-gray-400' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>
                <Icon className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  {field.label}
                </span>
                <span className={`text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{field.value}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StudentBasicInfo;
