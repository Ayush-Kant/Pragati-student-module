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
          className="border rounded-lg p-4 shadow-sm"
        >
          {question.type === "MCQ" ? (
            <>
              <h4 className="font-semibold mb-2">
                {question.text}
              </h4>

              <ul className="list-disc pl-5">
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
              <h4 className="font-semibold mb-2">
                {question.problemStatement}
              </h4>

              <p>
                Languages: {question.languages.join(", ")}
              </p>

              <p>
                Sample Input: {question.sampleInput}
              </p>

              <p>
                Sample Output: {question.sampleOutput}
              </p>

              <p>Marks: {question.marks}</p>
            </>
          )}

          <div className="flex gap-2 mt-3">
            <button
              onClick={() => onEdit(question)}
              className="px-3 py-1 bg-blue-500 text-white rounded"
            >
              Edit
            </button>

            <button
              onClick={() =>
                onDelete(question.id)
              }
              className="px-3 py-1 bg-red-500 text-white rounded"
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