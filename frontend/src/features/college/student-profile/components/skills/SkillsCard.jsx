import React from "react";
import { Code, Users, Award } from "lucide-react";
import StatusBadge from "../common/StatusBadge";

export const SkillsCard = ({ skills = {} }) => {
  const techSkills = skills?.technical || [];
  const softSkills = skills?.soft || [];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] h-full">
      <div className="mb-6">
        <h3 className="text-sm font-bold text-gray-800">Skills Profile</h3>
        <p className="text-xs text-gray-400">Categorized technical and interpersonal capabilities</p>
      </div>

      <div className="space-y-6">
        {/* Technical Skills */}
        <div>
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
            <Code className="w-4 h-4 text-indigo-500" />
            Technical Competencies
          </h4>
          <div className="flex flex-wrap gap-2.5">
            {techSkills.length === 0 ? (
              <span className="text-xs text-gray-400">No tech skills logged</span>
            ) : (
              techSkills.map((skill, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-100 bg-slate-50/40 text-xs text-gray-700 font-semibold"
                >
                  {skill.name}
                  <StatusBadge status={skill.level} type="proficiency" />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Soft Skills */}
        <div className="pt-5 border-t border-gray-50">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
            <Users className="w-4 h-4 text-indigo-500" />
            Soft & Interpersonal Skills
          </h4>
          <div className="flex flex-wrap gap-2.5">
            {softSkills.length === 0 ? (
              <span className="text-xs text-gray-400">No interpersonal skills logged</span>
            ) : (
              softSkills.map((skill, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-100 bg-slate-50/40 text-xs text-gray-700 font-semibold"
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
