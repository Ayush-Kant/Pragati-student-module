import { useState } from "react";

/**
 * Basic in-call controls (mute/camera/leave). Wires up to Daily.co's
 * call object during integration — currently local UI state only.
 */
export default function SessionControls({ onLeave }) {
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);

  const controlClasses = (active) =>
    `flex h-10 w-10 items-center justify-center rounded-full text-lg transition ${
      active ? "bg-red-500 text-white" : "bg-slate-800 text-slate-200 hover:bg-slate-700"
    }`;

  return (
    <div className="flex items-center justify-center gap-3 rounded-xl bg-slate-900 px-4 py-3">
      <button
        onClick={() => setMuted((m) => !m)}
        className={controlClasses(muted)}
        aria-pressed={muted}
        aria-label={muted ? "Unmute microphone" : "Mute microphone"}
        title={muted ? "Unmute" : "Mute"}
      >
        {muted ? "🔇" : "🎙️"}
      </button>
      <button
        onClick={() => setCameraOff((c) => !c)}
        className={controlClasses(cameraOff)}
        aria-pressed={cameraOff}
        aria-label={cameraOff ? "Turn camera on" : "Turn camera off"}
        title={cameraOff ? "Turn camera on" : "Turn camera off"}
      >
        {cameraOff ? "🚫" : "📷"}
      </button>
      <button
        onClick={onLeave}
        className="flex h-10 items-center gap-1.5 rounded-full bg-red-600 px-4 text-sm font-medium text-white transition hover:bg-red-700"
      >
        Leave
      </button>
    </div>
  );
}
