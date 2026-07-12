import React, { useState } from "react";
import { Send, FileText, Eye, X, Award, CheckCircle2, AlertTriangle } from "lucide-react";

export default function PublishActions({
  onSubmit,
  handleSubmit,
  submitting,
  isRubricWeightValid,
  formValues,
}) {
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const onSaveDraft = () => {
    handleSubmit((data) => onSubmit(data, "draft"))();
  };

  const onPublish = () => {
    handleSubmit((data) => onSubmit(data, "publish"))();
  };

  // Convert markdown problem statement to HTML for preview modal
  const renderedHtml = formValues.problemStatement
    ? formValues.problemStatement
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        .replace(/```([\s\S]*?)```/g, "<pre class='bg-gray-900 p-4 rounded-xl font-mono text-xs text-white overflow-x-auto my-3 border border-gray-700'><code>$1</code></pre>")
        .replace(/`(.*?)`/g, "<code class='bg-gray-150 px-1 py-0.5 rounded font-mono text-xs text-red-500 font-semibold'>$1</code>")
        .replace(/^\s*-\s+(.*?)$/gm, "<li class='list-inside list-disc ml-4 my-1 text-gray-700'>$1</li>")
        .replace(/^### (.*?)$/gm, "<h4 class='text-sm font-bold text-gray-800 mt-3 mb-1'>$1</h4>")
        .replace(/^## (.*?)$/gm, "<h3 class='text-base font-bold text-gray-800 mt-4 mb-1.5'>$1</h3>")
        .replace(/^# (.*?)$/gm, "<h2 class='text-lg font-extrabold text-gray-800 mt-5 mb-2'>$1</h2>")
        .replace(/\n/g, "<br />")
    : "";

  return (
    <div className="flex items-center gap-3">
      {/* Save Draft */}
      <button
        type="button"
        disabled={submitting}
        onClick={onSaveDraft}
        className="px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold text-sm rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FileText className="w-4 h-4" />
        Save Draft
      </button>

      {/* Preview Modal Trigger */}
      <button
        type="button"
        onClick={() => setShowPreviewModal(true)}
        className="px-4 py-2 bg-white hover:bg-blue-50 border border-blue-200 text-blue-600 font-bold text-sm rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
      >
        <Eye className="w-4 h-4" />
        Preview
      </button>

      {/* Publish Project */}
      <button
        type="button"
        disabled={submitting}
        onClick={onPublish}
        className={`px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        <Send className="w-4 h-4" />
        {submitting ? "Publishing..." : "Publish Project"}
      </button>

      {/* Preview Overlay Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-gray-150 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-b border-gray-150">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-gray-800">Student View Simulation</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="p-1 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-150 transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 max-h-[70vh]">
              {/* Difficulty and Details */}
              <div className="flex flex-wrap gap-2.5">
                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg border border-blue-100">
                  {formValues.difficulty || "Intermediate"}
                </span>
                {formValues.duration && (
                  <span className="px-3 py-1 bg-gray-50 text-gray-600 text-xs font-bold rounded-lg border border-gray-200">
                    ⏱️ {formValues.duration}
                  </span>
                )}
                <span className="px-3 py-1 bg-gray-50 text-gray-600 text-xs font-bold rounded-lg border border-gray-200">
                  {formValues.projectType === "team" ? "👥 Team Assignment" : "👤 Individual Assignment"}
                </span>
                {formValues.projectType === "team" && (
                  <span className="px-3 py-1 bg-gray-50 text-gray-600 text-xs font-bold rounded-lg border border-gray-200">
                    👪 Size: {formValues.teamSize?.min}-{formValues.teamSize?.max} members
                  </span>
                )}
              </div>

              {/* Title */}
              <div>
                <h1 className="text-2xl font-extrabold text-gray-900">{formValues.title || "Untitled Project"}</h1>
                {formValues.description && (
                  <p className="text-sm text-gray-500 mt-2 font-medium leading-relaxed border-l-4 border-blue-600 pl-3">
                    {formValues.description}
                  </p>
                )}
              </div>

              {/* Skill chips */}
              {formValues.skillTags && formValues.skillTags.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Required skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {formValues.skillTags.map((tag) => (
                      <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {formValues.problemStatement && (
                <div className="space-y-3 pt-4 border-t border-gray-100">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Project Statement</h4>
                  <div
                    className="text-sm text-gray-700 leading-relaxed break-words border border-gray-200 rounded-xl p-4 bg-gray-50/50"
                    dangerouslySetInnerHTML={{ __html: renderedHtml }}
                  />
                </div>
              )}

              {/* Deliverables checklist */}
              {formValues.deliverables && formValues.deliverables.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-gray-100">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Deliverables checklist</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {formValues.deliverables.map((item, idx) => (
                      <div key={item.id || idx} className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl shadow-sm">
                        <span className={`w-2 h-2 rounded-full ${item.required ? "bg-red-500" : "bg-gray-400"}`} />
                        <div>
                          <p className="text-xs font-bold text-gray-800">{item.title || "Empty Deliverable"}</p>
                          <p className="text-[10px] text-gray-500 mt-0.5">{item.required ? "Required Submission" : "Optional Submission"}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rubric evaluation criteria */}
              {formValues.rubrics && formValues.rubrics.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-gray-100">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Evaluation weights</h4>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-200">
                    {formValues.rubrics.map((rub, idx) => (
                      <div key={rub.id || idx} className="flex justify-between items-center p-3 bg-white hover:bg-gray-50/30 transition-colors">
                        <div>
                          <p className="text-xs font-bold text-gray-800">{rub.title || "Untitled Criterion"}</p>
                          {rub.description && <p className="text-[10px] text-gray-500 mt-0.5">{rub.description}</p>}
                        </div>
                        <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg">
                          {rub.weight}%
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  {!isRubricWeightValid && (
                    <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl text-xs font-semibold">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0 animate-bounce" />
                      <span>The total weight of rubrics is currently {totalRubricWeight}%. It must equal 100% to submit successfully.</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-150 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-2 border border-gray-200 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Close Simulation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
