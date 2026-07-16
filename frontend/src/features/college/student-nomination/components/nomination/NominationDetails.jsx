import { useOutletContext } from "react-router-dom";
import { X, CircleUserRound } from "lucide-react";

import StatusBadge from "../common/StatusBadge";
import NominationStatus from "./NominationStatus";

const NominationDetails = ({ student, isOpen, onClose }) => {
  const { darkMode } = useOutletContext();

  if (!student || !isOpen) return null;

  return (
    <div
      className={`flex h-full w-full flex-col overflow-hidden rounded-3xl border transition-all duration-300 ${
        darkMode
          ? "border-slate-700/60 bg-[#151D30]"
          : "border-slate-200 bg-white"
      }`}
    >
      {/* =========================
            Header
      ========================== */}

      <div
        className={`flex items-center justify-between border-b p-6 ${
          darkMode ? "border-slate-700/60" : "border-slate-200"
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
          onClick={onClose}
          className={`rounded-xl p-2 transition-colors ${
            darkMode ? "hover:bg-slate-800" : "hover:bg-slate-100"
          }`}
        >
          <X size={18} />
        </button>
      </div>

      {/* =========================
            Scrollable Content
      ========================== */}

      <div className="flex-1 overflow-y-auto">
        {/* =========================
              Student Profile
        ========================== */}

        <div className="flex flex-col items-center p-6">
          <CircleUserRound
            size={72}
            strokeWidth={1.8}
            className={darkMode ? "text-slate-300" : "text-slate-600"}
          />

          <h2 className="mt-4 text-xl font-semibold text-center">
            {student.name || student.student}
          </h2>

          <p
            className={`mt-1 text-sm ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            {student.enrollmentNo}
          </p>

          <div className="mt-4">
            <StatusBadge status={student.status} />
          </div>
        </div>
        {/* =========================
              Academic Details
        ========================== */}

        <div className="px-6">
          <h3
            className={`mb-5 text-sm font-semibold uppercase tracking-wider ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Academic Details
          </h3>

          <div
            className={`space-y-4 rounded-2xl border p-5 ${
              darkMode
                ? "border-slate-700/60 bg-slate-800/20"
                : "border-slate-200 bg-slate-50"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Department</span>

              <span className="font-medium text-right">
                {student.department}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500">Company</span>

              <span className="font-medium text-right">{student.company}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500">Role</span>

              <span className="font-medium text-right">
                {student.role || "--"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500">Package</span>

              <span className="font-medium text-right">
                {student.package || "--"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500">CGPA</span>

              <span className="font-medium">{student.cgpa}</span>
            </div>
          </div>
        </div>

        {/* =========================
              Personal Details
        ========================== */}

        <div className="mt-8 px-6">
          <h3
            className={`mb-5 text-sm font-semibold uppercase tracking-wider ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Personal Details
          </h3>

          <div
            className={`space-y-4 rounded-2xl border p-5 ${
              darkMode
                ? "border-slate-700/60 bg-slate-800/20"
                : "border-slate-200 bg-slate-50"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Email</span>

              <span className="max-w-[220px] text-right font-medium break-all">
                {student.email || "--"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500">Phone</span>

              <span className="font-medium">{student.phone || "--"}</span>
            </div>

            <div className="flex items-start justify-between gap-4">
              <span className="text-slate-500">Address</span>

              <span className="max-w-[220px] text-right font-medium">
                {student.address || "--"}
              </span>
            </div>
          </div>
        </div>
        {/* =========================
              Nomination Timeline
        ========================== */}

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
