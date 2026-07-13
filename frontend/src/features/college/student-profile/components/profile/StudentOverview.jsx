import React from "react";
import { Award, Code, Briefcase, TrendingUp } from "lucide-react";

export const StudentOverview = ({ student, academics = [], placements = [] }) => {
  const safeStudent = student || {};
  
  // Find top achievements and projects
  const topProject = safeStudent.projects?.[0]?.title || "No projects listed yet";
  const latestInternship = safeStudent.internships?.[0]
    ? `${safeStudent.internships[0].role} at ${safeStudent.internships[0].company}`
    : "No internships listed yet";
  const primarySkills = safeStudent.skills?.technical?.slice(0, 3).map((s) => s.name).join(", ") || "No skills listed yet";

  // Placed company or target eligibility
  let statusSummary = "Preparing for placements";
  if (safeStudent.placementStatus === "Placed") {
    const placedItem = placements.find((p) => p.status === "Placed");
    statusSummary = placedItem
      ? `Placed at ${placedItem.company} (${placedItem.ctc})`
      : "Placed";
  } else if (safeStudent.placementStatus === "Eligible") {
    statusSummary = "Eligible and actively participating in placement drives";
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
      <h3 className="text-sm font-bold text-gray-800 mb-4 pb-2 border-b border-gray-50">Profile Summary</h3>
      <div className="space-y-4">
        <p className="text-sm text-gray-500 leading-relaxed">
          {safeStudent.name || "This student"} is a dedicated {safeStudent.course || "N/A"} student specializing in {safeStudent.department || "N/A"}. 
          Currently in semester {safeStudent.semester || "N/A"}, maintains a cumulative grade point average of {safeStudent.cgpa || "0.00"}. 
          Shows strong competency in software development and technical systems.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Skill highlights */}
          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100/60">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 mt-0.5">
              <Code className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider">Top Tech Skills</span>
              <span className="text-xs font-semibold text-gray-700">{primarySkills}</span>
            </div>
          </div>

          {/* Placement Status */}
          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100/60">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 mt-0.5">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider">Placement Outlook</span>
              <span className="text-xs font-semibold text-gray-700">{statusSummary}</span>
            </div>
          </div>

          {/* Project Highlights */}
          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100/60">
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600 mt-0.5">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider">Featured Project</span>
              <span className="text-xs font-semibold text-gray-700">{topProject}</span>
            </div>
          </div>

          {/* Internship Highlights */}
          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100/60">
            <div className="p-2 rounded-lg bg-violet-50 text-violet-600 mt-0.5">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider">Work Experience</span>
              <span className="text-xs font-semibold text-gray-700 text-line-clamp-1">{latestInternship}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentOverview;
