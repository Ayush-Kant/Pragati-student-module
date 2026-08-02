import { formatDate } from "../../utils/liveSessionHelpers";
import DownloadRecording from "./DownloadRecording";

export default function RecordingCard({ session, onPlay, onDownload, isDownloading }) {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div>
        <div className="flex h-28 items-center justify-center rounded-lg bg-slate-900/95 text-3xl text-white">
          ▶️
        </div>
        <h3 className="mt-3 text-sm font-semibold text-slate-900">{session.title}</h3>
        <p className="mt-0.5 text-xs text-slate-500">
          {session.trainer} · {formatDate(session.date)}
        </p>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <button
          onClick={() => onPlay?.(session)}
          className="flex-1 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-indigo-700"
        >
          Play Recording
        </button>
        <DownloadRecording
          session={session}
          onDownload={onDownload}
          isDownloading={isDownloading}
        />
      </div>
    </div>
  );
}
