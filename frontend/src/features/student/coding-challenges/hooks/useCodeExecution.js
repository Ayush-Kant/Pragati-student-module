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
 * @param {string} challengeId
 * @param {object | null} challengeStarterCode - Map of language → starter code from challenge data.
 * @returns {{
 *   language: string,
 *   code: string,
 *   executionResult: object | null,
 *   submissionResult: object | null,
 *   isExecuting: boolean,
 *   isSubmitting: boolean,
 *   executionError: string | null,
 *   submissionError: string | null,
 *   setLanguage: Function,
 *   setCode: Function,
 *   handleRunCode: Function,
 *   handleSubmit: Function,
 *   handleReset: Function,
 *   clearExecutionResult: Function,
 * }}
 */
export function useCodeExecution(challengeId, challengeStarterCode = null) {
  const [language, setLanguageState] = useState(DEFAULT_LANGUAGE);
  const [executionResult, setExecutionResult] = useState(null);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [executionError, setExecutionError] = useState(null);
  const [submissionError, setSubmissionError] = useState(null);

  /**
   * Per-language code storage — preserves user code across language switches.
   * Keyed by language value; initialised with starter templates on demand.
   */
  const codeByLanguage = useRef({});

  /**
   * Get the current editor code.
   * Falls back to challenge-specific starter → global starter template.
   */
  const getCode = useCallback(
    (lang) => {
      if (codeByLanguage.current[lang] !== undefined) {
        return codeByLanguage.current[lang];
      }
      // Initialise from challenge starter code or global template
      const starter =
        (challengeStarterCode && challengeStarterCode[lang]) ||
        STARTER_TEMPLATES[lang] ||
        '';
      codeByLanguage.current[lang] = starter;
      return starter;
    },
    [challengeStarterCode]
  );

  // Issue 7 fix: useMemo prevents recomputing initialCode on every render.
  // useState only consumes this value once (on mount), so the computation
  // would otherwise be wasted work on subsequent renders.
  const initialCode = useMemo(
    () =>
      (challengeStarterCode && challengeStarterCode[DEFAULT_LANGUAGE]) ||
      STARTER_TEMPLATES[DEFAULT_LANGUAGE] ||
      '',
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [] // intentionally empty — initial value is only needed once
  );

  const [code, setCodeState] = useState(initialCode);

  /** Update code for the current language and propagate to state. */
  const setCode = useCallback(
    (newCode) => {
      codeByLanguage.current[language] = newCode;
      setCodeState(newCode);
    },
    [language]
  );

  /** Switch language, persisting current code and loading the new language's code. */
  const setLanguage = useCallback(
    (newLang) => {
      // Save current code before switching
      codeByLanguage.current[language] = code;
      setLanguageState(newLang);
      setCodeState(getCode(newLang));
      // Clear results when language changes
      setExecutionResult(null);
      setExecutionError(null);
    },
    [language, code, getCode]
  );

  /** Reset editor to the starter template for the current language. */
  const handleReset = useCallback(() => {
    const starter =
      (challengeStarterCode && challengeStarterCode[language]) ||
      STARTER_TEMPLATES[language] ||
      '';
    codeByLanguage.current[language] = starter;
    setCodeState(starter);
    setExecutionResult(null);
    setExecutionError(null);
  }, [language, challengeStarterCode]);

  /** Run code against sample test cases. */
  const handleRunCode = useCallback(async () => {
    const payload = { challengeId, language, code };
    const validation = validateExecutionRequest(payload);

    if (!validation.isValid) {
      setExecutionError(validation.errors.join(' '));
      return;
    }

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
    } catch {
      setExecutionError('Code execution failed. Please try again.');
    } finally {
      setIsExecuting(false);
    }
  }, [challengeId, language, code]);

  /** Submit solution for final evaluation. */
  const handleSubmit = useCallback(async () => {
    const payload = { challengeId, language, code };
    const validation = validateSubmissionRequest(payload);

    if (!validation.isValid) {
      setSubmissionError(validation.errors.join(' '));
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);
    setSubmissionResult(null);

    try {
      const result = await submitSolution(payload);
      if (result.success) {
        setSubmissionResult(result.data);
      } else {
        setSubmissionError(result.error);
      }
    } catch {
      setSubmissionError('Submission failed. Please try again.');
    } finally {
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
    setLanguage,
    setCode,
    handleRunCode,
    handleSubmit,
    handleReset,
    clearExecutionResult,
  };
}
