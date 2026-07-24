/**
 * Shows a quick participation summary for one session — how long the
 * student stayed relative to total duration. Uses whatever the backend
 * reports; falls back gracefully when data isn't available yet.
 */
export default function SessionParticipation({ session }) {
  const hasData = session?.attendance && session.attendance !== "Pending";

  if (!hasData) {
    return (
      <p className="text-xs text-slate-400">Participation data will appear after the session.</p>
    );
  }

  return (
    <div className="flex items-center gap-2 text-xs text-slate-500">
      <span className="font-medium text-slate-700">Participation:</span>
      <span>{session.attendance}</span>
      {session.duration && <span>· Session length {session.duration}</span>}
    </div>
  );
}
