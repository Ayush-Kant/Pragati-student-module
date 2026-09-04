// JoinSessionButton.jsx
// Joins through the backend so attendance and Daily.co participant tokens are
// created before opening the meeting room.

import { useState } from "react";
import { joinSession } from "../services/liveSessionsService";
import { canJoinSession } from "../utils/liveSessionsHelpers";

const JoinSessionButton = ({ session }) => {
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");

  if (!session || session.status === "Completed") return null;

  const joinable = canJoinSession(session);

  const handleJoin = async () => {
    if (!joinable || joining) return;

    setError("");
    setJoining(true);

    // Open the tab synchronously to avoid popup blockers. The final meeting
    // URL is returned by the backend after the participant is registered.
    const meetingWindow = window.open("about:blank", "_blank", "noopener,noreferrer");

    try {
      const result = await joinSession(session.id);
      const meetingUrl = result?.meetingUrl || result?.data?.meetingUrl || session.meetingLink || "";

      if (!meetingUrl) {
        throw new Error("The meeting link is not available yet. Please try again shortly.");
      }

      if (meetingWindow && !meetingWindow.closed) {
        meetingWindow.location.href = meetingUrl;
      } else {
        window.location.href = meetingUrl;
      }
    } catch (joinError) {
      if (meetingWindow && !meetingWindow.closed) meetingWindow.close();
      setError(joinError?.response?.data?.message || joinError?.message || "Unable to join this session");
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={handleJoin}
        disabled={!joinable || joining}
        className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
          joinable && !joining
            ? "bg-red-600 text-white hover:bg-red-700 cursor-pointer"
            : "bg-gray-100 text-gray-400 cursor-not-allowed"
        }`}
        aria-disabled={!joinable || joining}
      >
        {joining ? "Joining..." : session.status === "Live" ? "🔴 Join Now" : "Join Session"}
      </button>
      {error && <p className="max-w-xs text-xs text-red-500" role="alert">{error}</p>}
    </div>
  );
};

export default JoinSessionButton;
