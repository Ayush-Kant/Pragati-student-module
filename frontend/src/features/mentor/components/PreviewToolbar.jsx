import React from 'react';
import { ZoomIn, ZoomOut, Download } from 'lucide-react';

const PreviewToolbar = ({ onZoomIn, onZoomOut, zoomLevel }) => {
  return (
    <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center pointer-events-none">
      
      {/* Live Preview Badge */}
      <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-full px-4 py-2 flex items-center gap-2 shadow-lg pointer-events-auto">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        <span className="text-xs font-medium text-white tracking-wide uppercase">Live Preview</span>
      </div>

      {/* Controls */}
      <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg flex items-center shadow-lg pointer-events-auto">
        <button 
          onClick={onZoomOut}
          className="p-2.5 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors border-r border-gray-700 rounded-l-lg"
          title="Zoom Out"
        >
          <ZoomOut size={18} />
        </button>
        <span className="px-3 text-xs font-medium text-gray-300 w-14 text-center">
          {Math.round(zoomLevel * 100)}%
        </span>
        <button 
          onClick={onZoomIn}
          className="p-2.5 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors border-l border-gray-700"
          title="Zoom In"
        >
          <ZoomIn size={18} />
        </button>
        <button 
          className="p-2.5 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors border-l border-gray-700 rounded-r-lg"
          title="Download Mockup"
        >
          <Download size={18} />
        </button>
      </div>
    </div>
  );
};

export default PreviewToolbar;