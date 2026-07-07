import React from "react";
import { X, Briefcase, DollarSign, MapPin, Layers, Award } from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import EligibilityCriteria from "../eligibility/EligibilityCriteria";
import InterviewRounds from "../rounds/InterviewRounds";
import DriveTimeline from "./DriveTimeline";

const DriveDetails = ({ isOpen, onClose, drive }) => {
  if (!isOpen || !drive) return null;

  // Fallback defaults for missing details
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-150 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#ff7a00] font-extrabold text-lg flex items-center justify-center border border-orange-100 shrink-0">
              {enrichedDrive.company?.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-tight">
                {enrichedDrive.company}
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                {enrichedDrive.role}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={enrichedDrive.status} />
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Section 1: Overview Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-100 text-[#ff7a00] flex items-center justify-center shrink-0">
                <DollarSign size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Package Offered
                </p>
                <p className="text-sm font-semibold text-gray-800">
                  {enrichedDrive.package}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-100 text-[#ff7a00] flex items-center justify-center shrink-0">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Job Location
                </p>
                <p className="text-sm font-semibold text-gray-800">
                  {enrichedDrive.location}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-100 text-[#ff7a00] flex items-center justify-center shrink-0">
                <Briefcase size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Role Type
                </p>
                <p className="text-sm font-semibold text-gray-800">
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
                <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <Layers size={16} className="text-[#ff7a00]" />
                  <span>Hiring & Selection Process</span>
                </h3>
                <p className="text-sm text-gray-650 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100 whitespace-pre-line">
                  {enrichedDrive.hiringProcess || "No specific details provided."}
                </p>
              </div>

              {/* Eligibility Criteria */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <Award size={16} className="text-[#ff7a00]" />
                  <span>Academic Eligibility & Skills</span>
                </h3>
                <div className="p-5 border border-gray-150 rounded-xl bg-white space-y-4">
                  <EligibilityCriteria
                    eligibility={enrichedDrive.eligibility}
                    isEditable={false}
                  />
                </div>
              </div>
            </div>

            {/* Right Col (1/3 width): Timeline & Rounds */}
            <div className="space-y-6 border-t lg:border-t-0 lg:border-l border-gray-150 pt-6 lg:pt-0 lg:pl-6">
              {/* Interview Rounds status */}
              <div className="space-y-3">
                <InterviewRounds
                  rounds={enrichedDrive.rounds}
                  isEditable={false}
                />
              </div>

              {/* Milestones / Timeline */}
              <div className="space-y-4 pt-2">
                <h3 className="text-sm font-bold text-gray-800">
                  Drive Schedule
                </h3>
                <DriveTimeline
                  deadline={enrichedDrive.deadline}
                  driveDate={enrichedDrive.driveDate}
                  rounds={enrichedDrive.rounds}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-gray-150 shrink-0 bg-gray-50/50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DriveDetails;
