import React, { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Clock3, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AssessmentCard from "../components/assessment/AssessmentCard";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorState from "../components/common/ErrorState";
import EmptyState from "../components/common/EmptyState";
import SectionHeader from "../components/common/SectionHeader";
import { useAssessments } from "../hooks/useAssessments";
import { getAssessmentHistory } from "../services/assessmentService";

const formatDate = (value) => (value ? new Date(value).toLocaleString() : "—");

const AttemptStatus = ({ attempt }) => {
  if (attempt.status === "in_progress") {
    return <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700"><Clock3 size={13} /> In progress</span>;
  }
  if (attempt.passed) {
    return <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700"><CheckCircle2 size={13} /> Passed</span>;
  }
  return <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700"><XCircle size={13} /> Failed</span>;
};

export default function AssessmentsPage() {
  const navigate = useNavigate();
  const { assessments, loading, error } = useAssessments();
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState("");

  useEffect(() => {
    let mounted = true;
    const loadHistory = async () => {
      try {
        setHistoryLoading(true);
        const response = await getAssessmentHistory();
        const list = Array.isArray(response) ? response : Array.isArray(response?.history) ? response.history : [];
        if (mounted) {
          setHistory(list);
          setHistoryError("");
        }
      } catch (err) {
        if (mounted) setHistoryError(err?.response?.data?.message || err?.message || "Unable to load attempt history.");
      } finally {
        if (mounted) setHistoryLoading(false);
      }
    };
    loadHistory();
    return () => { mounted = false; };
  }, []);

  if (loading) return <LoadingSpinner message="Loading available assessments..." />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-10 p-4 sm:p-6">
      <section>
        <SectionHeader
          title="Available Assessments"
          subtitle="Select a test to view details and start your evaluation."
        />

        {assessments.length ? (
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {assessments.map((item) => (
              <AssessmentCard
                key={item.id}
                item={item}
                onSelect={(id) => navigate(`/student/assessments/${id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="mt-6">
            <EmptyState
              title="No Assessments Available"
              description="There are no active assessments available for your account right now."
            />
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Your Attempt History</h2>
            <p className="text-sm text-slate-500">Every submitted attempt is retained here so you can revisit previous results.</p>
          </div>
          <span className="text-sm font-semibold text-slate-500">{history.length} attempt{history.length === 1 ? "" : "s"}</span>
        </div>

        {historyLoading ? (
          <div className="mt-6 rounded-xl bg-slate-50 p-6 text-sm text-slate-500">Loading attempt history…</div>
        ) : historyError ? (
          <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{historyError}</div>
        ) : history.length === 0 ? (
          <div className="mt-6 rounded-xl bg-slate-50 p-6 text-sm text-slate-500">No previous attempts yet.</div>
        ) : (
          <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Assessment</th>
                  <th className="px-4 py-3">Attempt</th>
                  <th className="px-4 py-3">Completed</th>
                  <th className="px-4 py-3">Score</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {history.map((attempt) => (
                  <tr key={attempt.attemptId} className="hover:bg-slate-50/80">
                    <td className="px-4 py-4 font-semibold text-slate-900">{attempt.title}</td>
                    <td className="px-4 py-4 text-slate-600">#{attempt.attemptNumber}</td>
                    <td className="px-4 py-4 text-slate-600">{formatDate(attempt.submittedAt || attempt.startedAt)}</td>
                    <td className="px-4 py-4 font-semibold text-slate-900">{attempt.score}/{attempt.totalMarks} <span className="font-normal text-slate-500">({attempt.percentage}%)</span></td>
                    <td className="px-4 py-4"><AttemptStatus attempt={attempt} /></td>
                    <td className="px-4 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => navigate(`/student/assessments/${attempt.assessmentId}/result?attemptId=${attempt.attemptId}`)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
                      >
                        View result <ArrowRight size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
