import { useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useChallengeDetails } from '../hooks/useChallengeDetails';
import { useCodeExecution } from '../hooks/useCodeExecution';
import { useBeforeUnload } from '../hooks/useBeforeUnload';
import ChallengeHeader from '../components/challenge/ChallengeHeader';
import ChallengeDescription from '../components/challenge/ChallengeDescription';
import ChallengeConstraints from '../components/challenge/ChallengeConstraints';
import EditorToolbar from '../components/editor/EditorToolbar';
import MonacoEditor from '../components/editor/MonacoEditor';
import TestCasePanel from '../components/testcase/TestCasePanel';
import ConfirmationModal from '../components/common/ConfirmationModal';
import CodingChallengeErrorBoundary from '../components/common/CodingChallengeErrorBoundary';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorState from '../components/common/ErrorState';
import VerdictBadge from '../components/submission/VerdictBadge';
import ExecutionSummary from '../components/submission/ExecutionSummary';
import { VERDICT } from '../constants/codingChallengeConstants';

const ChallengeDetailsPage = () => {
  const { challengeId } = useParams();
  const navigate = useNavigate();
  const { challenge, isLoading, error, refetch } = useChallengeDetails(challengeId);
  const {
    language, code, executionResult, submissionResult, isExecuting, isSubmitting,
    executionError, submissionError, isDirty, setLanguage, setCode,
    handleRunCode, handleSubmit, handleReset,
  } = useCodeExecution(challengeId, challenge?.starterCode ?? null);

  useBeforeUnload(isDirty);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [resultDismissed, setResultDismissed] = useState(false);
  const showResultBanner = !!submissionResult && !resultDismissed;

  const onSubmitConfirmed = useCallback(async () => {
    setShowSubmitModal(false);
    setResultDismissed(false);
    await handleSubmit();
  }, [handleSubmit]);

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-50"><LoadingSpinner size="lg" label="Loading challenge…" /></div>;
  }
  if (error || !challenge) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-50"><ErrorState error={error ?? 'Challenge not found.'} onRetry={refetch} /></div>;
  }

  return (
    <CodingChallengeErrorBoundary>
      <div className="flex h-[calc(100vh-64px)] min-h-[700px] flex-col overflow-hidden bg-slate-50 text-slate-900">
        <ChallengeHeader challenge={challenge} />

        {showResultBanner && submissionResult && (
          <div className={`flex items-center justify-between border-b px-4 py-2 text-sm ${submissionResult.verdict === VERDICT.ACCEPTED ? 'border-emerald-200 bg-emerald-50' : 'border-rose-200 bg-rose-50'}`} role="alert">
            <div className="flex items-center gap-3"><VerdictBadge verdict={submissionResult.verdict} size="sm" /><ExecutionSummary submission={submissionResult} /></div>
            <button type="button" onClick={() => setResultDismissed(true)} className="text-slate-400 hover:text-slate-700" aria-label="Dismiss result">✕</button>
          </div>
        )}

        {submissionError && <div className="border-b border-rose-200 bg-rose-50 px-4 py-2 text-xs text-rose-700" role="alert">{submissionError}</div>}

        <div className="flex min-h-0 flex-1 overflow-hidden p-3 lg:p-4">
          <div className="flex w-full min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:flex-row">
            <aside className="w-full min-h-0 overflow-y-auto border-b border-slate-200 lg:w-5/12 lg:border-b-0 lg:border-r xl:w-2/5">
              <div className="space-y-7 p-5 sm:p-6">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">Problem Statement</p>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">{challenge.title}</h2>
                </div>
                <ChallengeDescription challenge={challenge} />
                <ChallengeConstraints constraints={challenge.constraints} />
              </div>
            </aside>

            <section className="flex min-h-0 w-full flex-1 flex-col bg-white">
              <EditorToolbar language={language} onLanguageChange={setLanguage} onRunCode={handleRunCode} onSubmit={() => setShowSubmitModal(true)} onReset={handleReset} isExecuting={isExecuting} isSubmitting={isSubmitting} />
              <div className="min-h-0 flex-1 overflow-hidden">
                <MonacoEditor language={language} code={code} onChange={setCode} height="100%" />
              </div>
              <div className="max-h-[34%] min-h-[180px] overflow-auto border-t border-slate-200 bg-white">
                <TestCasePanel testCases={challenge.sampleTestCases} executionResult={executionResult} executionError={executionError} isExecuting={isExecuting} />
              </div>
            </section>
          </div>
        </div>

        <ConfirmationModal
          isOpen={showSubmitModal}
          title="Submit Solution"
          message={`Are you sure you want to submit your ${language} solution for "${challenge.title}"? This will be evaluated against all test cases.`}
          confirmLabel="Submit"
          cancelLabel="Cancel"
          onConfirm={onSubmitConfirmed}
          onCancel={() => setShowSubmitModal(false)}
          isLoading={isSubmitting}
          variant="primary"
        />
      </div>
    </CodingChallengeErrorBoundary>
  );
};

export default ChallengeDetailsPage;
