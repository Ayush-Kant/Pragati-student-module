import { useState } from "react";

import ResolveDisputeModal from "./ResolveDisputeModal";
import EscalateDisputeModal from "./EscalateDisputeModal";

import {
  reviewDispute,
  resolveDispute,
  escalateDispute,
} from "../services/adminService";

export default function DisputeActionBar({
  dispute,
  refreshDispute,
  darkMode,
}) {
  const [loading, setLoading] = useState(false);

  const [showResolveModal, setShowResolveModal] = useState(false);
  const [showEscalateModal, setShowEscalateModal] = useState(false);

  const handleReview = async () => {
    try {
      setLoading(true);

      // Uncomment when backend is ready
      // await reviewDispute(dispute.id);

      console.log("Marked dispute as In Review");

      if (refreshDispute) {
        refreshDispute();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (resolution) => {
    try {
      setLoading(true);

      // Uncomment when backend is ready
      // await resolveDispute(dispute.id, resolution);

      console.log("Resolution:", resolution);

      setShowResolveModal(false);

      if (refreshDispute) {
        refreshDispute();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEscalate = async (reason) => {
    try {
      setLoading(true);

      // Uncomment when backend is ready
      // await escalateDispute(dispute.id, reason);

      console.log("Escalation Reason:", reason);

      setShowEscalateModal(false);

      if (refreshDispute) {
        refreshDispute();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className={`rounded-lg p-6 ${
          darkMode
            ? "bg-slate-900 border border-slate-700"
            : "bg-white shadow"
        }`}
      >
        <h2 className="text-xl font-semibold mb-5">
          Admin Actions
        </h2>

        <div className="flex flex-wrap gap-4">
          {/* Mark In Review */}

          {dispute.status?.toLowerCase() === "open" && (
            <button
              disabled={loading}
              onClick={handleReview}
              className="px-5 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white disabled:opacity-50"
            >
              {loading ? "Processing..." : "Mark In Review"}
            </button>
          )}

          {/* Resolve */}

          {dispute.status?.toLowerCase() !== "resolved" && (
            <button
              disabled={loading}
              onClick={() => setShowResolveModal(true)}
              className="px-5 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
            >
              Resolve Dispute
            </button>
          )}

          {/* Escalate */}

          <button
            disabled={loading}
            onClick={() => setShowEscalateModal(true)}
            className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
          >
            Escalate
          </button>
        </div>
      </div>

      {/* Resolve Modal */}

      <ResolveDisputeModal
        open={showResolveModal}
        darkMode={darkMode}
        onClose={() => setShowResolveModal(false)}
        onResolve={handleResolve}
      />

      {/* Escalate Modal */}

      <EscalateDisputeModal
        open={showEscalateModal}
        darkMode={darkMode}
        onClose={() => setShowEscalateModal(false)}
        onEscalate={handleEscalate}
      />
    </>
  );
}