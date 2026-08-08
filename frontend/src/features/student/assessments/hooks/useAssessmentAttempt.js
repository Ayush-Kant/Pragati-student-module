import { useState, useEffect, useRef, useCallback } from "react";

export const useAssessmentAttempt = (assessment, onSubmit) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);

  const answersRef = useRef(answers);
  answersRef.current = answers;

  const onSubmitRef = useRef(onSubmit);
  onSubmitRef.current = onSubmit;

  // Synchronize timeLeft when assessment loads asynchronously
  useEffect(() => {
    if (assessment?.durationMinutes) {
      setTimeLeft(assessment.durationMinutes * 60);
    }
  }, [assessment?.durationMinutes]);

  const handleSelectAnswer = (optionIndex) => {
    setAnswers((prev) => ({ ...prev, [currentIndex]: optionIndex }));
  };

  const submitTest = useCallback(() => {
    if (typeof onSubmitRef.current === "function") {
      onSubmitRef.current(answersRef.current);
    }
  }, []);

  // Stable timer effect without recreating interval on every second update
  useEffect(() => {
    if (timeLeft <= 0) return;

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
  }, [assessment?.id, submitTest]); // Runs on component setup or assessment change

  return {
    currentIndex,
    setCurrentIndex,
    answers,
    handleSelectAnswer,
    timeLeft,
    submitTest
  };
};