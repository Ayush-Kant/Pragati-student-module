import React, { useState } from "react";

const ResumeActions = () => {
  const [loadingAction, setLoadingAction] = useState("");

  const handleAction = (action) => {
    setLoadingAction(action);

    setTimeout(() => {
      setLoadingAction("");
    }, 1500);
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen px-4 pt-8">
      <div className="w-full max-w-md mx-auto bg-white border border-gray-200 rounded-xl shadow-sm p-5">
        {/* Header */}
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            Resume Actions
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Manage your uploaded resume
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-3">
          {/* Preview */}
          <button
            onClick={() => handleAction("preview")}
            disabled={loadingAction !== ""}
            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition duration-200 disabled:opacity-70"
          >
            {loadingAction === "preview" ? "Opening..." : "Preview"}
          </button>

          {/* Replace */}
          <button
            onClick={() => handleAction("replace")}
            disabled={loadingAction !== ""}
            className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition duration-200 disabled:opacity-70"
          >
            {loadingAction === "replace" ? "Replacing..." : "Replace"}
          </button>

          {/* Delete */}
          <button
            onClick={() => handleAction("delete")}
            disabled={loadingAction !== ""}
            className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition duration-200 disabled:opacity-70"
          >
            {loadingAction === "delete" ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeActions;
