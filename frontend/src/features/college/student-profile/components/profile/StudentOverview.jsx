import React, { useMemo } from "react";
import { Award, Code, Briefcase, TrendingUp } from "lucide-react";

export const StudentOverview = ({ student, academics = [], placements = [], darkMode }) => {
  const safeStudent = student || {};
  
  // Performance Optimization: Memoize computations
  const topProject = useMemo(() => {
    return safeStudent.projects?.[0]?.title || "No projects listed yet";
  }, [safeStudent.projects]);

  const latestInternship = useMemo(() => {
    return safeStudent.internships?.[0]
      ? `${safeStudent.internships[0].role} at ${safeStudent.internships[0].company}`
      : "No internships listed yet";
  }, [safeStudent.internships]);

  const primarySkills = useMemo(() => {
    return safeStudent.skills?.technical?.slice(0, 3).map((s) => s.name).join(", ") || "No skills listed yet";
  }, [safeStudent.skills?.technical]);

  const statusSummary = useMemo(() => {
    if (safeStudent.placementStatus === "Placed") {
      const placedItem = placements.find((p) => p.status === "Placed");
      return placedItem
        ? `Placed at ${placedItem.company} (${placedItem.ctc})`
        : "Placed";
    } else if (safeStudent.placementStatus === "Eligible") {
      return "Eligible and actively participating in placement drives";
    }
    return "Preparing for placements";
  }, [safeStudent.placementStatus, placements]);

  return (
    <div className={`rounded-2xl border p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] ${darkMode ? 'bg-[#2D2D2D] border-[#3D3D3D]' : 'bg-white border-gray-100'}`}>
      <h3 className={`text-sm font-bold mb-4 pb-2 border-b ${darkMode ? 'text-white border-[#3D3D3D]' : 'text-gray-800 border-gray-50'}`}>Profile Summary</h3>
      <div className="space-y-4">
        <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {safeStudent.name || "This student"} is a dedicated {safeStudent.course || "N/A"} student specializing in {safeStudent.department || "N/A"}. 
          Currently in semester {safeStudent.semester || "N/A"}, maintains a cumulative grade point average of {safeStudent.cgpa || "0.00"}. 
          Shows strong competency in software development and technical systems.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Skill highlights */}
          <div className={`flex items-start gap-3 p-3 rounded-xl border ${darkMode ? 'bg-[#1A1A1A] border-[#3D3D3D]' : 'bg-slate-50 border-slate-100/60'}`}>
            <div className="p-2 rounded-lg bg-[#ff6d34]/10 text-[#ff6d34] mt-0.5">
              <Code className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider">Top Tech Skills</span>
              <span className={`text-xs font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{primarySkills}</span>
            </div>
          </div>

          {/* Placement Status */}
          <div className={`flex items-start gap-3 p-3 rounded-xl border ${darkMode ? 'bg-[#1A1A1A] border-[#3D3D3D]' : 'bg-slate-50 border-slate-100/60'}`}>
            <div className="p-2 rounded-lg bg-[#00bea3]/10 text-[#00bea3] mt-0.5">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider">Placement Outlook</span>
              <span className={`text-xs font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{statusSummary}</span>
            </div>
          </div>

          {/* Project Highlights */}
          <div className={`flex items-start gap-3 p-3 rounded-xl border ${darkMode ? 'bg-[#1A1A1A] border-[#3D3D3D]' : 'bg-slate-50 border-slate-100/60'}`}>
            <div className="p-2 rounded-lg bg-[#ff6d34]/10 text-[#ff6d34] mt-0.5">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider">Featured Project</span>
              <span className={`text-xs font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{topProject}</span>
            </div>
          </div>

          {/* Internship Highlights */}
          <div className={`flex items-start gap-3 p-3 rounded-xl border ${darkMode ? 'bg-[#1A1A1A] border-[#3D3D3D]' : 'bg-slate-50 border-slate-100/60'}`}>
            <div className="p-2 rounded-lg bg-[#00bea3]/10 text-[#00bea3] mt-0.5">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider">Work Experience</span>
              <span className={`text-xs font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'} text-line-clamp-1`}>{latestInternship}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentOverview;
