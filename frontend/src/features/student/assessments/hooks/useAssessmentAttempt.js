import { useCallback, useEffect, useRef, useState } from "react";
import { recordTabSwitch, saveAssessmentAnswer } from "../services/assessmentService";
import { isAnswerProvided } from "../utils/answerState";

const getTimeLeft = (attempt) => {
  if (!attempt?.expiresAt) return 0;
  return Math.max(0, Math.ceil((new Date(attempt.expiresAt).getTime() - Date.now()) / 1000));
};

export const useAssessmentAttempt = ({ assessment, attempt, onSubmit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState(() => attempt?.answers || {});
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(attempt));
  const [tabSwitchCount, setTabSwitchCount] = useState(() => Number(attempt?.tabSwitchCount || 0));
  const [savingQuestionId, setSavingQuestionId] = useState(null);
  const [saveError, setSaveError] = useState("");

  const answersRef = useRef(answers);
  const submittingRef = useRef(false);
  const expirySubmittedRef = useRef(false);
  answersRef.current = answers;

  const buildSubmissionAnswers = useCallback(() => {
    return (assessment?.questions || []).map((question) => ({
      questionId: question.id,
      answer: answersRef.current[String(question.id)] ?? null,
    }));
  }, [assessment?.questions]);

  const submitTest = useCallback(async (reason = "submitted") => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    try {
      await onSubmit?.(buildSubmissionAnswers(), reason, tabSwitchCount);
    } finally {
      submittingRef.current = false;
    }
  }, [buildSubmissionAnswers, onSubmit, tabSwitchCount]);

  useEffect(() => {
    setAnswers(attempt?.answers || {});
    setCurrentIndex(0);
    setTimeLeft(getTimeLeft(attempt));
    setTabSwitchCount(Number(attempt?.tabSwitchCount || 0));
    expirySubmittedRef.current = false;
  }, [attempt]);

  useEffect(() => {
    if (!attempt?.attemptId) return undefined;
    const tick = () => {
      const remaining = getTimeLeft(attempt);
      setTimeLeft(remaining);
      if (remaining <= 0 && !expirySubmittedRef.current) {
        expirySubmittedRef.current = true;
        void submitTest("timeout");
      }
    };
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [attempt, submitTest]);

  useEffect(() => {
    if (!attempt?.attemptId) return undefined;
    const handleVisibilityChange = () => {
      if (document.visibilityState !== "hidden") return;
      void recordTabSwitch(attempt.attemptId)
        .then((result) => setTabSwitchCount(Number(result?.tabSwitchCount || 0)))
        .catch(() => undefined);
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [attempt?.attemptId]);

  const handleChangeAnswer = useCallback((answer) => {
    const question = assessment?.questions?.[currentIndex];
    if (!question || !attempt?.attemptId) return;
    setSaveError("");
    setAnswers((prev) => {
      const next = { ...prev };
      if (isAnswerProvided(answer)) next[String(question.id)] = answer;
      else delete next[String(question.id)];
      return next;
    });
    setSavingQuestionId(question.id);
    void saveAssessmentAnswer(attempt.attemptId, question.id, answer)
      .catch((error) => setSaveError(error?.response?.data?.message || error?.message || "Answer could not be saved."))
      .finally(() => setSavingQuestionId(null));
  }, [assessment, attempt?.attemptId, currentIndex]);

  return {
    currentIndex,
    setCurrentIndex,
    answers,
    handleChangeAnswer,
    timeLeft,
    tabSwitchCount,
    submitTest,
    savingQuestionId,
    saveError,
  };
};
