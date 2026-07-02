import { FileText, Image, Download, Eye } from "lucide-react";

export default function DisputeEvidenceViewer({
  evidence = [],
  darkMode,
}) {
  if (!evidence.length) {
    return (
      <div
        className={`text-center py-10 ${
          darkMode ? "text-gray-400" : "text-gray-500"
        }`}
      >
        No evidence uploaded.
      </div>
    );
  }

  const isImage = (fileName = "") => {
    return (
      fileName.endsWith(".png") ||
      fileName.endsWith(".jpg") ||
      fileName.endsWith(".jpeg") ||
      fileName.endsWith(".gif") ||
      fileName.endsWith(".webp")
    );
  };

  return (
    <div className="grid md:grid-cols-2 gap-4">

      {evidence.map((file) => (

        <div
          key={file.id}
          className={`rounded-lg border p-4 transition hover:shadow-lg ${
            darkMode
              ? "bg-slate-800 border-slate-700"
              : "bg-white"
          }`}
        >

          <div className="flex items-center gap-3">

            <div
              className={`p-3 rounded-full ${
                darkMode
                  ? "bg-slate-700"
                  : "bg-gray-100"
              }`}
            >

              {isImage(file.fileName) ? (
                <Image size={22} />
              ) : (
                <FileText size={22} />
              )}

            </div>

            <div className="flex-1">

              <h3 className="font-semibold break-all">
                {file.fileName}
              </h3>

              <p
                className={`text-sm ${
                  darkMode
                    ? "text-gray-400"
                    : "text-gray-500"
                }`}
              >
                Uploaded :
                {" "}
                {file.uploadedAt}
              </p>

            </div>

          </div>

          <div className="flex gap-3 mt-5">

            <button
              onClick={() => window.open(file.url)}
              className="flex items-center gap-2 px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Eye size={18} />
              View
            </button>

            <button
              onClick={() => window.open(file.url)}
              className="flex items-center gap-2 px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white"
            >
              <Download size={18} />
              Download
            </button>

          </div>

        </div>

      ))}

    </div>
  );
}