import {
  ChevronDown,
  Folder,
  FileCode,
  FileText,
} from "lucide-react";

export default function FileExplorer({
  selectedFile,
  onSelect,
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">

      {/* Header */}

      <div className="px-6 py-5 border-b">
        <h2 className="text-2xl font-bold text-gray-900">
          Files
        </h2>
      </div>

      {/* Content */}

      <div className="p-5">

        {/* src folder */}

        <div className="flex items-center gap-2 mb-4">

          <ChevronDown size={16} />

          <Folder
            size={18}
            className="text-yellow-500 fill-yellow-300"
          />

          <span className="font-semibold">
            src
          </span>

        </div>

        {/* Files inside src */}

        <div className="ml-7 space-y-2">

          <button
            onClick={() => onSelect("app.js")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
              selectedFile === "app.js"
                ? "bg-blue-100 text-blue-700"
                : "hover:bg-gray-100"
            }`}
          >
            <FileCode size={18} />
            <span>app.js</span>
          </button>

          <button
            onClick={() => onSelect("routes.js")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
              selectedFile === "routes.js"
                ? "bg-blue-100 text-blue-700"
                : "hover:bg-gray-100"
            }`}
          >
            <FileCode size={18} />
            <span>routes.js</span>
          </button>

        </div>

        {/* package.json */}

        <button
          onClick={() => onSelect("package.json")}
          className={`mt-5 w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
            selectedFile === "package.json"
              ? "bg-blue-100 text-blue-700"
              : "hover:bg-gray-100"
          }`}
        >
          <FileText size={18} />
          <span>package.json</span>
        </button>

      </div>

    </div>
  );
}