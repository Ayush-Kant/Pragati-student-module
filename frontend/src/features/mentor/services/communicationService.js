import api from "../../../services/api";

// Rich Mock Data for Offline/Preview Mode
const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    title: "New Assignment Submission",
    message: "Riya Sharma submitted Assignment 3: Advanced UI Prototypes.",
    type: "alert", // alert (red), warning (yellow), success (green), info (blue)
    time: "2 mins ago",
    read: false,
    category: "Assignment",
    actionLink: "/mentor/question-bank/attempts"
  },
  {
    id: 2,
    title: "Student Question on Forum",
    message: "Anonymous Student asked a question in 'Assignment 3 Discussion - Q5 Ambiguity'.",
    type: "warning",
    time: "30 mins ago",
    read: false,
    category: "Forum",
    actionLink: "/mentor/discussion"
  },
  {
    id: 3,
    title: "Session Booked by John Doe",
    message: "Doubt clearing session booked for Monday, 10:30 AM.",
    type: "success",
    time: "2 hours ago",
    read: true,
    category: "Sessions",
    actionLink: "/mentor/slots"
  },
  {
    id: 4,
    title: "System Update: New Rubrics Available",
    message: "You can now assign predefined grading rubrics to student projects.",
    type: "info",
    time: "1 day ago",
    read: true,
    category: "System",
    actionLink: "/mentor/dashboard"
  }
];

const MOCK_THREADS = [
  {
    id: "thread-1",
    title: "Assignment 3 Discussion - Q5 Ambiguity",
    category: "Assignments",
    startedBy: "Anonymous Student",
    startedAt: "Oct 24, 2023, 10:30 AM",
    timeAgo: "2h ago",
    repliesCount: 2,
    description: "This thread is for discussing challenges and solutions regarding Assignment 3, specifically focusing on Question 5 which has caused some confusion.",
    posts: [
      {
        id: "post-1",
        author: "Anonymous Student",
        isAnonymous: true,
        time: "Today at 10:30 AM",
        content: "How do we solve Question 5? The dataset provided seems to be missing the 'target' column mentioned in the problem description. Am I missing something obvious, or is there an error in the provided CSV?",
        votes: 2,
        voted: null // 'up', 'down', or null
      },
      {
        id: "post-2",
        author: "John",
        isMentor: false,
        time: "Today at 11:15 AM",
        content: "Here is the explanation... The instructor mentioned in the last lecture that we are supposed to derive the target column by combining the 'feature_A' and 'feature_B' columns using a specific formula. Check slide 24 of the week 3 presentation for the exact formula.",
        codeBlock: "target = (feature_A * 0.4) + (feature_B * 0.6)",
        votes: 5,
        voted: null
      },
      {
        id: "post-3",
        author: "Dr. Jane Smith",
        isMentor: true,
        time: "Today at 12:00 PM",
        content: "I'll update the instructions on the assignment portal to make this clear. The formula John mentioned is indeed the correct one. Please proceed with that.",
        votes: 4,
        voted: null
      }
    ]
  },
  {
    id: "thread-2",
    title: "Final Project Submission Guidelines Clarification",
    category: "Projects",
    startedBy: "John Doe",
    startedAt: "Oct 23, 2023, 09:15 AM",
    timeAgo: "1d ago",
    repliesCount: 5,
    description: "Requesting details on format requirements (PDF vs Presentation) and codebase submission zip limits.",
    posts: [
      {
        id: "t2-p1",
        author: "John Doe",
        isAnonymous: false,
        time: "Yesterday at 9:15 AM",
        content: "Should we submit the final project slides in PDF format or PowerPoint? Also, is there a size limit for the ZIP file of our codebase on the submission portal?",
        votes: 3,
        voted: null
      },
      {
        id: "t2-p2",
        author: "Dr. Jane Smith",
        isMentor: true,
        time: "Yesterday at 2:00 PM",
        content: "Please submit slides in PDF format. Codebase ZIP should be under 50MB. Make sure to exclude node_modules or virtual environments.",
        votes: 6,
        voted: null
      }
    ]
  },
  {
    id: "thread-3",
    title: "Welcome to the new batch! Introduce yourselves here.",
    category: "General",
    startedBy: "Dr. Jane Smith",
    startedAt: "Oct 21, 2023, 11:00 AM",
    timeAgo: "3d ago",
    repliesCount: 45,
    description: "Welcome to the Mentorship program! Feel free to introduce yourselves, share your background, and outline your goals.",
    posts: [
      {
        id: "t3-p1",
        author: "Dr. Jane Smith",
        isMentor: true,
        time: "3 days ago",
        content: "Hello everyone! Welcome to the new batch. I'm Jane, your senior mentor. Let's use this thread to break the ice. Share where you're from and what you hope to achieve during this program!",
        votes: 12,
        voted: null
      }
    ]
  },
  {
    id: "thread-4",
    title: "Quiz 2 Syllabus and Practice Questions",
    category: "Quizzes",
    startedBy: "Assistant Mentor",
    startedAt: "Oct 20, 2023, 02:00 PM",
    timeAgo: "4d ago",
    repliesCount: 1,
    description: "Syllabus details for Quiz 2 covering React hooks, state management, and routing.",
    posts: [
      {
        id: "t4-p1",
        author: "Assistant Mentor",
        isMentor: true,
        time: "4 days ago",
        content: "Quiz 2 will happen this Friday. It will cover: 1. React useEffect hooks, 2. Context API & Custom Hooks, 3. React Router v6/v7 navigation. Good luck!",
        votes: 8,
        voted: null
      }
    ]
  }
];

export const communicationService = {
  // 1. Fetch mentor notifications
  getNotifications: async () => {
    try {
      const response = await api.get("/v1/notifications");
      return response.data;
    } catch (error) {
      console.warn("API notifications call failed, falling back to mock data:", error.message);
      return MOCK_NOTIFICATIONS;
    }
  },

  // 2. Send custom notification to students
  sendNotification: async (notificationData) => {
    try {
      const response = await api.post("/v1/notifications/send", notificationData);
      return response.data;
    } catch (error) {
      console.warn("API sendNotification call failed, running locally:", error.message);
      // Simulate backend generation
      return {
        id: Date.now(),
        ...notificationData,
        time: "Just now",
        read: false
      };
    }
  },

  // 3. Fetch discussion threads by category
  getThreads: async (category) => {
    try {
      const response = await api.get("/v1/forum/threads", {
        params: { category: category !== "All" ? category : undefined }
      });
      return response.data;
    } catch (error) {
      console.warn("API getThreads call failed, falling back to mock data:", error.message);
      if (category && category !== "All") {
        return MOCK_THREADS.filter(t => t.category.toLowerCase() === category.toLowerCase());
      }
      return MOCK_THREADS;
    }
  },

  // 4. Submit a reply to a thread
  postReply: async (threadId, replyData) => {
    try {
      const response = await api.post(`/v1/forum/threads/${threadId}/reply`, replyData);
      return response.data;
    } catch (error) {
      console.warn("API postReply call failed, running locally:", error.message);
      return {
        id: `reply-${Date.now()}`,
        author: replyData.isAnonymous ? "Anonymous Student" : (replyData.author || "Mentor"),
        isAnonymous: replyData.isAnonymous || false,
        isMentor: !replyData.isAnonymous,
        time: "Just now",
        content: replyData.content,
        votes: 0,
        voted: null
      };
    }
  }
};
