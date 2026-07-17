import { Code2, Eye, FileText } from "lucide-react";

export default function PreviewTabs({ activeTab, setActiveTab }) {
  const tabClass = (value) =>
    `flex items-center gap-2 px-5 py-4 border-b-2 transition-all duration-200 ${
      activeTab === value
        ? "border-blue-600 text-blue-600 font-semibold"
        : "border-transparent text-gray-500 hover:text-blue-600 hover:bg-gray-50"
    }`;

  return (
    <div className="flex items-center bg-white border-b">

      <button
        onClick={() => setActiveTab("code")}
        className={tabClass("code")}
      >
        <Code2 size={16} />
        <span>Source Code</span>
      </button>

      <button
        onClick={() => setActiveTab("preview")}
        className={tabClass("preview")}
      >
        <Eye size={16} />
        <span>Live Preview</span>
      </button>

      <button
        onClick={() => setActiveTab("pdf")}
        className={tabClass("pdf")}
      >
        <FileText size={16} />
        <span>PDF Report</span>
      </button>

    </div>
  );
}