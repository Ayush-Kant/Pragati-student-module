import { useEffect, useRef } from "react";
import { validateRecording } from "../../validations/liveSessionValidation";

const storageKey = (sessionId) => `live-session-recording-progress:${sessionId}`;

export default function RecordingPlayer({ session }) {
  const videoRef = useRef(null);
  const { valid, errors } = validateRecording(session);

  useEffect(() => {
    if (!valid || !videoRef.current) return;
    const saved = Number(localStorage.getItem(storageKey(session.id)) || 0);
    if (saved > 0) {
      videoRef.current.currentTime = saved;
    }
  }, [valid, session?.id]);

  if (!valid) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-lg bg-slate-100 text-sm text-slate-500">
        {errors[0]}
      </div>
    );
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      localStorage.setItem(storageKey(session.id), String(videoRef.current.currentTime));
    }
  };

  return (
    <video
      ref={videoRef}
      src={session.recordingUrl}
      controls
      onTimeUpdate={handleTimeUpdate}
      className="aspect-video w-full rounded-lg bg-black"
    >
      Your browser does not support embedded video playback.
    </video>
  );
}
