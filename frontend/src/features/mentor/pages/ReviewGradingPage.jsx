import FileExplorer from "../components/review/FileExplorer";
import SubmissionViewer from "../components/review/SubmissionViewer";
import RubricPanel from "../components/review/RubricPanel";

export default function ReviewGradingPage() {
  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">

        <div className="flex justify-between items-center px-6 py-4 border-b">

          <div>

            <h2 className="text-3xl font-bold text-gray-900">
              Alex Rivers
            </h2>

            <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">

              <span>E-commerce API</span>

              <span>•</span>

              <span>Oct 24, 2023</span>

            </div>

          </div>

          <button
            className="
            px-4
            py-2
            rounded-lg
            border
            text-blue-600
            hover:bg-blue-50
            "
          >
            Open Full
          </button>

        </div>

      </div>

      {/* Workspace */}

      <div
        className="
        grid
        grid-cols-[280px_1fr_420px]
        gap-5
        "
      >

        <FileExplorer />

        <SubmissionViewer />

        <RubricPanel />

      </div>

    </div>
  );
}