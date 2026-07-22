import { validateRecording } from "../../validations/liveSessionValidation";

export default function DownloadRecording({ session, onDownload, isDownloading }) {
  const { valid } = validateRecording(session);

  return (
    <button
      onClick={() => onDownload?.(session.id)}
      disabled={!valid || isDownloading}
      title={!valid ? "Recording not available" : "Download recording"}
      className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isDownloading ? "…" : "⬇️"}
    </button>
  );
}
