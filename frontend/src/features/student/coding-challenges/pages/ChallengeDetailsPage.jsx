import { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useChallengeDetails } from '../hooks/useChallengeDetails';
import { useCodeExecution } from '../hooks/useCodeExecution';
import ChallengeHeader from '../components/challenge/ChallengeHeader';
import ChallengeDescription from '../components/challenge/ChallengeDescription';
import ChallengeConstraints from '../components/challenge/ChallengeConstraints';
import EditorToolbar from '../components/editor/EditorToolbar';
import MonacoEditor from '../components/editor/MonacoEditor';
import TestCasePanel from '../components/testcase/TestCasePanel';
import ConfirmationModal from '../components/common/ConfirmationModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorState from '../components/common/ErrorState';
import VerdictBadge from '../components/submission/VerdictBadge';
import ExecutionSummary from '../components/submission/ExecutionSummary';
import { VERDICT } from '../constants/codingChallengeConstants';

/**
 * Split-pane challenge details page.
 *
 * Layout:
 *   Left pane  — scrollable problem statement (description, constraints)
 *   Right pane — sticky editor toolbar + Monaco editor + collapsible test panel
 */
const ChallengeDetailsPage = () => {
  const { challengeId } = useParams();

  const { challenge, isLoading, error, refetch } = useChallengeDetails(challengeId);

  const {
    language,
    code,
    executionResult,
    submissionResult,
    isExecuting,
    isSubmitting,
    executionError,
    submissionError,
    setLanguage,
    setCode,
    handleRunCode,
    handleSubmit,
    handleReset,
  } = useCodeExecution(challengeId, challenge?.starterCode ?? null);

  const [showSubmitModal, setShowSubmitModal] = useState(false);
  // Issue 8 fix: derive banner visibility directly from submissionResult instead of
  // setting an independent boolean that can get out of sync with the actual result.
  const [resultDismissed, setResultDismissed] = useState(false);
  const showResultBanner = !!submissionResult && !resultDismissed;

  // Reset dismissed state when a new submission starts so the new result banner shows.
  const onSubmitConfirmed = useCallback(async () => {
    setShowSubmitModal(false);
    setResultDismissed(false);
    await handleSubmit();
  }, [handleSubmit]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <LoadingSpinner size="lg" label="Loading challenge…" />
      </div>
    );
  }

  if (error || !challenge) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <ErrorState error={error ?? 'Challenge not found.'} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#050505] text-gray-100 overflow-hidden">
      {/* Top header bar */}
      <ChallengeHeader challenge={challenge} />

      {/* Submission result banner */}
      {showResultBanner && submissionResult && (
        <div
          className={`flex items-center justify-between px-4 py-2 text-sm border-b ${
            submissionResult.verdict === VERDICT.ACCEPTED
              ? 'bg-teal-500/10 border-teal-500/30'
              : 'bg-red-500/10 border-red-500/30'
          }`}
          role="alert"
        >
          <div className="flex items-center gap-3">
            <VerdictBadge verdict={submissionResult.verdict} size="sm" />
            <ExecutionSummary submission={submissionResult} />
          </div>
          <button
            type="button"
            onClick={() => setResultDismissed(true)}
            className="text-gray-500 hover:text-gray-300 text-xs"
            aria-label="Dismiss result"
          >
            ✕
          </button>
        </div>
      )}

      {/* Submission error banner */}
      {submissionError && (
        <div className="px-4 py-2 text-xs text-red-400 bg-red-500/10 border-b border-red-500/30" role="alert">
          {submissionError}
        </div>
      )}

      {/* Main split pane */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── LEFT PANE: Problem statement ─────────────────────────────────── */}
        <div className="w-full lg:w-5/12 xl:w-2/5 flex flex-col border-r border-gray-800 overflow-hidden">
          <div className="flex-1 overflow-y-auto scrollbar-thin p-5 space-y-6">
            <ChallengeDescription challenge={challenge} />
            <ChallengeConstraints constraints={challenge.constraints} />
          </div>
        </div>

        {/* ── RIGHT PANE: Editor ───────────────────────────────────────────── */}
        <div className="hidden lg:flex lg:w-7/12 xl:w-3/5 flex-col overflow-hidden">
          {/* Sticky toolbar */}
          <EditorToolbar
            language={language}
            onLanguageChange={setLanguage}
            onRunCode={handleRunCode}
            onSubmit={() => setShowSubmitModal(true)}
            onReset={handleReset}
            isExecuting={isExecuting}
            isSubmitting={isSubmitting}
          />

          {/* Monaco editor grows to fill remaining space */}
          <div className="flex-1 overflow-hidden">
            <MonacoEditor
              language={language}
              code={code}
              onChange={setCode}
              height="100%"
            />
          </div>

          {/* Test case panel docked to bottom */}
          <TestCasePanel
            testCases={challenge.sampleTestCases}
            executionResult={executionResult}
            executionError={executionError}
            isExecuting={isExecuting}
          />
        </div>

        {/* Mobile: full-width editor below problem (stacked) */}
        <div className="flex lg:hidden flex-col w-full overflow-hidden">
          <EditorToolbar
            language={language}
            onLanguageChange={setLanguage}
            onRunCode={handleRunCode}
            onSubmit={() => setShowSubmitModal(true)}
            onReset={handleReset}
            isExecuting={isExecuting}
            isSubmitting={isSubmitting}
          />
          <div style={{ height: '40vh' }}>
            <MonacoEditor language={language} code={code} onChange={setCode} height="100%" />
          </div>
          <TestCasePanel
            testCases={challenge.sampleTestCases}
            executionResult={executionResult}
            executionError={executionError}
            isExecuting={isExecuting}
          />
        </div>
      </div>

      {/* Submit confirmation modal */}
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
  );
};

export default ChallengeDetailsPage;
