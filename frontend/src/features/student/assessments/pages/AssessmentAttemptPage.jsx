import React, { useState } from "react";
import QuestionCard from "../components/questions/QuestionCard";
import QuestionPalette from "../components/questions/QuestionPalette";
import QuestionProgress from "../components/questions/QuestionProgress";
import QuestionNavigator from "../components/questions/QuestionNavigator";
import AssessmentTimer from "../components/timer/AssessmentTimer";
import AutoSubmitModal from "../components/timer/AutoSubmitModal";
import ConfirmationModal from "../components/common/ConfirmationModal";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { useAssessmentAttempt } from "../hooks/useAssessmentAttempt";

export default function AssessmentAttemptPage({ assessment, onSubmit }) {
  const [showConfirm, setShowConfirm] = useState(false);
  
  const {
    currentIndex,
    setCurrentIndex,
    answers,
    handleSelectAnswer,
    timeLeft,
    submitTest
  } = useAssessmentAttempt(assessment, onSubmit);

  const questions = assessment?.questions || [];
  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex] || null;

  if (!assessment || totalQuestions === 0) {
    return <LoadingSpinner message="Loading assessment questions..." />;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-gray-800">{assessment?.title || "Assessment"}</h1>
          <QuestionProgress current={currentIndex + 1} total={totalQuestions} />
        </div>
        <AssessmentTimer timeLeft={timeLeft} />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          {currentQuestion ? (
            <QuestionCard
              question={currentQuestion}
              questionIndex={currentIndex}
              selectedOption={answers[currentIndex]}
              onSelectOption={handleSelectAnswer}
            />
          ) : (
            <div className="p-6 bg-white rounded-xl border border-gray-200 text-center text-gray-500">
              No question available at current index.
            </div>
          )}

          <QuestionNavigator
            onPrev={() => setCurrentIndex((prev) => prev - 1)}
            onNext={() => setCurrentIndex((prev) => prev + 1)}
            onSubmit={() => setShowConfirm(true)}
            isFirst={currentIndex === 0}
            isLast={currentIndex === totalQuestions - 1}
          />
        </div>

        <div>
          <QuestionPalette
            totalQuestions={totalQuestions}
            currentIndex={currentIndex}
            answers={answers}
            onSelectQuestion={setCurrentIndex}
          />
        </div>
      </div>

      <AutoSubmitModal isOpen={timeLeft === 0 && totalQuestions > 0} />

      <ConfirmationModal
        isOpen={showConfirm}
        onConfirm={() => {
          setShowConfirm(false);
          submitTest();
        }}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}