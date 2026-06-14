export const mockStudentDetail = {
    id: "stu_001",
    name: "Vedant Bende",
    email: "vedant@college.edu",
    college: {
        id: "col_001",
        name: "IIT Bombay",
    },
    skills: ["MERN", "Python", "Node.js"],
    gpa: 8.9,
    status: "verified",
    profileVerified: true,
};

export const mockProgress = {
    student: {
        id: "stu_001",
        name: "Vedant Bende",
    },
    drives: [
        {
            driveId: "drive_101",
            driveTitle: "MERN Batch 1",
            currentStage: "training",
            assessmentScore: 72,
            assignmentsSubmitted: 4,
            assignmentsTotal: 5,
            mentorFeedback:
                "Strong progress, needs work on Node.js async.",
        },
    ],
};