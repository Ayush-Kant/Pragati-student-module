import React, { useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import EligibilityCriteria from "../eligibility/EligibilityCriteria";
import InterviewRounds from "../rounds/InterviewRounds";
import {
  validatePlacementDrive,
  validateEligibility,
} from "../../validations/placementDriveValidation";
import {
  COMPANY_OPTIONS,
  JOB_LOCATIONS,
  DRIVE_STATUS,
} from "../../constants/placementDriveConstants";

const PlacementDriveForm = ({ isOpen, onClose, onSubmit, initialData, darkMode }) => {
  const defaultState = {
    company: "",
    role: "",
    package: "",
    driveDate: "",
    deadline: "",
    status: "Upcoming",
    location: "Bangalore",
    hiringProcess: "",
    eligibility: {
      department: [],
      course: [],
      batch: [],
      cgpa: 6.0,
      skills: "",
    },
    rounds: [],
  };

  const [formData, setFormData] = useState(
    initialData
      ? {
          ...defaultState,
          ...initialData,
          eligibility: {
            ...defaultState.eligibility,
            ...(initialData.eligibility || {}),
          },
          rounds: initialData.rounds || [],
        }
      : defaultState
  );

  const [activeTab, setActiveTab] = useState("details"); // details, eligibility, rounds
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleEligibilityChange = (newEligibility) => {
    setFormData((prev) => ({
      ...prev,
      eligibility: newEligibility,
    }));
    // Clear eligibility errors
    const elKeys = ["department", "course", "batch", "cgpa"];
    const clearedErrors = { ...errors };
    elKeys.forEach((k) => {
      delete clearedErrors[k];
    });
    setErrors(clearedErrors);
  };

  const handleRoundsChange = (newRounds) => {
    setFormData((prev) => ({
      ...prev,
      rounds: newRounds,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate Job Details
    const jobErrors = validatePlacementDrive(formData);
    // Validate Eligibility
    const eligibilityErrors = validateEligibility(formData.eligibility);

    const allErrors = {
      ...jobErrors,
      ...eligibilityErrors,
    };

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      // Auto switch tabs based on where the error is
      if (Object.keys(jobErrors).length > 0) {
        setActiveTab("details");
      } else if (Object.keys(eligibilityErrors).length > 0) {
        setActiveTab("eligibility");
      }
      toast.error("Please correct the errors in the form before submitting.");
      return;
    }

    onSubmit({
      ...formData,
      id: initialData?.id || Date.now(),
    });
    toast.success(
      initialData
        ? "Placement drive updated successfully!"
        : "Placement drive created successfully!"
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className={`rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200 ${darkMode ? 'bg-[#2D2D2D]' : 'bg-white'}`}>
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${darkMode ? 'border-[#3D3D3D]' : 'border-gray-150'}`}>
          <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {initialData ? "Edit Placement Drive" : "Create Placement Drive"}
          </h2>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${darkMode ? 'text-gray-400 hover:text-gray-300 hover:bg-[#1A1A1A]' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs navigation */}
        <div className={`flex border-b px-6 shrink-0 ${darkMode ? 'border-[#3D3D3D] bg-[#1A1A1A]' : 'border-gray-150 bg-gray-50/50'}`}>
          <button
            type="button"
            onClick={() => setActiveTab("details")}
            className={`py-3 px-4 text-sm font-semibold border-b-2 transition-all ${
              activeTab === "details"
                ? darkMode ? "border-[#ff6d34] text-[#ff6d34]" : "border-[#ff7a00] text-[#ff7a00]"
                : darkMode ? "border-transparent text-gray-400 hover:text-gray-300" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Drive & Job Details
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("eligibility")}
            className={`py-3 px-4 text-sm font-semibold border-b-2 transition-all ${
              activeTab === "eligibility"
                ? darkMode ? "border-[#ff6d34] text-[#ff6d34]" : "border-[#ff7a00] text-[#ff7a00]"
                : darkMode ? "border-transparent text-gray-400 hover:text-gray-300" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Eligibility Criteria
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("rounds")}
            className={`py-3 px-4 text-sm font-semibold border-b-2 transition-all ${
              activeTab === "rounds"
                ? darkMode ? "border-[#ff6d34] text-[#ff6d34]" : "border-[#ff7a00] text-[#ff7a00]"
                : darkMode ? "border-transparent text-gray-400 hover:text-gray-300" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Hiring Process & Rounds
          </button>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === "details" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Company Name */}
                <div className="space-y-2">
                  <label className={`block text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.company}
                    onChange={(e) => handleChange("company", e.target.value)}
                    className={`w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition focus:ring-2 ${
                      errors.company
                        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                        : darkMode
                          ? "border-[#3D3D3D] bg-[#1A1A1A] text-white focus:border-[#ff6d34] focus:ring-[#ff6d34]/20"
                          : "border-gray-300 bg-white focus:border-[#ff7a00] focus:ring-[#ff7a00]/20"
                    }`}
                  >
                    <option value="">-- Select Company --</option>
                    {COMPANY_OPTIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  {errors.company && (
                    <p className="text-xs text-red-500">{errors.company}</p>
                  )}
                </div>

                {/* Job Role */}
                <div className="space-y-2">
                  <label className={`block text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Job Role <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => handleChange("role", e.target.value)}
                    placeholder="e.g. Associate Software Engineer"
                    className={`w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition focus:ring-2 ${
                      errors.role
                        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                        : darkMode
                          ? "border-[#3D3D3D] bg-[#1A1A1A] text-white placeholder-gray-500 focus:border-[#ff6d34] focus:ring-[#ff6d34]/20"
                          : "border-gray-300 bg-white focus:border-[#ff7a00] focus:ring-[#ff7a00]/20"
                    }`}
                  />
                  {errors.role && (
                    <p className="text-xs text-red-500">{errors.role}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Package Offered */}
                <div className="space-y-2">
                  <label className={`block text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Package Offered <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.package}
                    onChange={(e) => handleChange("package", e.target.value)}
                    placeholder="e.g. 12 LPA"
                    className={`w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition focus:ring-2 ${
                      errors.package
                        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                        : darkMode
                          ? "border-[#3D3D3D] bg-[#1A1A1A] text-white placeholder-gray-500 focus:border-[#ff6d34] focus:ring-[#ff6d34]/20"
                          : "border-gray-300 bg-white focus:border-[#ff7a00] focus:ring-[#ff7a00]/20"
                    }`}
                  />
                  {errors.package && (
                    <p className="text-xs text-red-500">{errors.package}</p>
                  )}
                </div>

                {/* Job Location */}
                <div className="space-y-2">
                  <label className={`block text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Job Location <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                    className={`w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition focus:ring-2 ${
                      darkMode
                        ? "border-[#3D3D3D] bg-[#1A1A1A] text-white focus:border-[#ff6d34] focus:ring-[#ff6d34]/20"
                        : "border-gray-300 bg-white focus:border-[#ff7a00] focus:ring-[#ff7a00]/20"
                    }`}
                  >
                    {JOB_LOCATIONS.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Drive Date */}
                <div className="space-y-2">
                  <label className={`block text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Drive Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.driveDate}
                    onChange={(e) => handleChange("driveDate", e.target.value)}
                    className={`w-full rounded-lg border px-4 py-2 text-sm outline-none transition focus:ring-2 ${
                      errors.driveDate
                        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                        : darkMode
                          ? "border-[#3D3D3D] bg-[#1A1A1A] text-white focus:border-[#ff6d34] focus:ring-[#ff6d34]/20"
                          : "border-gray-300 bg-white focus:border-[#ff7a00] focus:ring-[#ff7a00]/20"
                    }`}
                  />
                  {errors.driveDate && (
                    <p className="text-xs text-red-500">{errors.driveDate}</p>
                  )}
                </div>

                {/* Registration Deadline */}
                <div className="space-y-2">
                  <label className={`block text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Registration Deadline <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => handleChange("deadline", e.target.value)}
                    className={`w-full rounded-lg border px-4 py-2 text-sm outline-none transition focus:ring-2 ${
                      errors.deadline
                        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                        : darkMode
                          ? "border-[#3D3D3D] bg-[#1A1A1A] text-white focus:border-[#ff6d34] focus:ring-[#ff6d34]/20"
                          : "border-gray-300 bg-white focus:border-[#ff7a00] focus:ring-[#ff7a00]/20"
                    }`}
                  />
                  {errors.deadline && (
                    <p className="text-xs text-red-500">{errors.deadline}</p>
                  )}
                </div>

                {/* Drive Status */}
                <div className="space-y-2">
                  <label className={`block text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleChange("status", e.target.value)}
                    className={`w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition focus:ring-2 ${
                      darkMode
                        ? "border-[#3D3D3D] bg-[#1A1A1A] text-white focus:border-[#ff6d34] focus:ring-[#ff6d34]/20"
                        : "border-gray-300 bg-white focus:border-[#ff7a00] focus:ring-[#ff7a00]/20"
                    }`}
                  >
                    {DRIVE_STATUS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Hiring Process / Description */}
              <div className="space-y-2">
                <label className={`block text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Hiring Process Description
                </label>
                <textarea
                  rows="3"
                  value={formData.hiringProcess}
                  onChange={(e) => handleChange("hiringProcess", e.target.value)}
                  placeholder="e.g. 1. Online Aptitude Test, 2. Technical Interview, 3. HR Round"
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition focus:ring-2 resize-none ${
                    darkMode
                      ? "border-[#3D3D3D] bg-[#1A1A1A] text-white placeholder-gray-500 focus:border-[#ff6d34] focus:ring-[#ff6d34]/20"
                      : "border-gray-300 bg-white focus:border-[#ff7a00] focus:ring-[#ff7a00]/20"
                  }`}
                />
              </div>
            </div>
          )}

          {activeTab === "eligibility" && (
            <EligibilityCriteria
              eligibility={formData.eligibility}
              onChange={handleEligibilityChange}
              isEditable={true}
              errors={errors}
              darkMode={darkMode}
            />
          )}

          {activeTab === "rounds" && (
            <InterviewRounds
              rounds={formData.rounds}
              onChange={handleRoundsChange}
              isEditable={true}
              darkMode={darkMode}
            />
          )}
        </div>

        {/* Footer */}
        <div className={`flex items-center justify-end gap-3 px-6 py-4 border-t shrink-0 rounded-b-2xl ${darkMode ? 'border-[#3D3D3D] bg-[#1A1A1A]' : 'border-gray-150 bg-gray-50/50'}`}>
          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-2 text-sm font-semibold border rounded-lg transition-colors ${darkMode ? 'text-gray-300 border-[#3D3D3D] hover:bg-[#1A1A1A]' : 'text-gray-600 border-gray-200 hover:bg-gray-50'}`}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2 text-sm font-semibold text-white bg-[#ff7a00] rounded-lg hover:bg-[#e06b00] transition-colors shadow-sm"
          >
            {initialData ? "Save Changes" : "Create Drive"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlacementDriveForm;
