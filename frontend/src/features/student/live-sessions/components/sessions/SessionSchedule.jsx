import { formatDate } from "../../utils/liveSessionHelpers";

/**
 * Compact agenda/timeline view of sessions ordered by date — useful as a
 * "view session schedule" list separate from the card grid.
 */
export default function SessionSchedule({ sessions, onSelect }) {
  if (!sessions?.length) return null;

  return (
    <ol className="relative space-y-4 border-l border-slate-200 pl-5">
      {sessions.map((session) => (
        <li key={session.id} className="relative">
          <span className="absolute -left-[27px] top-1.5 h-2.5 w-2.5 rounded-full bg-indigo-500 ring-4 ring-indigo-100" />
          <button
            onClick={() => onSelect?.(session)}
            className="w-full rounded-lg px-2 py-1 text-left transition hover:bg-slate-50"
          >
            <p className="text-xs font-medium text-indigo-600">
              {formatDate(session.date)} · {session.time}
            </p>
            <p className="text-sm font-semibold text-slate-800">{session.title}</p>
            <p className="text-xs text-slate-500">{session.trainer}</p>
          </button>
        </li>
      ))}
    </ol>
  );
}
