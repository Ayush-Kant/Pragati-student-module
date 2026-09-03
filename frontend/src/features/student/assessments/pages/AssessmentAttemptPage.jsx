import React, { Component, useCallback, useEffect, useState } from "react";
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

const normalizeAttempt = (attempt) => ({ ...attempt, answers: attempt?.answers || {}, questions: attempt?.questions || [] });

class AssessmentAttemptErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, info) { console.error("[AssessmentAttemptErrorBoundary] Rendering error:", error, info); }
  render() {
    if (!this.state.hasError) return this.props.children;
    const message = import.meta.env.DEV && this.state.error?.message ? `Assessment page error: ${this.state.error.message}` : "The assessment page could not be rendered. Please return to the assessment list and try again.";
    return <div className="min-h-[calc(100vh-4rem)] bg-gray-50 p-6"><div className="mx-auto max-w-3xl rounded-2xl border border-rose-200 bg-white p-8 shadow-sm"><ErrorState message={message} /></div></div>;
  }
}

export default function AssessmentAttemptPage() {
  return <AssessmentAttemptErrorBoundary><AssessmentAttemptContent /></AssessmentAttemptErrorBoundary>;
}

function AssessmentAttemptContent() {
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
        setLoading(true); setError(null);
        const details = await getAssessmentById(assessmentId);
        const started = normalizeAttempt(await startAssessment(assessmentId));
        if (!started.questions.length) throw new Error("This assessment is not configured with any questions yet.");
        if (!active) return;
        setAssessment({ ...details, questions: started.questions, timeLimitMinutes: started.timeLimitMinutes || details?.timeLimitMinutes, totalMarks: details?.totalMarks ?? started.questions.reduce((sum, q) => sum + Number(q.marks || 0), 0) });
        setAttempt(started);
      } catch (err) {
        if (active) setError(err?.response?.data?.message || err?.message || "Unable to start assessment");
      } finally { if (active) setLoading(false); }
    };
    initialize();
    return () => { active = false; };
  }, [assessmentId]);

  const handleSubmit = useCallback(async (answers, reason = "submitted", tabSwitchCount) => {
    if (!attempt?.attemptId || submitted) return;
    try {
      const result = await submitAssessment(attempt.attemptId, { answers, reason, tabSwitchCount });
      setSubmitted(true);
      const resultAttemptId = result?.attemptId || attempt.attemptId;
      navigate(`/student/assessments/${assessmentId}/result?attemptId=${encodeURIComponent(resultAttemptId)}`, { replace: true });
    } catch (err) { setError(err?.response?.data?.message || err?.message || "Unable to submit assessment"); }
  }, [assessmentId, attempt?.attemptId, navigate, submitted]);

  const { currentIndex, setCurrentIndex, answers, handleChangeAnswer, timeLeft, tabSwitchCount, submitTest, savingQuestionId, saveError } = useAssessmentAttempt({ assessment, attempt, onSubmit: handleSubmit });

  if (loading) return <LoadingSpinner message="Starting assessment..." />;
  if (error) return <ErrorState message={error} />;
  if (!assessment || !attempt) return <ErrorState message="Assessment attempt is unavailable." />;

  const questions = assessment.questions || [];
  const currentQuestion = questions[currentIndex] || null;
  if (!currentQuestion) return <ErrorState message="This assessment has no questions." />;

  const answeredCount = questions.filter((question) => Boolean(answers[String(question.id)])).length;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="space-y-1"><h1 className="text-xl font-bold text-gray-800">{assessment.title}</h1><QuestionProgress current={currentIndex + 1} total={questions.length} /></div>
        <div className="flex items-center gap-4"><span className="text-xs font-semibold text-slate-500">Answered {answeredCount}/{questions.length} • Tab switches {tabSwitchCount}</span><AssessmentTimer timeLeft={timeLeft} /></div>
      </div>

      {saveError && <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{saveError}</div>}
      {savingQuestionId && <div className="text-xs font-medium text-slate-400">Saving answer…</div>}

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-4 md:col-span-2">
          <QuestionCard
            question={currentQuestion}
            questionIndex={currentIndex}
            answer={answers[String(currentQuestion.id)] || null}
            onChangeAnswer={handleChangeAnswer}
          />
          <QuestionNavigator
            onPrev={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            onNext={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
            onSubmit={() => setShowConfirm(true)}
            isFirst={currentIndex === 0}
            isLast={currentIndex === questions.length - 1}
          />
        </div>
        <QuestionPalette
          totalQuestions={questions.length}
          currentIndex={currentIndex}
          answers={answers}
          questions={questions}
          onSelectQuestion={setCurrentIndex}
        />
      </div>

      <AutoSubmitModal isOpen={timeLeft === 0 && !submitted && questions.length > 0} />
      <ConfirmationModal
        isOpen={showConfirm}
        onConfirm={() => { setShowConfirm(false); void submitTest("submitted"); }}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}
