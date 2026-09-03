import { ListVideo } from 'lucide-react';

const formatTime = (seconds) => {
  const value = Math.max(0, Number(seconds) || 0);
  const minutes = Math.floor(value / 60);
  const remaining = Math.floor(value % 60).toString().padStart(2, '0');
  return `${minutes}:${remaining}`;
};

export default function ChapterMarkers({ markers = [], currentTime = 0, onSeek }) {
  if (!markers.length) return null;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-center gap-2">
        <ListVideo size={17} className="text-blue-600" />
        <h3 className="text-sm font-semibold text-slate-900">Chapters</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {markers.map((marker, index) => {
          const timestamp = Number(marker?.timestamp ?? marker?.time ?? 0);
          const active = Math.abs(timestamp - Number(currentTime || 0)) < 3;
          return (
            <button
              type="button"
              key={`${timestamp}-${index}`}
              onClick={() => onSeek?.(timestamp)}
              className={`rounded-lg border px-3 py-2 text-left text-xs font-medium transition ${active ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700'}`}
            >
              <span className="mr-2 tabular-nums text-slate-400">{formatTime(timestamp)}</span>
              {marker?.label || `Chapter ${index + 1}`}
            </button>
          );
        })}
      </div>
    </section>
  );
}
