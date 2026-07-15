import React, { useMemo } from "react";
import { Layers, Award, Building2, Calendar, ClipboardList } from "lucide-react";

export const StudentStatistics = ({ student, academics = [], placements = [] }) => {
  const safeStudent = student || {};
  
  // Performance Optimization: Memoize all metric calculations
  const semestersCompleted = useMemo(() => academics.length, [academics]);
  
  const techSkillsCount = useMemo(() => safeStudent.skills?.technical?.length || 0, [safeStudent.skills?.technical]);
  const softSkillsCount = useMemo(() => safeStudent.skills?.soft?.length || 0, [safeStudent.skills?.soft]);
  const totalSkills = useMemo(() => techSkillsCount + softSkillsCount, [techSkillsCount, softSkillsCount]);
  
  const totalApplied = useMemo(() => placements.length, [placements]);
  
  const interviewsScheduled = useMemo(() => {
    return placements.reduce(
      (count, item) => count + (item && Array.isArray(item.rounds) ? item.rounds.filter(r => r.status === "Scheduled").length : 0),
      0
    );
  }, [placements]);
  
  const activeOffers = useMemo(() => {
    return placements.filter(
      (item) => item && (item.status === "Placed" || item.status === "Offered")
    ).length;
  }, [placements]);

  const stats = [
    {
      title: "Semesters",
      value: semestersCompleted,
      caption: "Completed",
      icon: Layers,
      color: "from-blue-50 to-indigo-50 text-indigo-600 border-indigo-100/80"
    },
    {
      title: "Skills Acquired",
      value: totalSkills,
      caption: `${techSkillsCount} Tech, ${softSkillsCount} Soft`,
      icon: Award,
      color: "from-emerald-50 to-teal-50 text-emerald-600 border-emerald-100/80"
    },
    {
      title: "Applications",
      value: totalApplied,
      caption: "Applied companies",
      icon: Building2,
      color: "from-violet-50 to-fuchsia-50 text-violet-600 border-violet-100/80"
    },
    {
      title: "Interviews",
      value: interviewsScheduled,
      caption: "Scheduled sessions",
      icon: Calendar,
      color: "from-amber-50 to-orange-50 text-amber-600 border-amber-100/80"
    },
    {
      title: "Job Offers",
      value: activeOffers,
      caption: "Offers received",
      icon: ClipboardList,
      color: "from-sky-50 to-blue-50 text-sky-600 border-sky-100/80"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-gray-100 p-4 shadow-[0_4px_20px_rgba(0,0,0,0.015)] flex flex-col justify-between hover:shadow-[0_6px_25px_rgba(0,0,0,0.04)] transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">
                {stat.title}
              </span>
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center ${stat.color} border`}>
                <Icon className="w-4.5 h-4.5" />
              </div>
            </div>
            <div>
              <span className="block text-2xl font-extrabold text-gray-900 leading-tight">
                {stat.value}
              </span>
              <span className="text-[10px] font-semibold text-gray-400">
                {stat.caption}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StudentStatistics;
