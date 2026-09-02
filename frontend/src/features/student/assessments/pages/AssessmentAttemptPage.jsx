import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import QuestionCard from "../components/questions/QuestionCard";
import QuestionPalette from "../components/questions/QuestionPalette";
import QuestionProgress from "../components/questions/QuestionProgress";
import QuestionNavigator from "../components/questions/QuestionNavigator";
import AssessmentTimer from "../components/timer/AssessmentTimer";
import AutoSubmitModal from "../components/timer/AutoSubmitModal";
import ConfirmationModal from "../components/common/ConfirmationModal";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorState from "../components/common/ErrorState";
import { getAssessmentById, startAssessment, submitAssessment } from "../services/assessmentService";
import { useAssessmentAttempt } from "../hooks/useAssessmentAttempt";

const normalizeAttempt = (attempt) => ({
  ...attempt,
  answers: attempt?.answers || {},
});

export default function AssessmentAttemptPage() {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    let active = true;

    const initialize = async () => {
      try {
        setLoading(true);
        setError(null);
        const [details, started] = await Promise.all([
          getAssessmentById(assessmentId),
          startAssessment(assessmentId),
        ]);

        if (!active) return;
        setAssessment(details);
        setAttempt(normalizeAttempt(started));
      } catch (err) {
        if (active) {
          setError(err?.response?.data?.message || err?.message || "Unable to start assessment");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    initialize();
    return () => {
      active = false;
    };
  }, [assessmentId]);

  const handleSubmit = useCallback(
    async (_answers, reason = "submitted") => {
      if (!attempt?.attemptId || submitted) return;
      try {
        const result = await submitAssessment(attempt.attemptId, reason);
        setSubmitted(true);
        const resultAttemptId = result?.attemptId || attempt.attemptId;
        navigate(`/student/assessments/${assessmentId}/result?attemptId=${encodeURIComponent(resultAttemptId)}`, {
          replace: true,
        });
      } catch (err) {
        setError(err?.response?.data?.message || err?.message || "Unable to submit assessment");
      }
    },
    [assessmentId, attempt?.attemptId, navigate, submitted],
  );

  const {
    currentIndex,
    setCurrentIndex,
    answers,
    handleSelectAnswer,
    timeLeft,
    submitTest,
  } = useAssessmentAttempt({ assessment, attempt, onSubmit: handleSubmit });

  if (loading) return <LoadingSpinner message="Starting assessment..." />;
  if (error) return <ErrorState message={error} />;
  if (!assessment || !attempt) return <ErrorState message="Assessment attempt is unavailable." />;

  const questions = assessment.questions || [];
  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex] || null;

  if (totalQuestions === 0) {
    return <ErrorState message="This assessment has no questions." />;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-gray-800">{assessment.title}</h1>
          <QuestionProgress current={currentIndex + 1} total={totalQuestions} />
        </div>
        <AssessmentTimer timeLeft={timeLeft} />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          {currentQuestion && (
            <QuestionCard
              question={{
                ...currentQuestion,
                text: currentQuestion.questionText,
              }}
              questionIndex={currentIndex}
              selectedOption={answers[currentIndex]?.optionIndex}
              onSelectOption={handleSelectAnswer}
            />
          )}

          <QuestionNavigator
            onPrev={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            onNext={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
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

      <AutoSubmitModal isOpen={timeLeft === 0 && !submitted && totalQuestions > 0} />

      <ConfirmationModal
        isOpen={showConfirm}
        onConfirm={() => {
          setShowConfirm(false);
          void submitTest("submitted");
        }}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}
