import { useEffect, useState } from "react";

const mockAssessment = {
  id: "assess_401",
  title: "Python Basics Q1",
  type: "MCQ",
  difficulty: "Easy",
  timeLimitMinutes: 30,
  totalMarks: 50,
  status: "active",
  questions: [
    {
      id: "q_001",
      type: "MCQ",
      text: "What is a Python list?",
      options: [
        "Mutable sequence",
        "Immutable sequence",
        "Dictionary",
        "Set",
      ],
      correctOption: 0,
      marks: 2,
    },
    {
      id: "q_002",
      type: "Coding",
      problemStatement: "Print Hello World",
      languages: ["Python", "Java", "C++"],
      sampleInput: "None",
      sampleOutput: "Hello World",
      marks: 10,
    },
  ],
};

export default function useAssessmentDetail(id) {
  const [assessment, setAssessment] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      if (id === mockAssessment.id) {
        setAssessment(mockAssessment);
      } else {
        setAssessment(null);
      }

      setLoading(false);
    }, 500);

    return () =>
      clearTimeout(timer);
  }, [id]);

  return {
    assessment,
    loading,
  };
}