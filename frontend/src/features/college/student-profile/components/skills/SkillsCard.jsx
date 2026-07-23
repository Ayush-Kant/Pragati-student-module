import React from "react";
import { Code, Users } from "lucide-react";
import StatusBadge from "../common/StatusBadge";

export const SkillsCard = ({ skills = {}, darkMode }) => {
  const techSkills = skills?.technical || [];
  const softSkills = skills?.soft || [];

  return (
    <div className={`rounded-2xl border p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] h-full ${darkMode ? 'bg-[#2D2D2D] border-[#3D3D3D]' : 'bg-white border-gray-100'}`}>
      <div className="mb-6">
        <h3 className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Skills Profile</h3>
        <p className="text-xs text-gray-400">Categorized technical and interpersonal capabilities</p>
      </div>

      <div className="space-y-6">
        {/* Technical Skills */}
        <div>
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
            <Code className={`w-4 h-4 ${darkMode ? 'text-[#ff6d34]' : 'text-indigo-500'}`} />
            Technical Competencies
          </h4>
          <div className="flex flex-wrap gap-2.5">
            {techSkills.length === 0 ? (
              <span className="text-xs text-gray-400">No tech skills logged</span>
            ) : (
              techSkills.map((skill, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold ${darkMode ? 'border-[#3D3D3D] bg-[#1A1A1A] text-gray-200' : 'border-gray-100 bg-slate-50/40 text-gray-700'}`}
                >
                  {skill.name}
                  <StatusBadge status={skill.level} type="proficiency" />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Soft Skills */}
        <div className={`pt-5 border-t ${darkMode ? 'border-[#3D3D3D]' : 'border-gray-50'}`}>
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
            <Users className={`w-4 h-4 ${darkMode ? 'text-[#00bea3]' : 'text-indigo-500'}`} />
            Soft & Interpersonal Skills
          </h4>
          <div className="flex flex-wrap gap-2.5">
            {softSkills.length === 0 ? (
              <span className="text-xs text-gray-400">No interpersonal skills logged</span>
            ) : (
              softSkills.map((skill, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold ${darkMode ? 'border-[#3D3D3D] bg-[#1A1A1A] text-gray-200' : 'border-gray-100 bg-slate-50/40 text-gray-700'}`}
                >
                  {skill.name}
                  <StatusBadge status={skill.level} type="proficiency" />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsCard;
