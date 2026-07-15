import React from "react";
import { ZoomIn, ZoomOut, Download } from "lucide-react";

const PreviewToolbar = ({
  onZoomIn,
  onZoomOut,
  onDownload,
  zoomLevel,
}) => {
  return (
    <div className="flex items-center justify-between w-full">

      {/* Live Preview */}
      <div className="flex items-center gap-3">

        <div className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-white">
            LIVE PREVIEW
          </p>

          <p className="text-[11px] text-slate-300">
            Updates Instantly
          </p>
        </div>

      </div>

      {/* Zoom & Download Controls */}
      <div className="flex items-center overflow-hidden rounded-lg border border-slate-600 bg-slate-800 shadow-lg">

        {/* Zoom Out */}
        <button
          type="button"
          onClick={onZoomOut}
          className="flex h-10 w-10 items-center justify-center hover:bg-slate-700 transition"
        >
          <ZoomOut size={18} className="text-white" />
        </button>

        {/* Percentage */}
        <div className="border-x border-slate-600 px-4 py-2 text-sm font-semibold text-white min-w-[70px] text-center">
          {Math.round(zoomLevel * 100)}%
        </div>

        {/* Zoom In */}
        <button
          type="button"
          onClick={onZoomIn}
          className="flex h-10 w-10 items-center justify-center hover:bg-slate-700 transition"
        >
          <ZoomIn size={18} className="text-white" />
        </button>

        {/* Download */}
        <button
          type="button"
          onClick={onDownload}
          className="flex h-10 w-10 items-center justify-center border-l border-slate-600 hover:bg-blue-600 transition"
        >
          <Download size={18} className="text-white" />
        </button>

      </div>

    </div>
  );
};

export default PreviewToolbar;