import React from "react";
import { User, Users, Check } from "lucide-react";

export default function ProjectTypeSelector({ register, errors, watch, setValue }) {
  const projectType = watch("projectType");
  const allowInvitations = watch("allowStudentInvitations");
  const mentorApproval = watch("mentorApprovalRequired");

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
          <Users className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">Project Type</h3>
          <p className="text-xs text-gray-500">Define if the project is solved individually or in collaborative teams.</p>
        </div>
      </div>

      {/* Segmented Control */}
      <div className="grid grid-cols-2 gap-4 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
        <button
          type="button"
          onClick={() => setValue("projectType", "individual")}
          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold text-sm transition-all cursor-pointer ${
            projectType === "individual"
              ? "bg-white text-blue-600 shadow-sm border border-gray-100"
              : "text-gray-500 hover:text-gray-900 bg-transparent border border-transparent"
          }`}
        >
          <User className="w-4 h-4" />
          Individual Project
        </button>
        <button
          type="button"
          onClick={() => setValue("projectType", "team")}
          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold text-sm transition-all cursor-pointer ${
            projectType === "team"
              ? "bg-white text-blue-600 shadow-sm border border-gray-100"
              : "text-gray-500 hover:text-gray-900 bg-transparent border border-transparent"
          }`}
        >
          <Users className="w-4 h-4" />
          Team Project
        </button>
      </div>

      {/* Team Details (Conditional) */}
      {projectType === "team" && (
        <div className="space-y-6 pt-4 border-t border-gray-100 animate-in fade-in-50 slide-in-from-top-2 duration-200">
          {/* Min/Max Team Size */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Team Size Limits</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Min Size</label>
                <input
                  type="number"
                  {...register("teamSize.min", { valueAsNumber: true })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border ${
                    errors.teamSize?.min ? "border-red-500" : "border-gray-200"
                  } outline-none focus:border-blue-500 transition-all text-sm`}
                  min={1}
                />
                {errors.teamSize?.min && (
                  <p className="mt-1 text-xs text-red-500 font-medium">{errors.teamSize.min.message}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">Max Size</label>
                <input
                  type="number"
                  {...register("teamSize.max", { valueAsNumber: true })}
                  className={`w-full px-3.5 py-2.5 rounded-xl border ${
                    errors.teamSize?.max || errors.teamSize ? "border-red-500" : "border-gray-200"
                  } outline-none focus:border-blue-500 transition-all text-sm`}
                  min={1}
                />
                {errors.teamSize?.max && (
                  <p className="mt-1 text-xs text-red-500 font-medium">{errors.teamSize.max.message}</p>
                )}
              </div>
            </div>
            {errors.teamSize?.root && (
              <p className="mt-2 text-xs text-red-500 font-medium">{errors.teamSize.root.message}</p>
            )}
            {/* Custom refining errors from Zod display in max path */}
            {!errors.teamSize?.max && errors.teamSize?.message && (
              <p className="mt-2 text-xs text-red-500 font-medium">{errors.teamSize.message}</p>
            )}
          </div>

          {/* Invitation Policy */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-150">
            <div>
              <h5 className="text-sm font-semibold text-gray-800">Student Invitations</h5>
              <p className="text-xs text-gray-500 mt-0.5">
                Allow students to invite peer members to their team.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setValue("allowStudentInvitations", !allowInvitations)}
              className={`w-12 h-6 flex items-center rounded-full p-0.5 transition-colors cursor-pointer outline-none ${
                allowInvitations ? "bg-blue-600 justify-end" : "bg-gray-300 justify-start"
              }`}
            >
              <span className="w-5 h-5 bg-white rounded-full shadow-md transform transition-transform" />
            </button>
          </div>

          {/* Mentor Approval */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-150">
            <div>
              <h5 className="text-sm font-semibold text-gray-800">Mentor Approval</h5>
              <p className="text-xs text-gray-500 mt-0.5">
                Require mentor verification for custom team structures.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setValue("mentorApprovalRequired", !mentorApproval)}
              className={`w-12 h-6 flex items-center rounded-full p-0.5 transition-colors cursor-pointer outline-none ${
                mentorApproval ? "bg-blue-600 justify-end" : "bg-gray-300 justify-start"
              }`}
            >
              <span className="w-5 h-5 bg-white rounded-full shadow-md transform transition-transform" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
