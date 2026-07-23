import React from "react";
import { Calendar, Hourglass, CheckCircle2, Award } from "lucide-react";
import { formatDate } from "../../utils/placementDriveHelpers";

const DriveTimeline = ({ deadline, driveDate, rounds = [], darkMode }) => {
  const steps = [
    {
      title: "Application Deadline",
      description: "Last date for student registrations",
      date: deadline,
      icon: Hourglass,
      color: darkMode ? "text-red-400 bg-red-500/20 border-red-500/30" : "text-red-500 bg-red-50 border-red-200",
    },
    {
      title: "Placement Drive Date",
      description: "Company campus drive kickoff",
      date: driveDate,
      icon: Calendar,
      color: darkMode ? "text-blue-400 bg-blue-500/20 border-blue-500/30" : "text-blue-500 bg-blue-50 border-blue-200",
    },
    {
      title: "Selection Rounds",
      description: `${rounds.length || 3} evaluation rounds scheduled`,
      date: driveDate ? new Date(new Date(driveDate).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] : null,
      icon: CheckCircle2,
      color: darkMode ? "text-amber-400 bg-amber-500/20 border-amber-500/30" : "text-amber-500 bg-amber-50 border-amber-200",
    },
    {
      title: "Final Results Announcement",
      description: "Selected candidates list publication",
      date: driveDate ? new Date(new Date(driveDate).getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : null,
      icon: Award,
      color: darkMode ? "text-green-400 bg-green-500/20 border-green-500/30" : "text-green-500 bg-green-50 border-green-200",
    },
  ];

  return (
    <div className={`relative border-l pl-6 ml-4 space-y-8 py-2 shrink-0 ${darkMode ? 'border-[#3D3D3D]' : 'border-gray-200'}`}>
      {steps.map((step, idx) => {
        const Icon = step.icon;
        return (
          <div key={idx} className="relative">
            {/* Dot Indicator */}
            <span className={`absolute -left-[38px] top-0.5 flex items-center justify-center w-8 h-8 rounded-full border-2 ${darkMode ? 'bg-[#2D2D2D]' : 'bg-white'} ${step.color} shadow-sm shrink-0`}>
              <Icon size={14} />
            </span>
            {/* Step info */}
            <div>
              <h5 className={`text-sm font-semibold leading-none ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                {step.title}
              </h5>
              <p className={`text-xs font-medium mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                {step.description}
              </p>
              {step.date && (
                <span className={`inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full mt-2 ${darkMode ? 'text-gray-400 bg-[#3D3D3D]' : 'text-gray-600 bg-gray-100'}`}>
                  {formatDate(step.date)}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DriveTimeline;
