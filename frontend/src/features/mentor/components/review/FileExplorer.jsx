import {
  ChevronDown,
  FileText,
  Folder,
  FileCode
} from "lucide-react";

export default function FileExplorer({
  selectedFile,
  onSelect
}) {

  return (

    <div className="bg-white border rounded-xl overflow-hidden">

      <div className="px-6 py-5 border-b">

        <h2 className="font-semibold text-xl">
          Files
        </h2>

      </div>

      <div className="p-5">

        <div className="flex items-center gap-2 mb-4 text-gray-700">

          <ChevronDown size={16} />

          <Folder
            size={18}
            className="text-yellow-500"
          />

          <span className="font-medium">
            src
          </span>

        </div>

        <div className="ml-7 space-y-2">

          <button
            onClick={() => onSelect("app.js")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition ${
              selectedFile === "app.js"
                ? "bg-blue-100 text-blue-700"
                : "hover:bg-gray-100"
            }`}
          >
            <FileCode size={16} />
            app.js
          </button>

          <button
            onClick={() => onSelect("routes.js")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition ${
              selectedFile === "routes.js"
                ? "bg-blue-100 text-blue-700"
                : "hover:bg-gray-100"
            }`}
          >
            <FileCode size={16} />
            routes.js
          </button>

          <button
            onClick={() => onSelect("package.json")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition ${
              selectedFile === "package.json"
                ? "bg-blue-100 text-blue-700"
                : "hover:bg-gray-100"
            }`}
          >
            <FileText size={16} />
            package.json
          </button>

        </div>

      </div>

    </div>

  );

}