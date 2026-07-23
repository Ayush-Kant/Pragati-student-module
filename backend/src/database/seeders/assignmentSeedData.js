export const assignmentSeedData = [
  {
    title: "React Dashboard Project",
    subject: "Frontend Development",
    dueDate: "2026-08-20",
    totalMarks: 100,
    status: "Open",
    description: "Build a responsive dashboard using React and Tailwind CSS.",
  },
  {
    title: "Node.js REST API",
    subject: "Backend Development",
    dueDate: "2026-08-25",
    totalMarks: 100,
    status: "Open",
    description: "Create a REST API with authentication and CRUD operations.",
  },
];

export const submissionSeedData = [
  {
    assignmentId: 1,
    studentId: 101,
    submittedAt: "2026-08-18T14:30:00Z",
    status: "Submitted",
    content: "Implemented the dashboard layout and connected sample data.",
    fileUrl: "https://example.com/submission-1.zip",
  },
];

export const feedbackSeedData = [
  {
    assignmentId: 1,
    studentId: 101,
    remarks: "Well structured implementation.",
    grade: "A",
  },
];

export const gradeSeedData = [
  {
    assignmentId: 1,
    studentId: 101,
    score: 92,
    remarks: "Excellent work and solid UI structure.",
  },
];

export const deadlineSeedData = [
  {
    assignmentId: 1,
    dueDate: "2026-08-20",
    status: "Open",
  },
  {
    assignmentId: 2,
    dueDate: "2026-08-25",
    status: "Open",
  },
];

export default {
  assignmentSeedData,
  submissionSeedData,
  feedbackSeedData,
  gradeSeedData,
  deadlineSeedData,
};
