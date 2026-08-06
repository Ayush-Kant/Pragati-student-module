export const dummyAssessments = [
  {
    id: "asm-101",
    title: "React & Modern JavaScript Fundamentals",
    description: "Evaluate your understanding of React hooks, state management, components, and ES6+ features.",
    category: "Frontend Development",
    durationMinutes: 45,
    totalQuestions: 5,
    totalMarks: 50,
    passingMarks: 30,
    status: "available",
    instructions: [
      "Ensure a stable internet connection before starting.",
      "Each question carries 10 marks.",
      "The timer will auto-submit your test when time expires.",
      "Do not refresh or switch tabs during the test."
    ],
    questions: [
      {
        id: "q1",
        text: "Which hook should be used to perform side effects in a functional component?",
        options: ["useState", "useEffect", "useContext", "useReducer"],
        correctOption: 1,
        explanation: "useEffect is specifically designed for side effects like data fetching or DOM subscriptions."
      },
      {
        id: "q2",
        text: "What is the primary purpose of useMemo?",
        options: [
          "To cache the result of a calculation between renders",
          "To mutate the DOM directly",
          "To manage global state",
          "To trigger re-renders on prop changes"
        ],
        correctOption: 0,
        explanation: "useMemo memoizes expensive calculations to avoid re-computation on every render."
      },
      {
        id: "q3",
        text: "Which keyword creates a block-scoped variable in JavaScript?",
        options: ["var", "let", "global", "extern"],
        correctOption: 1,
        explanation: "'let' and 'const' allow declaring block-scoped variables."
      },
      {
        id: "q4",
        text: "What does JSX stand for?",
        options: [
          "JavaScript XML",
          "Java Syntax Extension",
          "JavaScript Extended System",
          "JSON Structural Extension"
        ],
        correctOption: 0,
        explanation: "JSX stands for JavaScript XML, allowing HTML-like syntax inside JavaScript."
      },
      {
        id: "q5",
        text: "How do you pass data down to child components in React?",
        options: ["State", "Props", "Redux", "Context only"],
        correctOption: 1,
        explanation: "Props are the standard way to pass data from parent to child components."
      }
    ]
  },
  {
    id: "asm-102",
    title: "Data Structures & Algorithms Basics",
    description: "Test fundamental concepts in arrays, linked lists, stacks, queues, and time complexity.",
    category: "Computer Science",
    durationMinutes: 30,
    totalQuestions: 3,
    totalMarks: 30,
    passingMarks: 18,
    status: "completed",
    score: 20,
    completedAt: "2026-08-01T10:30:00.000Z"
  }
];

export const dummyHistory = [
  {
    attemptId: "att-801",
    assessmentId: "asm-102",
    title: "Data Structures & Algorithms Basics",
    score: 20,
    totalMarks: 30,
    percentage: 66.7,
    status: "passed",
    submittedAt: "2026-08-01T10:30:00.000Z",
    timeSpentMinutes: 22
  }
];