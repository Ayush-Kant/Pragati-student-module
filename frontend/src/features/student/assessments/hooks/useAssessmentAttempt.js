import { useCallback, useEffect, useRef, useState } from "react";
import { recordTabSwitch, saveAssessmentAnswer } from "../services/assessmentService";

const getInitialTimeLeft = (attempt) => {
  if (!attempt?.expiresAt) return 0;
  return Math.max(0, Math.floor((new Date(attempt.expiresAt).getTime() - Date.now()) / 1000));
};

export const useAssessmentAttempt = ({ assessment, attempt, onSubmit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState(() => attempt?.answers || {});
  const [timeLeft, setTimeLeft] = useState(() => getInitialTimeLeft(attempt));
  const [savingQuestionId, setSavingQuestionId] = useState(null);

  const answersRef = useRef(answers);
  const submittingRef = useRef(false);
  answersRef.current = answers;

  const submitTest = useCallback(
    async (reason = "submitted") => {
      if (submittingRef.current) return;
      submittingRef.current = true;
      try {
        await onSubmit?.(answersRef.current, reason);
      } finally {
        submittingRef.current = false;
      }
    },
    [onSubmit],
  );

  useEffect(() => {
    setAnswers(attempt?.answers || {});
    setCurrentIndex(0);
    setTimeLeft(getInitialTimeLeft(attempt));
  }, [attempt]);

  useEffect(() => {
    if (!attempt?.expiresAt || !attempt?.attemptId) return undefined;

    const tick = () => {
      const remaining = getInitialTimeLeft(attempt);
      setTimeLeft(remaining);
      if (remaining <= 0) {
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
      if (document.visibilityState === "visible") return;
      void recordTabSwitch(attempt.attemptId).catch(() => undefined);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [attempt?.attemptId]);

  const handleSelectAnswer = useCallback(
    (optionIndex) => {
      const question = assessment?.questions?.[currentIndex];
      if (!question || !attempt?.attemptId) return;

      const answer = { optionIndex };
      setAnswers((prev) => ({ ...prev, [currentIndex]: answer }));
      setSavingQuestionId(question.id);
      void saveAssessmentAnswer(attempt.attemptId, question.id, answer)
        .catch(() => undefined)
        .finally(() => setSavingQuestionId(null));
    },
    [assessment, attempt?.attemptId, currentIndex],
  );

  return {
    currentIndex,
    setCurrentIndex,
    answers,
    handleSelectAnswer,
    timeLeft,
    submitTest,
    savingQuestionId,
  };
};
