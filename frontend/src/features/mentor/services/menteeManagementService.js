import api from "../../../services/api";

const mockMentees = [
  { 
    id: 1, 
    name: "Rahul Sharma", 
    email: "rahul.s@example.com", 
    course: "MERN Stack", 
    batch: "Batch 12", 
    progress: 78, 
    attendance: "92%", 
    lastActive: "Today", 
    status: "ACTIVE" 
  },
  { 
    id: 2, 
    name: "Priya Singh", 
    email: "priya.s@example.com", 
    course: "Java Enterprise", 
    batch: "Batch 9", 
    progress: 45, 
    attendance: "80%", 
    lastActive: "Yesterday", 
    status: "AT RISK" 
  },
  {
    id: 3,
    name: "Kiran Kumar",
    email: "kiran.k@example.com",
    course: "Python Data Science",
    batch: "Batch 15",
    progress: 100,
    attendance: "99%",
    lastActive: "2 hrs ago",
    status: "COMPLETED"
  },
  {
    id: 4,
    name: "Amit Singh",
    email: "amit.s@example.com",
    course: "MERN Stack",
    batch: "Batch 12",
    progress: 12,
    attendance: "65%",
    lastActive: "5 days ago",
    status: "INACTIVE"
  }
];

const mockDrawerProfiles = {
  1: {
    name: "Rahul Sharma",
    role: "Frontend Developer Aspirant",
    phone: "+91 98765 43210",
    email: "rahul.s@example.com",
    joinDate: "Joined Jan 2026",
    batch: "Batch 12",
    overallProgress: 78,
    performance: {
      assignments: "18/20",
      projects: 3,
      certificates: 2
    },
    learningProgress: [
      { topic: "HTML Fundamentals", status: "COMPLETED" },
      { topic: "CSS & Modern Layouts", status: "COMPLETED" },
      { topic: "JavaScript Logic", status: "COMPLETED" },
      { topic: "React Framework", status: "IN PROGRESS" },
      { topic: "Node.js & Express", status: "PENDING" }
    ],
    recentActivity: [
      { action: "Submitted Assignment: React Hooks", time: "2 hours ago" },
      { action: "Completed quiz: JavaScript Essentials", time: "1 day ago" },
      { action: "Joined Batch 12 live session", time: "3 days ago" }
    ],
    notes: "Needs help in backend APIs and database schema design. Excellent communication skills..."
  },
  2: {
    name: "Priya Singh",
    role: "Java Backend Developer Aspirant",
    phone: "+91 98765 00001",
    email: "priya.s@example.com",
    joinDate: "Joined Nov 2025",
    batch: "Batch 9",
    overallProgress: 45,
    performance: {
      assignments: "10/20",
      projects: 1,
      certificates: 0
    },
    learningProgress: [
      { topic: "Java Syntax & Basics", status: "COMPLETED" },
      { topic: "Object Oriented Programming", status: "COMPLETED" },
      { topic: "Collections Framework", status: "IN PROGRESS" },
      { topic: "Spring Boot Introduction", status: "PENDING" },
      { topic: "Database Connectivity (JDBC/JPA)", status: "PENDING" }
    ],
    recentActivity: [
      { action: "Missed Assignment deadline: Collections", time: "Yesterday" },
      { action: "Logged in and viewed OOP slides", time: "3 days ago" },
      { action: "Booked 1-on-1 session with Mentor", time: "5 days ago" }
    ],
    notes: "Currently struggling with multi-threading and collections. Recommended additional reading material."
  },
  3: {
    name: "Kiran Kumar",
    role: "Data Analyst Aspirant",
    phone: "+91 91234 56789",
    email: "kiran.k@example.com",
    joinDate: "Joined Sep 2025",
    batch: "Batch 15",
    overallProgress: 100,
    performance: {
      assignments: "20/20",
      projects: 5,
      certificates: 4
    },
    learningProgress: [
      { topic: "Python Basics & Scripts", status: "COMPLETED" },
      { topic: "Pandas & Numpy Dataframes", status: "COMPLETED" },
      { topic: "Matplotlib & Seaborn Visuals", status: "COMPLETED" },
      { topic: "SQL for Data Science", status: "COMPLETED" },
      { topic: "Machine Learning Foundations", status: "COMPLETED" }
    ],
    recentActivity: [
      { action: "Completed course curriculum", time: "2 days ago" },
      { action: "Submitted Final Capstone Project", time: "5 days ago" },
      { action: "Received certificate of achievement", time: "1 week ago" }
    ],
    notes: "Outstanding performance! Highly self-motivated, ready for industry mock interviews."
  },
  4: {
    name: "Amit Singh",
    role: "Fullstack Developer Aspirant",
    phone: "+91 99887 76655",
    email: "amit.s@example.com",
    joinDate: "Joined Feb 2026",
    batch: "Batch 12",
    overallProgress: 12,
    performance: {
      assignments: "2/20",
      projects: 0,
      certificates: 0
    },
    learningProgress: [
      { topic: "Web Foundations & HTML", status: "IN PROGRESS" },
      { topic: "CSS Selectors & Styling", status: "PENDING" },
      { topic: "Responsive Layouts", status: "PENDING" },
      { topic: "Intro to Javascript", status: "PENDING" },
      { topic: "DOM Manipulation", status: "PENDING" }
    ],
    recentActivity: [
      { action: "Logged in briefly to view syllabus", time: "5 days ago" },
      { action: "Signed up for student portal", time: "2 weeks ago" }
    ],
    notes: "Highly inactive. Reached out multiple times, needs urgent counseling or batch adjustment."
  }
};

const mockStats = {
  total: 124,
  active: 97,
  completed: 18,
  urgent: 9
};

export const menteeManagementService = {
  getMentees: async () => {
    try {
      const response = await api.get("/v1/mentor/mentees");
      return response.data;
    } catch (error) {
      console.warn("⚠️ API getMentees failed, using fallback mock data:", error.message);
      return {
        stats: mockStats,
        students: mockMentees
      };
    }
  },

  getMenteeProfile: async (id) => {
    try {
      const response = await api.get(`/v1/mentor/mentees/${id}/profile`);
      return response.data;
    } catch (error) {
      console.warn(`⚠️ API getMenteeProfile for id ${id} failed, using fallback mock data:`, error.message);
      return mockDrawerProfiles[id] || mockDrawerProfiles[1];
    }
  },

  updateMenteeNotes: async (id, notes) => {
    try {
      const response = await api.put(`/v1/mentor/mentees/${id}/notes`, { notes });
      return response.data;
    } catch (error) {
      console.warn(`⚠️ API updateMenteeNotes for id ${id} failed, updating local mock store:`, error.message);
      if (mockDrawerProfiles[id]) {
        mockDrawerProfiles[id].notes = notes;
      }
      return { success: true, notes };
    }
  }
};
