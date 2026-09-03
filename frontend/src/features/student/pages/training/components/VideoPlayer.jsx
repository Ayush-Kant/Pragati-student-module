import { useEffect, useRef, useState } from 'react';
import { Pause, Play, Volume2, VolumeX } from 'lucide-react';

const isHls = (url = '') => /\.m3u8(?:$|\?)/i.test(url);

const toEmbedUrl = (url) => {
  if (!url) return '';
  if (url.includes('youtube.com/watch?v=')) return url.replace('watch?v=', 'embed/');
  if (url.includes('youtu.be/')) return `https://www.youtube.com/embed/${url.split('youtu.be/')[1].split('?')[0]}`;
  return url;
};

export default function VideoPlayer({
  src,
  title,
  initialWatchedSeconds = 0,
  onProgress,
  onTimeChange,
}) {
  const videoRef = useRef(null);
  const saveTimerRef = useRef(null);
  const lastProgressRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [hlsUnsupported, setHlsUnsupported] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(Number(initialWatchedSeconds) || 0);

  useEffect(() => {
    setCurrentTime(Number(initialWatchedSeconds) || 0);
  }, [initialWatchedSeconds, src]);

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearInterval(saveTimerRef.current);
    };
  }, []);

  const emitProgress = () => {
    const video = videoRef.current;
    const total = Math.floor(video?.duration || duration || 0);
    const watched = Math.floor(video?.currentTime || currentTime || 0);
    if (!onProgress || total <= 0) return;

    const key = `${watched}:${total}`;
    if (lastProgressRef.current === key) return;
    lastProgressRef.current = key;
    onProgress(watched, total);
  };

  const startSaveTimer = () => {
    if (saveTimerRef.current || !onProgress) return;
    saveTimerRef.current = setInterval(emitProgress, 15000);
  };

  const stopSaveTimer = () => {
    if (!saveTimerRef.current) return;
    clearInterval(saveTimerRef.current);
    saveTimerRef.current = null;
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;
    const total = Math.floor(video.duration || 0);
    setDuration(total);

    if (initialWatchedSeconds > 0 && initialWatchedSeconds < total) {
      video.currentTime = initialWatchedSeconds;
    }
  };

  const handlePlay = () => {
    setPlaying(true);
    startSaveTimer();
  };

  const handlePause = () => {
    setPlaying(false);
    stopSaveTimer();
    emitProgress();
  };

  const handleEnded = () => {
    setPlaying(false);
    stopSaveTimer();
    emitProgress();
  };

  if (!src) {
    return (
      <div className="grid aspect-video place-items-center rounded-2xl bg-slate-950 p-8 text-center text-white">
        <p className="text-sm font-medium text-slate-300">Video content is not configured for this lesson.</p>
      </div>
    );
  }

  if (!isHls(src)) {
    return (
      <div className="aspect-video overflow-hidden rounded-2xl bg-black shadow-sm">
        <iframe
          title={title}
          src={toEmbedUrl(src)}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-slate-950 shadow-sm">
      <div className="relative aspect-video">
        <video
          ref={videoRef}
          src={src}
          className="h-full w-full object-contain"
          playsInline
          onLoadedMetadata={handleLoadedMetadata}
          onPlay={handlePlay}
          onPause={handlePause}
          onEnded={handleEnded}
          onError={() => setHlsUnsupported(true)}
          onTimeUpdate={(event) => {
            const value = event.currentTarget.currentTime;
            setCurrentTime(value);
            onTimeChange?.(value, event.currentTarget.duration || duration || 0);
          }}
        />

        {hlsUnsupported && (
          <div className="absolute inset-0 grid place-items-center bg-slate-950/95 p-6 text-center text-white">
            <div>
              <p className="text-sm font-semibold">This HLS stream cannot be played by this browser.</p>
              <p className="mt-1 text-xs text-slate-400">The lesson remains available, but the configured stream needs a browser-compatible HLS player.</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 border-t border-slate-800 px-4 py-3 text-slate-200">
        <button
          type="button"
          aria-label={playing ? 'Pause video' : 'Play video'}
          onClick={() => {
            const video = videoRef.current;
            if (!video) return;
            if (video.paused) video.play();
            else video.pause();
          }}
          className="grid h-9 w-9 place-items-center rounded-full bg-white text-slate-900 transition hover:bg-slate-200"
        >
          {playing ? <Pause size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" />}
        </button>
        <div className="min-w-0 flex-1">
          <input
            type="range"
            min="0"
            max={Math.max(duration, 1)}
            step="1"
            value={Math.min(currentTime, Math.max(duration, 1))}
            onChange={(event) => {
              const value = Number(event.target.value);
              const video = videoRef.current;
              if (!video) return;
              video.currentTime = value;
              setCurrentTime(value);
              onTimeChange?.(value, video.duration || duration || 0);
            }}
            className="w-full accent-blue-500"
          />
        </div>
        <button
          type="button"
          aria-label={muted ? 'Unmute video' : 'Mute video'}
          onClick={() => {
            const nextMuted = !muted;
            setMuted(nextMuted);
            if (videoRef.current) videoRef.current.muted = nextMuted;
          }}
          className="grid h-9 w-9 place-items-center rounded-lg hover:bg-slate-800"
        >
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      </div>
    </div>
  );
}
