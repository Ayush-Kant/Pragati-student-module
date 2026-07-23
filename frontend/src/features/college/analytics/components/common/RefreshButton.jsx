import { RefreshCw } from "lucide-react";

export const RefreshButton = ({ onClick, loading = false, darkMode = false }) => (
  <button
    onClick={onClick}
    disabled={loading}
    className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg border transition-all duration-200 ${
      loading ? "opacity-50 cursor-not-allowed" : "hover:shadow-sm"
    } ${
      darkMode
        ? "border-[#3D3D3D] text-gray-300 hover:bg-[#2D2D2D]"
        : "border-gray-200 text-gray-600 hover:bg-gray-50"
    }`}
  >
    <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
    Refresh
  </button>
);
