import { FileText, ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';

const parseVtt = (text) => {
  const blocks = String(text || '')
    .replace(/\r/g, '')
    .split(/\n\n+/)
    .map((block) => block.trim())
    .filter(Boolean);

  return blocks.flatMap((block, index) => {
    const lines = block.split('\n');
    const timingIndex = lines.findIndex((line) => line.includes('-->'));
    if (timingIndex === -1) return [];

    const [startRaw] = lines[timingIndex].split('-->');
    const start = vttTimeToSeconds(startRaw.trim());
    const textLines = lines.slice(timingIndex + 1).filter((line) => line.trim());
    return textLines.length ? [{ id: index, start, text: textLines.join(' ') }] : [];
  });
};

const vttTimeToSeconds = (value) => {
  const parts = value.replace(',', '.').split(':').map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return Number(parts[0]) || 0;
};

export default function TranscriptViewer({ transcriptUrl, currentTime = 0, onSeek }) {
  const [cues, setCues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    if (!transcriptUrl) {
      setCues([]);
      setError('');
      return () => {
        active = false;
      };
    }

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(transcriptUrl);
        if (!response.ok) throw new Error(`Transcript request failed (${response.status})`);
        const text = await response.text();
        if (active) setCues(parseVtt(text));
      } catch (err) {
        if (active) setError(err?.message || 'Unable to load transcript.');
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [transcriptUrl]);

  if (!transcriptUrl) return null;

  const activeCueIndex = cues.reduce((match, cue, index) => {
    if (Number(currentTime) >= cue.start) return index;
    return match;
  }, -1);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <FileText size={17} className="text-blue-600" />
          <h3 className="text-sm font-semibold text-slate-900">Transcript</h3>
        </div>
        <a
          href={transcriptUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
        >
          Open VTT <ExternalLink size={12} />
        </a>
      </div>

      {loading && <p className="text-sm text-slate-500">Loading transcript...</p>}
      {!loading && error && <p className="text-sm text-amber-700">{error}</p>}
      {!loading && !error && cues.length === 0 && <p className="text-sm text-slate-500">No transcript cues are available.</p>}

      {!loading && !error && cues.length > 0 && (
        <div className="max-h-64 space-y-1 overflow-y-auto pr-1">
          {cues.map((cue, index) => (
            <button
              key={cue.id}
              type="button"
              onClick={() => onSeek?.(cue.start)}
              className={`block w-full rounded-lg px-3 py-2 text-left text-sm leading-6 transition ${index === activeCueIndex ? 'bg-blue-50 text-blue-800' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <span className="mr-2 text-[11px] font-semibold tabular-nums text-slate-400">
                {Math.floor(cue.start / 60)}:{String(Math.floor(cue.start % 60)).padStart(2, '0')}
              </span>
              {cue.text}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
