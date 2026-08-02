import React from "react";
import { Eye, ZoomIn, ZoomOut, Download } from "lucide-react";

const PreviewToolbar = ({ onZoomIn, onZoomOut, onDownload }) => {
  return (
    <div className="flex w-full items-center justify-between">
      {/* Live Preview Badge */}
      <div className="flex items-center gap-2 rounded-md border border-gray-500 bg-transparent px-4 py-2 text-white">
        <Eye size={16} className="text-teal-400" />
        <span className="text-xs font-semibold uppercase tracking-wider">
          LIVE PREVIEW
        </span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onZoomOut}
          className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-500 bg-transparent text-white transition hover:bg-gray-700"
        >
          <ZoomOut size={18} />
        </button>
        <button
          type="button"
          onClick={onZoomIn}
          className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-500 bg-transparent text-white transition hover:bg-gray-700"
        >
          <ZoomIn size={18} />
        </button>
        <button
          type="button"
          onClick={onDownload}
          className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-500 bg-transparent text-white transition hover:bg-gray-700"
        >
          <Download size={18} />
        </button>
      </div>
    </div>
  );
};

export default PreviewToolbar;