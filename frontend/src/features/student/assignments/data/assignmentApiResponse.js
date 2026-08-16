const assignmentApiResponse = {
  success: true,
  message: "Assignments fetched successfully",
  data: {
    assignments: [
      {
        id: "A001",
        title: "React Dashboard",
        subject: "Web Development",
        description: "Build a responsive dashboard using React.",
        dueDate: "2026-08-15",
        status: "pending",
        marks: 100,
        submissionStatus: "not_submitted",
      },
      {
        id: "A002",
        title: "Java DSA Assignment",
        subject: "Data Structures",
        description: "Solve the given array and string problems.",
        dueDate: "2026-08-18",
        status: "pending",
        marks: 100,
        submissionStatus: "not_submitted",
      },
      {
        id: "A003",
        title: "Database Design",
        subject: "Database Management",
        description: "Design a relational database schema.",
        dueDate: "2026-08-10",
        status: "completed",
        marks: 100,
        submissionStatus: "submitted",
      },
    ],
    total: 3,
  },
};

export default assignmentApiResponse;