import React from "react";
import QuestionCard from "../components/questions/QuestionCard";
import QuestionPalette from "../components/questions/QuestionPalette";
import AssessmentTimer from "../components/timer/AssessmentTimer";
import { useAssessmentAttempt } from "../hooks/useAssessmentAttempt";

export default function AssessmentAttemptPage({ assessment, onSubmit }) {
  const {
    currentIndex,
    setCurrentIndex,
    answers,
    handleSelectAnswer,
    timeLeft,
    submitTest
  } = useAssessmentAttempt(assessment, onSubmit);

  const currentQuestion = assessment.questions[currentIndex];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-800">{assessment.title}</h1>
          <p className="text-xs text-gray-500">Question {currentIndex + 1} of {assessment.questions.length}</p>
        </div>
        <AssessmentTimer timeLeft={timeLeft} />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <QuestionCard
            question={currentQuestion}
            questionIndex={currentIndex}
            selectedOption={answers[currentIndex]}
            onSelectOption={handleSelectAnswer}
          />

          <div className="flex justify-between pt-2">
            <button
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((prev) => prev - 1)}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 disabled:opacity-50"
            >
              Previous
            </button>
            
            {currentIndex < assessment.questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex((prev) => prev + 1)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Next
              </button>
            ) : (
              <button
                onClick={submitTest}
                className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700"
              >
                Submit Test
              </button>
            )}
          </div>
        </div>

        <div>
          <QuestionPalette
            totalQuestions={assessment.questions.length}
            currentIndex={currentIndex}
            answers={answers}
            onSelectQuestion={setCurrentIndex}
          />
        </div>
      </div>
    </div>
  );
}