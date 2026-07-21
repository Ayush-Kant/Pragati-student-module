/**
 * Renders the live video session. Wraps Daily.co's prebuilt iframe UI.
 * During integration, `session.meetingLink` should be a valid Daily.co room URL.
 */
export default function VideoPlayer({ session, onLeave }) {
  if (!session?.meetingLink) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-xl bg-slate-900 text-sm text-slate-400">
        No meeting link available for this session.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
      <div className="flex items-center justify-between px-4 py-2 text-xs text-slate-300">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" /> LIVE · {session.title}
        </span>
        <button
          onClick={onLeave}
          className="rounded-md bg-slate-800 px-2.5 py-1 font-medium text-slate-200 transition hover:bg-slate-700"
        >
          Leave
        </button>
      </div>
      <iframe
        title={`${session.title} — live session`}
        src={session.meetingLink}
        allow="camera; microphone; fullscreen; display-capture; autoplay"
        className="aspect-video w-full border-0"
      />
    </div>
  );
}
