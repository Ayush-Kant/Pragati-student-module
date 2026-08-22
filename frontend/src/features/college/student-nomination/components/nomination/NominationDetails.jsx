import { useOutletContext } from "react-router-dom";
import { X, CircleUserRound } from "lucide-react";

import StatusBadge from "../common/StatusBadge";
import NominationStatus from "./NominationStatus";
import { formatPackage, getStudentName } from "../../utils/studentNominationHelpers";

const NominationDetails = ({ student, isOpen, onClose }) => {
  // Safe outlet context destructuring
  const { darkMode = false } = useOutletContext() || {};

  if (!student || !isOpen) return null;

  // Property normalization fallbacks
  const enrollmentNo = student.enrollmentNo || student.enrollment_no || "--";
  const department = student.department || student.dept || "--";
  const company = student.company || student.company_name || "--";
  const role = student.role || student.job_role || "--";
  const rawPackage = student.package || student.package_amount || student.ctc;
  const cgpa = student.cgpa ?? "--";
  const email = student.email || student.email_id || "--";
  const phone = student.phone || student.phone_number || student.mobile || "--";
  const address = student.address || student.location || "--";

  const labelClass = darkMode ? "text-slate-400" : "text-slate-500";
  const cardBgClass = darkMode
    ? "border-[#3D3D3D] bg-[#1A1A1A]"
    : "border-slate-200 bg-slate-50";

  return (
    <div
      className={`flex h-full w-full flex-col overflow-hidden rounded-3xl border transition-all duration-300 ${
        darkMode
          ? "border-[#3D3D3D] bg-[#2D2D2D]"
          : "border-slate-200 bg-white"
      }`}
    >
      {/* Header */}
      <div
        className={`flex items-center justify-between border-b p-6 ${
          darkMode ? "border-[#3D3D3D]" : "border-slate-200"
        }`}
      >
        <div>
          <h2 className="text-xl font-bold">Student Details</h2>

          <p
            className={`mt-1 text-sm ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            View complete nomination information.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close details drawer"
          className={`rounded-xl p-2 transition-colors ${
            darkMode ? "hover:bg-[#1A1A1A]" : "hover:bg-slate-100"
          }`}
        >
          <X size={18} />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Student Profile */}
        <div className="flex flex-col items-center p-6">
          <CircleUserRound
            size={72}
            strokeWidth={1.8}
            className={darkMode ? "text-slate-300" : "text-slate-600"}
          />

          <h2 className="mt-4 text-xl font-semibold text-center">
            {getStudentName(student)}
          </h2>

          <p
            className={`mt-1 text-sm ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            {enrollmentNo}
          </p>

          <div className="mt-4">
            <StatusBadge status={student.status} />
          </div>
        </div>

        {/* Academic Details */}
        <div className="px-6">
          <h3
            className={`mb-5 text-sm font-semibold uppercase tracking-wider ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Academic Details
          </h3>

          <div className={`space-y-4 rounded-2xl border p-5 ${cardBgClass}`}>
            <div className="flex items-center justify-between">
              <span className={labelClass}>Department</span>
              <span className="font-medium text-right">{department}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className={labelClass}>Company</span>
              <span className="font-medium text-right">{company}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className={labelClass}>Role</span>
              <span className="font-medium text-right">{role}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className={labelClass}>Package</span>
              <span className="font-medium text-right">
                {rawPackage ? formatPackage(rawPackage) : "--"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className={labelClass}>CGPA</span>
              <span className="font-medium">{cgpa}</span>
            </div>
          </div>
        </div>

        {/* Personal Details */}
        <div className="mt-8 px-6">
          <h3
            className={`mb-5 text-sm font-semibold uppercase tracking-wider ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Personal Details
          </h3>

          <div className={`space-y-4 rounded-2xl border p-5 ${cardBgClass}`}>
            <div className="flex items-center justify-between gap-4">
              <span className={labelClass}>Email</span>
              <span className="max-w-[220px] text-right font-medium break-all">
                {email}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className={labelClass}>Phone</span>
              <span className="font-medium">{phone}</span>
            </div>

            <div className="flex items-start justify-between gap-4">
              <span className={labelClass}>Address</span>
              <span className="max-w-[220px] text-right font-medium">
                {address}
              </span>
            </div>
          </div>
        </div>

        {/* Nomination Timeline */}
        <div className="mt-8 mb-6 px-6">
          <NominationStatus
            status={student.status}
            timeline={student.timeline}
          />
        </div>
      </div>
    </div>
  );
};

export default NominationDetails;