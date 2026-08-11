// liveSessionDummyData.js
// SHARED dummy data for the Live Sessions module.
// This is the ONLY dummy data file for this module — do not create additional ones.

export const liveSessions = [
  {
    id: 1,
    title: "Introduction to REST APIs",
    mentor: "Rahul Verma",
    category: "Web Development",
    startTime: "2026-08-05T10:00:00Z",
    endTime: "2026-08-05T11:00:00Z",
    status: "Upcoming",
    meetingLink: "https://meet.example.com/rest-apis-intro",
    description:
      "A hands-on walkthrough of designing and consuming RESTful APIs, covering routes, status codes, and authentication.",
    attendanceStatus: "Not Marked",
    recordingUrl: null,
  },
  {
    id: 2,
    title: "React State Management Deep Dive",
    mentor: "Ananya Iyer",
    category: "Web Development",
    startTime: "2026-08-03T15:00:00Z",
    endTime: "2026-08-03T16:15:00Z",
    status: "Live",
    meetingLink: "https://meet.example.com/react-state-mgmt",
    description:
      "Comparing useState, useReducer, and Context for managing state in growing React applications.",
    attendanceStatus: "Not Marked",
    recordingUrl: null,
  },
  {
    id: 3,
    title: "SQL Joins & Query Optimization",
    mentor: "Vikram Shah",
    category: "Databases",
    startTime: "2026-07-28T09:00:00Z",
    endTime: "2026-07-28T10:00:00Z",
    status: "Completed",
    meetingLink: "https://meet.example.com/sql-joins",
    description:
      "Covers INNER/LEFT/RIGHT joins, indexing strategy, and how to read a query execution plan.",
    attendanceStatus: "Present",
    recordingUrl: "https://cdn.example.com/recordings/sql-joins.mp4",
  },
  {
    id: 4,
    title: "Behavioral Interview Prep",
    mentor: "Sneha Reddy",
    category: "Career",
    startTime: "2026-07-25T13:00:00Z",
    endTime: "2026-07-25T14:00:00Z",
    status: "Completed",
    meetingLink: "https://meet.example.com/interview-prep",
    description:
      "Practice answering common behavioral interview questions using the STAR method.",
    attendanceStatus: "Absent",
    recordingUrl: "https://cdn.example.com/recordings/interview-prep.mp4",
  },
  {
    id: 5,
    title: "Intro to Cloud Deployment with AWS",
    mentor: "Karan Malhotra",
    category: "Cloud & DevOps",
    startTime: "2026-08-08T11:00:00Z",
    endTime: "2026-08-08T12:30:00Z",
    status: "Upcoming",
    meetingLink: "https://meet.example.com/aws-deploy-intro",
    description:
      "Deploying a simple Node.js app to AWS using EC2 and S3, with a look at basic IAM roles.",
    attendanceStatus: "Not Marked",
    recordingUrl: null,
  },
  {
    id: 6,
    title: "Git Branching Strategies for Teams",
    mentor: "Priya Nair",
    category: "Tools",
    startTime: "2026-07-20T09:30:00Z",
    endTime: "2026-07-20T10:30:00Z",
    status: "Completed",
    meetingLink: "https://meet.example.com/git-branching",
    description:
      "Trunk-based development vs. GitFlow, and how to keep feature branches from turning into merge nightmares.",
    attendanceStatus: "Present",
    recordingUrl: "https://cdn.example.com/recordings/git-branching.mp4",
  },
];

export const liveSessionApiResponse = {
  success: true,
  data: liveSessions,
};
