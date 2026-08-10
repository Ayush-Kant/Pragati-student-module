// JoinSessionButton.jsx
// CTA button that opens the meeting link once the join window is open

import { canJoinSession } from "../utils/liveSessionsHelpers";

const JoinSessionButton = ({ session }) => {
  const joinable = canJoinSession(session);
  const isCompleted = session.status === "Completed";

  if (isCompleted) return null;

  return (
    <a
      href={joinable ? session.meetingLink : undefined}
      target="_blank"
      rel="noopener noreferrer"
      aria-disabled={!joinable}
      onClick={(e) => {
        if (!joinable) e.preventDefault();
      }}
      className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
        joinable
          ? "bg-red-600 text-white hover:bg-red-700 cursor-pointer"
          : "bg-gray-100 text-gray-400 cursor-not-allowed"
      }`}
    >
      {session.status === "Live" ? "🔴 Join Now" : "Join Session"}
    </a>
  );
};

export default JoinSessionButton;
