import { useState, useEffect, useRef, useCallback } from "react";

export const useAssessmentAttempt = (assessment, onSubmit) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(
    assessment?.durationMinutes ? assessment.durationMinutes * 60 : 0
  );

  // Use refs to store the latest values of answers and onSubmit.
  // This prevents submitTest from changing on every state update,
  // which keeps the useEffect timer interval completely stable.
  const answersRef = useRef(answers);
  answersRef.current = answers;

  const onSubmitRef = useRef(onSubmit);
  onSubmitRef.current = onSubmit;

  const handleSelectAnswer = (optionIndex) => {
    setAnswers((prev) => ({ ...prev, [currentIndex]: optionIndex }));
  };

  // Memoized submit callback referencing current refs
  const submitTest = useCallback(() => {
    if (typeof onSubmitRef.current === "function") {
      onSubmitRef.current(answersRef.current);
    }
  }, []);

  useEffect(() => {
    if (!timeLeft || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          submitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, submitTest]);

  return {
    currentIndex,
    setCurrentIndex,
    answers,
    handleSelectAnswer,
    timeLeft,
    submitTest
  };
};