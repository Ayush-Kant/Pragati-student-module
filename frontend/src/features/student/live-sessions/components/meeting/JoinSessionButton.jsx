import { validateJoinRequest } from "../../validations/liveSessionValidation";

export default function JoinSessionButton({ session, onJoin, isJoining, compact = false }) {
  const { valid, errors } = validateJoinRequest(session);
  const disabledReason = !valid ? errors[0] : null;

  const baseClasses = compact
    ? "flex-1 rounded-lg px-3 py-2 text-xs font-medium"
    : "rounded-lg px-4 py-2 text-sm font-medium";

  if (!valid) {
    return (
      <button
        disabled
        title={disabledReason}
        className={`${baseClasses} cursor-not-allowed bg-slate-100 text-slate-400`}
      >
        {session.status === "Completed" ? "Ended" : "Unavailable"}
      </button>
    );
  }

  return (
    <button
      onClick={() => onJoin?.(session.id)}
      disabled={isJoining}
      className={`${baseClasses} bg-indigo-600 text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60`}
    >
      {isJoining ? "Joining…" : session.status === "Ongoing" ? "Join Now" : "Join Session"}
    </button>
  );
}
