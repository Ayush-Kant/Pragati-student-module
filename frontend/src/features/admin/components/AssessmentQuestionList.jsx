import React from "react";
import { useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";

function AssessmentQuestionList({
  questions,
  onEdit,
  onDelete,
}) {
  const navigate = useNavigate();
  const { darkMode } = useOutletContext();
  
  return (
    <div className="space-y-4">
      {questions.map((question) => (
        <div
          key={question.id}
          className="rounded-lg border border-gray-200 bg-white p-3 md:p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900"
        >
          {question.type === "MCQ" ? (
            <>
              <h4 className="mb-2 text-base md:text-lg font-semibold">
                {question.text}
              </h4>

              <ul className="list-disc pl-5 text-sm md:text-base wrap-break-word">
                {question.options.map((option, index) => (
                  <li key={index}>{option}</li>
                ))}
              </ul>

              <p className="mt-2 text-sm">
                Correct Answer: Option{" "}
                {question.correctOption + 1}
              </p>

              <p className="text-sm">
                Marks: {question.marks}
              </p>
            </>
          ) : (
            <>
              <h4 className="mb-2 text-base md:text-lg font-semibold wrap-break-word">
                {question.problemStatement}
              </h4>

              <p className="text-sm md:text-base wrap-break-word">
                Languages: {question.languages.join(", ")}
              </p>

              <p className="text-sm md:text-base">
                Sample Input: {question.sampleInput}
              </p>

              <p className="text-sm md:text-base">
                Sample Output: {question.sampleOutput}
              </p>

              <p className="text-sm md:text-base">
                Marks: {question.marks}
              </p>
            </>
          )}

         <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <button
              onClick={() => onEdit(question)}
              className="rounded bg-blue-500 px-3 py-2 text-sm text-white transition hover:bg-blue-600 md:px-4 md:text-base">
              Edit
            </button>

            <button
              onClick={() =>
                onDelete(question.id)
              }
              className="px-3 py-2 text-sm md:px-4 md:text-base bg-red-500 text-white rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AssessmentQuestionList;