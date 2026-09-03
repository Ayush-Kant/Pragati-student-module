import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorState from "../components/common/ErrorState";
import { getAssessmentReview } from "../services/assessmentService";

export default function AssessmentReviewPage() {
  const { assessmentId } = useParams();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getAssessmentReview(assessmentId)
      .then((data) => active && setReview(data))
      .catch((err) => active && setError(err?.response?.data?.message || err?.message || "Unable to load assessment review."))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [assessmentId]);

  if (loading) return <LoadingSpinner message="Loading answer review..." />;
  if (error || !review) return <ErrorState message={error || "Answer review unavailable."} />;

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6">
      <Link to={`/student/assessments/${assessmentId}/result?attemptId=${encodeURIComponent(review.attemptId)}`} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600">
        <ArrowLeft size={16} /> Back to result
      </Link>
      <div>
        <h1 className="text-2xl font-black text-slate-900">Answer Review</h1>
        <p className="mt-1 text-sm text-slate-500">{review.title}</p>
      </div>
      <div className="space-y-4">
        {(review.questions || []).map((question, index) => (
          <article key={question.questionId} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-wide text-blue-600">Question {index + 1} • {question.type}</div>
                <h2 className="mt-2 text-base font-bold leading-7 text-slate-900">{question.questionText}</h2>
              </div>
              <div className={question.isCorrect ? "text-emerald-600" : "text-rose-600"}>{question.isCorrect ? <CheckCircle2 size={20} /> : <XCircle size={20} />}</div>
            </div>
            <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
              <strong>Your answer:</strong> {JSON.stringify(question.answer ?? "Not answered")}
            </div>
            <div className="mt-3 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-900">
              <strong>Correct answer:</strong> {JSON.stringify(question.correctAnswer ?? question.correctOption ?? "Not configured")}
            </div>
            {question.explanation && <p className="mt-3 text-sm leading-6 text-slate-600"><strong>Explanation:</strong> {question.explanation}</p>}
            <div className="mt-3 text-xs font-semibold text-slate-500">Marks awarded: {question.marksAwarded}/{question.marks}</div>
          </article>
        ))}
      </div>
    </div>
  );
}
