import { formatDate } from "../../utils/liveSessionHelpers";
import JoinSessionButton from "../meeting/JoinSessionButton";
import RecordingPlayer from "../recordings/RecordingPlayer";

export default function SessionDetails({ session, onClose, onJoin, isJoining }) {
  if (!session) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{session.title}</h2>
            <p className="mt-1 text-sm text-slate-500">Hosted by {session.trainer}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close details"
            className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            ✕
          </button>
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-slate-400">Date</dt>
            <dd className="font-medium text-slate-700">{formatDate(session.date)}</dd>
          </div>
          <div>
            <dt className="text-slate-400">Time</dt>
            <dd className="font-medium text-slate-700">{session.time}</dd>
          </div>
          <div>
            <dt className="text-slate-400">Duration</dt>
            <dd className="font-medium text-slate-700">{session.duration}</dd>
          </div>
          <div>
            <dt className="text-slate-400">Status</dt>
            <dd className="font-medium text-slate-700">{session.status}</dd>
          </div>
        </dl>

        {session.agenda && (
          <div className="mt-5">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Agenda
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">{session.agenda}</p>
          </div>
        )}

        {session.status === "Completed" && session.recordingUrl && (
          <div className="mt-5">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Recording
            </h3>
            <RecordingPlayer session={session} />
          </div>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Close
          </button>
          <JoinSessionButton session={session} onJoin={onJoin} isJoining={isJoining} />
        </div>
      </div>
    </div>
  );
}
