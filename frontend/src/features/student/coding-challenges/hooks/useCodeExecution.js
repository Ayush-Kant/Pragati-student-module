import { useCallback, useMemo, useRef, useState } from 'react';
import { executeCode, submitSolution } from '../services/codingChallengeService';
import {
  validateExecutionRequest,
  validateSubmissionRequest,
} from '../validations/codingChallengeValidation';
import {
  DEFAULT_LANGUAGE,
  STARTER_TEMPLATES,
} from '../constants/codingChallengeConstants';

/**
 * Manages the code editor state, language switching, code execution,
 * and solution submission for a single challenge.
 *
 * Safety features:
 * - `isExecuting` / `isSubmitting` flags prevent duplicate concurrent requests.
 * - In-flight ref guards against simultaneous clicks even before state updates.
 * - Execution and submission use independent loading flags so they can't overlap.
 *
 * @param {string} challengeId
 * @param {object | null} challengeStarterCode - Map of language → starter code from challenge data.
 */
export function useCodeExecution(challengeId, challengeStarterCode = null) {
  const [language, setLanguageState] = useState(DEFAULT_LANGUAGE);
  const [executionResult, setExecutionResult] = useState(null);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [executionError, setExecutionError] = useState(null);
  const [submissionError, setSubmissionError] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  const executingRef = useRef(false);
  const submittingRef = useRef(false);
  const codeByLanguage = useRef({});

  const getCode = useCallback(
    (lang) => {
      if (codeByLanguage.current[lang] !== undefined) return codeByLanguage.current[lang];
      const starter = (challengeStarterCode && challengeStarterCode[lang]) || STARTER_TEMPLATES[lang] || '';
      codeByLanguage.current[lang] = starter;
      return starter;
    },
    [challengeStarterCode],
  );

  const initialCode = useMemo(
    () => (challengeStarterCode && challengeStarterCode[DEFAULT_LANGUAGE]) || STARTER_TEMPLATES[DEFAULT_LANGUAGE] || '',
    // The starter is intentionally only used as the initial state value.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const [code, setCodeState] = useState(initialCode);

  const setCode = useCallback(
    (newCode) => {
      codeByLanguage.current[language] = newCode;
      setCodeState(newCode);
      setIsDirty(true);
    },
    [language],
  );

  const setLanguage = useCallback(
    (newLang) => {
      codeByLanguage.current[language] = code;
      setLanguageState(newLang);
      setCodeState(getCode(newLang));
      setExecutionResult(null);
      setExecutionError(null);
    },
    [language, code, getCode],
  );

  const handleReset = useCallback(() => {
    const starter = (challengeStarterCode && challengeStarterCode[language]) || STARTER_TEMPLATES[language] || '';
    codeByLanguage.current[language] = starter;
    setCodeState(starter);
    setExecutionResult(null);
    setExecutionError(null);
    setIsDirty(false);
  }, [language, challengeStarterCode]);

  const handleRunCode = useCallback(async () => {
    if (executingRef.current || submittingRef.current) return;

    const payload = { challengeId, language, code };
    const validation = validateExecutionRequest(payload);
    if (!validation.isValid) {
      setExecutionError(validation.errors.join(' '));
      return;
    }

    executingRef.current = true;
    setIsExecuting(true);
    setExecutionError(null);
    setExecutionResult(null);

    try {
      const result = await executeCode(payload);
      if (result.success) {
        setExecutionResult(result.data);
      } else {
        setExecutionError(result.error);
      }
    } catch (error) {
      setExecutionError(error?.response?.data?.message || error?.message || 'Code execution failed. Please try again.');
    } finally {
      executingRef.current = false;
      setIsExecuting(false);
    }
  }, [challengeId, language, code]);

  const handleSubmit = useCallback(async () => {
    if (submittingRef.current || executingRef.current) return;

    const payload = { challengeId, language, code };
    const validation = validateSubmissionRequest(payload);
    if (!validation.isValid) {
      setSubmissionError(validation.errors.join(' '));
      return;
    }

    submittingRef.current = true;
    setIsSubmitting(true);
    setSubmissionError(null);
    setSubmissionResult(null);

    try {
      const result = await submitSolution(payload);
      if (result.success) {
        setSubmissionResult(result.data);
        // Make the final submission visible in the same result panel used by
        // Run Code, including compiler/runtime diagnostics returned by Judge0.
        setExecutionResult(result.data);
        setExecutionError(null);
        setIsDirty(false);
      } else {
        setSubmissionError(result.error);
      }
    } catch (error) {
      setSubmissionError(error?.response?.data?.message || error?.message || 'Submission failed. Please try again.');
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  }, [challengeId, language, code]);

  const clearExecutionResult = useCallback(() => {
    setExecutionResult(null);
    setExecutionError(null);
  }, []);

  return {
    language,
    code,
    executionResult,
    submissionResult,
    isExecuting,
    isSubmitting,
    executionError,
    submissionError,
    isDirty,
    setLanguage,
    setCode,
    handleRunCode,
    handleSubmit,
    handleReset,
    clearExecutionResult,
  };
}
