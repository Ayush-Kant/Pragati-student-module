export const assignments = [
  {
    id: 1,
    title: "React Dashboard Project",
    subject: "Frontend Development",
    dueDate: "2026-08-20",
    status: "Pending",
    marks: 100,
    submissionStatus: "Not Submitted",

    submissionHistory: [
      {
        id: 1,
        status: "Submitted",
        submittedAt: "2026-08-18",
        fileName: "react-dashboard.zip",
        notes: "Initial submission",
      },
    ],

    feedback: {
      instructor: "John Doe",
      comments:
        "Good implementation. Improve responsiveness for smaller screens.",
    },

    grades: [
      {
        marksObtained: 92,
        criteria: [
          {
            title: "Functionality",
            score: 40,
            total: 40,
          },
          {
            title: "UI Design",
            score: 28,
            total: 30,
          },
          {
            title: "Code Quality",
            score: 24,
            total: 30,
          },
        ],
        remarks: [
          "Well structured code.",
          "Good component separation.",
        ],
      },
    ],
  },

  {
    id: 2,
    title: "Node.js REST API",
    subject: "Backend Development",
    dueDate: "2026-08-15",
    status: "Completed",
    marks: 100,
    submissionStatus: "Submitted",

    submissionHistory: [
      {
        id: 1,
        status: "Submitted",
        submittedAt: "2026-08-14",
        fileName: "node-rest-api.zip",
        notes: "Final submission",
      },
    ],

    feedback: {
      instructor: "Jane Smith",
      comments:
        "Excellent API design. Improve validation for edge cases.",
    },

    grades: [
      {
        marksObtained: 96,
        criteria: [
          {
            title: "API Design",
            score: 40,
            total: 40,
          },
          {
            title: "Validation",
            score: 28,
            total: 30,
          },
          {
            title: "Documentation",
            score: 28,
            total: 30,
          },
        ],
        remarks: [
          "Excellent work.",
          "Very good documentation.",
        ],
      },
    ],
  },
];

export const assignmentApiResponse = {
  success: true,
  data: assignments,
};