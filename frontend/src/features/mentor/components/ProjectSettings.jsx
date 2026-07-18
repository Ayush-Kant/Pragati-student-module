import React from "react";
import { Settings, Calendar, RefreshCw } from "lucide-react";

export default function ProjectSettings({ register, errors, watch, setValue }) {
  const allowLate = watch("allowLateSubmission");
  const aiReview = watch("aiReview");
  const allowResub = watch("allowResubmission");
  const certEligible = watch("certificateEligible");
  const publicBoard = watch("publicLeaderboard");

  const todayStr = new Date().toISOString().split("T")[0];

  const ToggleSwitch = ({ checked, onChange, label, description }) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-250 transition-colors">
      <div>
        <h4 className="text-sm font-semibold text-gray-800">{label}</h4>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
      <button
        type="button"
        onClick={onChange}
        className={`w-12 h-6 flex items-center rounded-full p-0.5 transition-colors cursor-pointer outline-none ${
          checked ? "bg-blue-600 justify-end" : "bg-gray-300 justify-start"
        }`}
      >
        <span className="w-5 h-5 bg-white rounded-full shadow-md transform transition-transform" />
      </button>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
          <Settings className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">Project Settings</h3>
          <p className="text-xs text-gray-500">Configure submissions, deadlines, grading options, and rewards.</p>
        </div>
      </div>

      {/* Row: Deadline and Max Attempts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
        {/* Deadline */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Submission Deadline <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
              <Calendar className="w-4 h-4" />
            </span>
            <input
              type="date"
              {...register("submissionDeadline")}
              min={todayStr}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                errors.submissionDeadline ? "border-red-500" : "border-gray-200"
              } outline-none focus:border-blue-500 transition-all text-sm`}
            />
          </div>
          {errors.submissionDeadline && (
            <p className="mt-1 text-xs text-red-500 font-medium">{errors.submissionDeadline.message}</p>
          )}
        </div>

        {/* Max Attempts */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Maximum Attempts <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
              <RefreshCw className="w-4 h-4" />
            </span>
            <input
              type="number"
              {...register("maxAttempts", { valueAsNumber: true })}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                errors.maxAttempts ? "border-red-500" : "border-gray-200"
              } outline-none focus:border-blue-500 transition-all text-sm`}
              min={1}
            />
          </div>
          {errors.maxAttempts && (
            <p className="mt-1 text-xs text-red-500 font-medium">{errors.maxAttempts.message}</p>
          )}
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 gap-4">
        <ToggleSwitch
          label="Allow Late Submission"
          description="Let students submit deliverables past the deadline with penalty tags."
          checked={allowLate}
          onChange={() => setValue("allowLateSubmission", !allowLate)}
        />
        
        <ToggleSwitch
          label="AI Assessment Review"
          description="Enable instant AI analysis and grading on matching deliverables criteria."
          checked={aiReview}
          onChange={() => setValue("aiReview", !aiReview)}
        />

        <ToggleSwitch
          label="Allow Resubmission"
          description="Allow students to resubmit their work if attempts count is available."
          checked={allowResub}
          onChange={() => setValue("allowResubmission", !allowResub)}
        />

        <ToggleSwitch
          label="Certificate Eligibility"
          description="Award a certificate to students passing with a score above 70%."
          checked={certEligible}
          onChange={() => setValue("certificateEligible", !certEligible)}
        />

        <ToggleSwitch
          label="Public Leaderboard"
          description="Publish scoring leaderboard to motivate competition and peer comparison."
          checked={publicBoard}
          onChange={() => setValue("publicLeaderboard", !publicBoard)}
        />
      </div>
    </div>
  );
}
