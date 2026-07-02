import {
  ArrowLeft,
  CalendarDays,
  User,
  Shield,
} from "lucide-react";

import {
  useNavigate,
  useParams,
  useOutletContext,
} from "react-router-dom";

import useDisputeDetail from "../hooks/useDisputeDetail";

import DisputeTimeline from "../components/DisputeTimeline";
import DisputeEvidenceViewer from "../components/DisputeEvidenceViewer";
import AdminNotesPanel from "../components/AdminNotesPanel";
import DisputeActionBar from "../components/DisputeActionBar";

import DisputeStatusBadge from "../components/DisputeStatusBadge";
import DisputePriorityBadge from "../components/DisputePriorityBadge";
import DisputeTypeBadge from "../components/DisputeTypeBadge";

export default function DisputeDetail() {
  const { id } = useParams();

  const navigate = useNavigate();

  const { darkMode } = useOutletContext();

  const {
    dispute,
    loading,
    error,
    refreshDispute,
  } = useDisputeDetail(id);

  if (loading) {
    return (
      <div
        className={`p-6 ${
          darkMode
            ? "text-white bg-slate-950"
            : "bg-gray-50 text-slate-900"
        }`}
      >
        <div
          className={`rounded-xl p-6 ${
            darkMode
              ? "bg-slate-900 border border-slate-700"
              : "bg-white shadow"
          }`}
        >
          <div className="space-y-6 animate-pulse">

            <div className="h-10 w-72 rounded bg-gray-300"></div>

            <div className="grid md:grid-cols-2 gap-6">

              <div className="h-44 rounded-lg bg-gray-300"></div>

              <div className="h-44 rounded-lg bg-gray-300"></div>

            </div>

            <div className="h-60 rounded-lg bg-gray-300"></div>

          </div>
        </div>
      </div>
    );
  }

  if (error || !dispute) {
    return (
      <div
        className={`p-6 ${
          darkMode
            ? "bg-slate-950 text-white"
            : "bg-gray-50 text-slate-900"
        }`}
      >
        <div
          className={`rounded-xl p-6 border ${
            darkMode
              ? "bg-red-950 border-red-700"
              : "bg-red-50 border-red-200"
          }`}
        >
          <h2 className="text-2xl font-bold text-red-600">
            Failed to load dispute
          </h2>

          <p className="mt-2">
            {error || "Dispute not found"}
          </p>

          <button
            onClick={() =>
              navigate("/admin/disputes")
            }
            className="mt-6 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
          >
            ← Back to Disputes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen p-6 space-y-8 transition-colors ${
        darkMode
          ? "bg-slate-950 text-white"
          : "bg-gray-50 text-slate-900"
      }`}
    >

      {/* Header */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

        <div>

          <button
            onClick={() =>
              navigate("/admin/disputes")
            }
            className={`flex items-center gap-2 mb-5 transition ${
              darkMode
                ? "text-gray-300 hover:text-white"
                : "text-gray-600 hover:text-black"
            }`}
          >
            <ArrowLeft size={18} />
            Back to Disputes
          </button>

          <h1 className="text-4xl font-bold tracking-tight">
            Dispute #{dispute.id}
          </h1>

          <div className="flex items-center gap-2 mt-3 text-gray-500">

            <CalendarDays size={16} />

            <span>
              Filed on{" "}
              {dispute.createdAt
                ? new Date(
                    dispute.createdAt
                  ).toLocaleDateString()
                : "-"}
            </span>

          </div>

        </div>

        <div className="flex flex-wrap gap-3">

          <DisputeStatusBadge
            status={dispute.status}
          />

          <DisputePriorityBadge
            priority={dispute.priority}
          />

          <DisputeTypeBadge
            type={dispute.type}
          />

        </div>

      </div>

      {/* Parties */}

      <div className="grid md:grid-cols-2 gap-6">

        {/* Filed By */}

        <div
          className={`rounded-xl p-6 ${
            darkMode
              ? "bg-slate-900 border border-slate-700"
              : "bg-white shadow-sm"
          }`}
        >

          <div className="flex items-center gap-4 mb-6">

            <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white">

              <User size={24} />

            </div>

            <div>

              <h2 className="text-xl font-semibold">
                Filed By
              </h2>

              <p className="text-sm text-gray-500">
                User who submitted the dispute
              </p>

            </div>

          </div>

          <div className="space-y-4">

            <div>

              <p className="text-sm text-gray-500">
                Name
              </p>

              <p className="font-semibold">
                {dispute.filedBy?.name}
              </p>

            </div>

            <div>

              <p className="text-sm text-gray-500">
                Role
              </p>

              <p className="font-semibold">
                {dispute.filedBy?.role}
              </p>

            </div>

            <div>

              <p className="text-sm text-gray-500">
                Email
              </p>

              <p className="font-semibold break-all">
                {dispute.filedBy?.email}
              </p>

            </div>

          </div>

        </div>

        {/* Against */}

        <div
          className={`rounded-xl p-6 ${
            darkMode
              ? "bg-slate-900 border border-slate-700"
              : "bg-white shadow-sm"
          }`}
        >

          <div className="flex items-center gap-4 mb-6">

            <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center text-white">

              <Shield size={24} />

            </div>

            <div>

              <h2 className="text-xl font-semibold">
                Against
              </h2>

              <p className="text-sm text-gray-500">
                Person or organization involved
              </p>

            </div>

          </div>

          <div className="space-y-4">

            <div>

              <p className="text-sm text-gray-500">
                Name
              </p>

              <p className="font-semibold">
                {dispute.against?.name}
              </p>

            </div>

            <div>

              <p className="text-sm text-gray-500">
                Role
              </p>

              <p className="font-semibold">
                {dispute.against?.role}
              </p>

            </div>

            <div>

              <p className="text-sm text-gray-500">
                Email
              </p>

              <p className="font-semibold break-all">
                {dispute.against?.email}
              </p>

            </div>

          </div>

        </div>

      </div>
            {/* Description */}

      <div
        className={`rounded-xl p-6 ${
          darkMode
            ? "bg-slate-900 border border-slate-700"
            : "bg-white shadow-sm"
        }`}
      >
        <div className="flex items-center justify-between mb-5">

          <h2 className="text-2xl font-semibold">
            Dispute Description
          </h2>

          <DisputeTypeBadge
            type={dispute.type}
          />

        </div>

        <p
          className={`leading-8 ${
            darkMode
              ? "text-gray-300"
              : "text-gray-700"
          }`}
        >
          {dispute.description || "No description available."}
        </p>
      </div>

      {/* Evidence */}

      <div
        className={`rounded-xl p-6 ${
          darkMode
            ? "bg-slate-900 border border-slate-700"
            : "bg-white shadow-sm"
        }`}
      >
        <div className="flex items-center justify-between mb-5">

          <div>

            <h2 className="text-2xl font-semibold">
              Evidence
            </h2>

            <p className="text-gray-500 mt-1">
              Files submitted with this dispute
            </p>

          </div>

          <span
            className={`px-3 py-1 rounded-full text-sm ${
              darkMode
                ? "bg-slate-800"
                : "bg-gray-100"
            }`}
          >
            {dispute.evidence?.length || 0} Files
          </span>

        </div>

        <DisputeEvidenceViewer
          evidence={dispute.evidence || []}
          darkMode={darkMode}
        />

      </div>

      {/* Timeline & Notes */}

      <div className="grid xl:grid-cols-2 gap-6">

        {/* Timeline */}

        <div
          className={`rounded-xl p-6 ${
            darkMode
              ? "bg-slate-900 border border-slate-700"
              : "bg-white shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between mb-5">

            <div>

              <h2 className="text-2xl font-semibold">
                Timeline
              </h2>

              <p className="text-gray-500 mt-1">
                Complete activity history
              </p>

            </div>

            <span
              className={`px-3 py-1 rounded-full text-sm ${
                darkMode
                  ? "bg-slate-800"
                  : "bg-gray-100"
              }`}
            >
              {dispute.timeline?.length || 0} Events
            </span>

          </div>

          <DisputeTimeline
            timeline={dispute.timeline || []}
            darkMode={darkMode}
          />

        </div>

        {/* Notes */}

        <div
          className={`rounded-xl p-6 ${
            darkMode
              ? "bg-slate-900 border border-slate-700"
              : "bg-white shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between mb-5">

            <div>

              <h2 className="text-2xl font-semibold">
                Admin Notes
              </h2>

              <p className="text-gray-500 mt-1">
                Internal discussion and comments
              </p>

            </div>

            <span
              className={`px-3 py-1 rounded-full text-sm ${
                darkMode
                  ? "bg-slate-800"
                  : "bg-gray-100"
              }`}
            >
              {(dispute.notes || dispute.adminNotes || []).length} Notes
            </span>

          </div>

          <AdminNotesPanel
            notes={dispute.notes || dispute.adminNotes || []}
            disputeId={dispute.id}
            refreshDispute={refreshDispute}
            darkMode={darkMode}
          />

        </div>

      </div>
            {/* Resolution */}

      <div
        className={`rounded-xl p-6 ${
          darkMode
            ? "bg-slate-900 border border-slate-700"
            : "bg-white shadow-sm"
        }`}
      >
        <div className="flex items-center justify-between mb-6">

          <div>

            <h2 className="text-2xl font-semibold">
              Resolution
            </h2>

            <p className="text-gray-500 mt-1">
              Final outcome of the dispute
            </p>

          </div>

          <DisputeStatusBadge
            status={dispute.status}
          />

        </div>

        {dispute.resolution ? (
          <div
            className={`rounded-xl border p-5 ${
              darkMode
                ? "border-green-700 bg-green-950"
                : "border-green-200 bg-green-50"
            }`}
          >
            <div className="space-y-4">

              <div>

                <p className="text-sm text-gray-500">
                  Resolution
                </p>

                <p className="mt-1 font-medium leading-7">
                  {dispute.resolution}
                </p>

              </div>

              <div className="grid md:grid-cols-2 gap-5">

                <div>

                  <p className="text-sm text-gray-500">
                    Resolved By
                  </p>

                  <p className="font-semibold">
                    {dispute.resolvedBy || "-"}
                  </p>

                </div>

                <div>

                  <p className="text-sm text-gray-500">
                    Resolved On
                  </p>

                  <p className="font-semibold">
                    {dispute.resolvedAt
                      ? new Date(
                          dispute.resolvedAt
                        ).toLocaleString()
                      : "-"}
                  </p>

                </div>

              </div>

            </div>

          </div>
        ) : (
          <div
            className={`rounded-xl border-l-4 p-5 ${
              darkMode
                ? "bg-yellow-900 border-yellow-500 text-yellow-200"
                : "bg-yellow-50 border-yellow-500 text-yellow-700"
            }`}
          >
            <h3 className="font-semibold text-lg">
              Awaiting Resolution
            </h3>

            <p className="mt-2">
              This dispute has not been resolved yet.
              Use the action buttons below to review,
              resolve or escalate the dispute.
            </p>

          </div>
        )}

      </div>

      {/* Action Bar */}

      <DisputeActionBar
        dispute={dispute}
        refreshDispute={refreshDispute}
        darkMode={darkMode}
      />

      {/* Footer */}

      <div className="flex justify-between items-center pt-2">

        <button
          onClick={() =>
            navigate("/admin/disputes")
          }
          className={`px-6 py-3 rounded-lg transition font-medium ${
            darkMode
              ? "bg-slate-800 hover:bg-slate-700 text-white"
              : "bg-gray-200 hover:bg-gray-300 text-slate-900"
          }`}
        >
          ← Back to Disputes
        </button>

        <div
          className={`text-sm ${
            darkMode
              ? "text-gray-400"
              : "text-gray-500"
          }`}
        >
          Dispute ID :{" "}
          <span className="font-semibold">
            {dispute.id}
          </span>
        </div>

      </div>

    </div>
  );
}