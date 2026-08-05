import React from "react";
import { X, Briefcase, DollarSign, MapPin, Layers, Award } from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import EligibilityCriteria from "../eligibility/EligibilityCriteria";
import InterviewRounds from "../rounds/InterviewRounds";
import DriveTimeline from "./DriveTimeline";

const DriveDetails = ({ isOpen, onClose, drive, darkMode }) => {
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);
  if (!isOpen || !drive) return null;

  const enrichedDrive = {
    location: "Bangalore",
    hiringProcess: "Pre-Placement Talk -> Aptitude Test -> Technical Interview -> HR Round",
    eligibility: {
      department: ["Computer Science", "Information Technology"],
      course: ["B.Tech", "MCA"],
      batch: ["2026"],
      cgpa: 7.5,
      skills: "React, Node.js, JavaScript, Data Structures",
    },
    rounds: [
      { id: 1, name: "Aptitude Test", status: "Completed" },
      { id: 2, name: "Technical Interview", status: "Upcoming" },
      { id: 3, name: "HR Round", status: "Pending" },
    ],
    ...drive,
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className={`rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200 ${darkMode ? 'bg-[#2D2D2D]' : 'bg-white'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b shrink-0 ${darkMode ? 'border-[#3D3D3D]' : 'border-gray-150'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl font-extrabold text-lg flex items-center justify-center border shrink-0 ${darkMode ? 'bg-[#ff6d34]/20 text-[#ff6d34] border-[#ff6d34]/30' : 'bg-orange-50 text-[#ff7a00] border-orange-100'}`}>
              {enrichedDrive.company?.charAt(0)}
            </div>
            <div>
              <h2 className={`text-lg font-bold leading-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {enrichedDrive.company}
              </h2>
              <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {enrichedDrive.role}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={enrichedDrive.status} darkMode={darkMode} />
            <button
              onClick={onClose}
              className={`p-1.5 rounded-lg transition-colors ${darkMode ? 'text-gray-400 hover:text-gray-300 hover:bg-[#1A1A1A]' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Section 1: Overview Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className={`p-4 rounded-xl border flex items-center gap-3 ${darkMode ? 'border-[#3D3D3D] bg-[#1A1A1A]' : 'border-gray-100 bg-gray-50/50'}`}>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${darkMode ? 'bg-[#ff6d34]/20 text-[#ff6d34]' : 'bg-orange-100 text-[#ff7a00]'}`}>
                <DollarSign size={20} />
              </div>
              <div>
                <p className={`text-[10px] font-bold uppercase tracking-wider ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  Package Offered
                </p>
                <p className={`text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  {enrichedDrive.package}
                </p>
              </div>
            </div>

            <div className={`p-4 rounded-xl border flex items-center gap-3 ${darkMode ? 'border-[#3D3D3D] bg-[#1A1A1A]' : 'border-gray-100 bg-gray-50/50'}`}>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${darkMode ? 'bg-[#ff6d34]/20 text-[#ff6d34]' : 'bg-orange-100 text-[#ff7a00]'}`}>
                <MapPin size={20} />
              </div>
              <div>
                <p className={`text-[10px] font-bold uppercase tracking-wider ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  Job Location
                </p>
                <p className={`text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  {enrichedDrive.location}
                </p>
              </div>
            </div>

            <div className={`p-4 rounded-xl border flex items-center gap-3 ${darkMode ? 'border-[#3D3D3D] bg-[#1A1A1A]' : 'border-gray-100 bg-gray-50/50'}`}>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${darkMode ? 'bg-[#ff6d34]/20 text-[#ff6d34]' : 'bg-orange-100 text-[#ff7a00]'}`}>
                <Briefcase size={20} />
              </div>
              <div>
                <p className={`text-[10px] font-bold uppercase tracking-wider ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  Role Type
                </p>
                <p className={`text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  Full-Time Employment
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Split Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Col (2/3 width): Details & Eligibility */}
            <div className="lg:col-span-2 space-y-6">
              {/* Job Description / Process */}
              <div className="space-y-2">
                <h3 className={`text-sm font-bold flex items-center gap-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  <Layers size={16} className={darkMode ? 'text-[#ff6d34]' : 'text-[#ff7a00]'} />
                  <span>Hiring & Selection Process</span>
                </h3>
                <p className={`text-sm leading-relaxed p-4 rounded-xl border whitespace-pre-line ${darkMode ? 'text-gray-300 bg-[#1A1A1A] border-[#3D3D3D]' : 'text-gray-650 bg-gray-50 border-gray-100'}`}>
                  {enrichedDrive.hiringProcess || "No specific details provided."}
                </p>
              </div>

              {/* Eligibility Criteria */}
              <div className="space-y-3">
                <h3 className={`text-sm font-bold flex items-center gap-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  <Award size={16} className={darkMode ? 'text-[#ff6d34]' : 'text-[#ff7a00]'} />
                  <span>Academic Eligibility & Skills</span>
                </h3>
                <div className={`p-5 border rounded-xl space-y-4 ${darkMode ? 'border-[#3D3D3D] bg-[#1A1A1A]' : 'border-gray-150 bg-white'}`}>
                  <EligibilityCriteria
                    eligibility={enrichedDrive.eligibility}
                    isEditable={false}
                    darkMode={darkMode}
                  />
                </div>
              </div>
            </div>

            {/* Right Col (1/3 width): Timeline & Rounds */}
            <div className={`space-y-6 border-t lg:border-t-0 lg:border-l pt-6 lg:pt-0 lg:pl-6 ${darkMode ? 'border-[#3D3D3D]' : 'border-gray-150'}`}>
              {/* Interview Rounds status */}
              <div className="space-y-3">
                <InterviewRounds
                  rounds={enrichedDrive.rounds}
                  isEditable={false}
                  darkMode={darkMode}
                />
              </div>

              {/* Milestones / Timeline */}
              <div className="space-y-4 pt-2">
                <h3 className={`text-sm font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  Drive Schedule
                </h3>
                <DriveTimeline
                  deadline={enrichedDrive.deadline}
                  driveDate={enrichedDrive.driveDate}
                  rounds={enrichedDrive.rounds}
                  darkMode={darkMode}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`flex items-center justify-end px-6 py-4 border-t shrink-0 rounded-b-2xl ${darkMode ? 'border-[#3D3D3D] bg-[#1A1A1A]' : 'border-gray-150 bg-gray-50/50'}`}>
          <button
            onClick={onClose}
            className={`px-5 py-2.5 text-sm font-semibold border rounded-lg transition-colors ${darkMode ? 'text-gray-300 bg-[#2D2D2D] border-[#3D3D3D] hover:bg-[#1A1A1A]' : 'text-gray-700 bg-white border-gray-200 hover:bg-gray-50'}`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DriveDetails;
