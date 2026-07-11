import React from "react";
import { Eye, Calendar, Award, Code, CheckSquare, Layers, AlertCircle } from "lucide-react";

// Markdown Parser Helper
const parseMarkdownToHtml = (md) => {
  if (!md) return "";
  let html = md;
  // Escape HTML tags to prevent XSS
  html = html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/__(.*?)__/g, "<strong>$1</strong>");

  // Italic
  html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");
  html = html.replace(/_(.*?)_/g, "<em>$1</em>");

  // Underline
  html = html.replace(/~u_(.*?)_u~/g, "<u>$1</u>");

  // Code Blocks
  html = html.replace(/```([\s\S]*?)```/g, "<pre class='bg-gray-800 p-3 rounded-lg font-mono text-[11px] text-gray-100 overflow-x-auto my-2 border border-gray-700'><code>$1</code></pre>");

  // Inline code
  html = html.replace(/`(.*?)`/g, "<code class='bg-gray-100 px-1 py-0.5 rounded font-mono text-xs text-red-500 font-semibold'>$1</code>");

  // Lists
  html = html.replace(/^\s*-\s+(.*?)$/gm, "<li class='list-inside list-disc ml-4 my-1 text-xs text-gray-700'>$1</li>");

  // Headers
  html = html.replace(/^### (.*?)$/gm, "<h4 class='text-sm font-bold text-gray-800 mt-3 mb-1'>$1</h4>");
  html = html.replace(/^## (.*?)$/gm, "<h3 class='text-base font-bold text-gray-800 mt-4 mb-1.5'>$1</h3>");
  html = html.replace(/^# (.*?)$/gm, "<h2 class='text-lg font-extrabold text-gray-800 mt-5 mb-2'>$1</h2>");

  // Mermaid Diagram Mockup Indicator
  html = html.replace(/```mermaid([\s\S]*?)```/g, "<div class='border border-blue-100 bg-blue-50/50 p-3 rounded-xl my-3 flex flex-col items-center'><span class='text-[10px] font-bold text-blue-700 uppercase tracking-wide mb-1'>📊 Visual Diagram Preview</span><pre class='font-mono text-[10px] text-blue-900'>$1</pre></div>");

  // Hyperlinks
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, "<a href='$2' target='_blank' rel='noopener noreferrer' class='text-blue-600 hover:underline'>$1</a>");

  // Clean lines / paragraph line breaks
  const parts = html.split(/(<pre[\s\S]*?<\/pre>)/);
  html = parts.map(part => {
    if (part.startsWith("<pre")) return part;
    return part.replace(/\n/g, "<br />");
  }).join("");

  return html;
};

export default function StudentPreviewPanel({ formValues, isRubricWeightValid, totalRubricWeight }) {
  const {
    title,
    description,
    problemStatement,
    difficulty,
    duration,
    projectType,
    skillTags = [],
    deliverables = [],
    rubrics = [],
    submissionDeadline,
  } = formValues;

  const renderedHtml = parseMarkdownToHtml(problemStatement);

  const getDifficultyColor = (level) => {
    switch (level) {
      case "Beginner":
        return "bg-green-50 text-green-700 border-green-100";
      case "Advanced":
        return "bg-red-50 text-red-700 border-red-100";
      default:
        return "bg-blue-50 text-blue-700 border-blue-100";
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-6 sticky top-24 overflow-y-auto max-h-[82vh] max-w-full">
      {/* Header */}
      <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
        <Eye className="w-4 h-4 text-blue-600 animate-pulse" />
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Student Preview</span>
      </div>

      {/* Simulated Card Page */}
      <div className="space-y-5">
        {/* Chips Row */}
        <div className="flex flex-wrap gap-2">
          <span className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border ${getDifficultyColor(difficulty)}`}>
            {difficulty || "Intermediate"}
          </span>
          {duration && (
            <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg border border-gray-200 bg-gray-50 text-gray-600 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {duration}
            </span>
          )}
          <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg border border-gray-200 bg-gray-50 text-gray-600">
            {projectType === "team" ? "👥 Team Project" : "👤 Individual"}
          </span>
        </div>

        {/* Title */}
        <div>
          <h2 className="text-xl font-extrabold text-gray-900 leading-tight">
            {title || "Untitled Project"}
          </h2>
          {description && (
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Requirements Skills */}
        {skillTags.length > 0 && (
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5" /> Required Skills
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {skillTags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-gray-100 text-gray-700 text-[10px] font-bold rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Problem Statement Display */}
        {problemStatement && (
          <div className="space-y-2 border-t border-gray-100 pt-4">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" /> Project Overview & Details
            </h4>
            <div
              className="text-xs text-gray-700 leading-relaxed break-words font-sans"
              dangerouslySetInnerHTML={{ __html: renderedHtml }}
            />
          </div>
        )}

        {/* Required Deliverables checklist */}
        {deliverables.length > 0 && (
          <div className="space-y-2 border-t border-gray-100 pt-4">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
              <CheckSquare className="w-3.5 h-3.5" /> Required Deliverables
            </h4>
            <div className="space-y-1.5">
              {deliverables.map((item, idx) => (
                <div key={item.id || idx} className="flex items-start gap-2 text-xs">
                  <span className={`w-1.5 h-1.5 rounded-full mt-1.5 ${item.required ? "bg-red-500" : "bg-gray-400"}`} />
                  <span className="font-semibold text-gray-700">
                    {item.title || <span className="text-gray-300 italic">Empty Deliverable</span>}
                    {item.required && <span className="text-red-500 text-[10px] font-bold ml-1">(Required)</span>}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rubric summary */}
        {rubrics.length > 0 && (
          <div className="space-y-2 border-t border-gray-100 pt-4">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" /> Evaluation Breakdown
            </h4>
            <div className="bg-gray-50 border border-gray-150 rounded-xl overflow-hidden">
              <div className="divide-y divide-gray-150 text-xs">
                {rubrics.map((rub, idx) => (
                  <div key={rub.id || idx} className="flex justify-between items-center px-3 py-2 bg-white">
                    <span className="font-semibold text-gray-700">
                      {rub.title || <span className="text-gray-300 italic">Untitled Criterion</span>}
                    </span>
                    <span className="font-extrabold text-blue-600">{rub.weight}%</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Weight validation warning on preview side */}
            {!isRubricWeightValid && (
              <div className="flex items-start gap-1.5 text-[10px] text-amber-600 bg-amber-50 p-2 rounded-lg font-medium mt-1">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Rubrics total is {totalRubricWeight}%. It must equal 100% before publishing.</span>
              </div>
            )}
          </div>
        )}

        {/* Submission Details footer */}
        {submissionDeadline && (
          <div className="border-t border-gray-100 pt-4 text-center">
            <p className="text-[10px] font-bold text-red-500 bg-red-50 py-1.5 rounded-lg">
              ⌛ Submission Deadline: {submissionDeadline}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
