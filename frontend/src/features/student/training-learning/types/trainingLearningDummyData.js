// trainingLearningDummyData.js
// SHARED dummy data for the Training & Learning module.
// Do NOT create additional dummy data files — extend this one.

export const trainingCourses = [
  {
    id: 1,
    title: "MERN Stack Development",
    category: "Web Development",
    level: "Intermediate",
    instructor: "John Doe",
    duration: "12 Weeks",
    progress: 65,
    status: "In Progress",
    thumbnail: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=600&q=80",
    description:
      "Build full-stack web applications with MongoDB, Express, React and Node.js through hands-on projects.",
    totalLessons: 40,
    completedLessons: 26,
    totalModules: 8,
    completedModules: 5,
    rating: 4.7,
    enrolledStudents: 320,
  },
  {
    id: 2,
    title: "Java Programming",
    category: "Programming",
    level: "Beginner",
    instructor: "Jane Smith",
    duration: "8 Weeks",
    progress: 100,
    status: "Completed",
    thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80",
    description:
      "Master Java fundamentals — OOP, collections, and exception handling — through guided exercises.",
    totalLessons: 24,
    completedLessons: 24,
    totalModules: 6,
    completedModules: 6,
    rating: 4.5,
    enrolledStudents: 512,
  },
  {
    id: 3,
    title: "Data Structures & Algorithms",
    category: "Programming",
    level: "Advanced",
    instructor: "Alan Turing",
    duration: "10 Weeks",
    progress: 20,
    status: "In Progress",
    thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80",
    description:
      "Deep dive into arrays, trees, graphs and dynamic programming with interview-style problems.",
    totalLessons: 30,
    completedLessons: 6,
    totalModules: 7,
    completedModules: 1,
    rating: 4.8,
    enrolledStudents: 210,
  },
  {
    id: 4,
    title: "UI/UX Design Fundamentals",
    category: "Design",
    level: "Beginner",
    instructor: "Emma Watson",
    duration: "6 Weeks",
    progress: 0,
    status: "Not Started",
    thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80",
    description:
      "Learn design thinking, wireframing and prototyping with Figma from the ground up.",
    totalLessons: 18,
    completedLessons: 0,
    totalModules: 5,
    completedModules: 0,
    rating: 4.4,
    enrolledStudents: 156,
  },
  {
    id: 5,
    title: "Cloud Computing with AWS",
    category: "Cloud & DevOps",
    level: "Intermediate",
    instructor: "Michael Chen",
    duration: "9 Weeks",
    progress: 45,
    status: "In Progress",
    thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80",
    description:
      "Get hands-on with EC2, S3, Lambda and IAM to design scalable cloud architectures.",
    totalLessons: 28,
    completedLessons: 13,
    totalModules: 7,
    completedModules: 3,
    rating: 4.6,
    enrolledStudents: 198,
  },
  {
    id: 6,
    title: "Python for Data Science",
    category: "Data Science",
    level: "Beginner",
    instructor: "Priya Nair",
    duration: "8 Weeks",
    progress: 0,
    status: "Not Started",
    thumbnail: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&q=80",
    description:
      "Learn NumPy, Pandas and Matplotlib to analyze and visualize real-world datasets.",
    totalLessons: 22,
    completedLessons: 0,
    totalModules: 6,
    completedModules: 0,
    rating: 4.3,
    enrolledStudents: 275,
  },
];

// Lessons keyed by courseId
export const trainingLessons = {
  1: [
    { id: 101, courseId: 1, moduleTitle: "Module 1: Foundations", title: "Introduction to MERN", type: "video", duration: "12:30", completed: true, videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
    { id: 102, courseId: 1, moduleTitle: "Module 1: Foundations", title: "Setting up Node & Express", type: "video", duration: "18:10", completed: true, videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
    { id: 103, courseId: 1, moduleTitle: "Module 2: Frontend with React", title: "React Components & Props", type: "video", duration: "22:45", completed: true, videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
    { id: 104, courseId: 1, moduleTitle: "Module 2: Frontend with React", title: "State & Hooks", type: "video", duration: "20:05", completed: false, videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
    { id: 105, courseId: 1, moduleTitle: "Module 3: MongoDB", title: "Schema Design Quiz", type: "quiz", duration: "10 Qs", completed: false, videoUrl: null },
  ],
  2: [
    { id: 201, courseId: 2, moduleTitle: "Module 1: Basics", title: "Java Syntax & Variables", type: "video", duration: "15:00", completed: true, videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
    { id: 202, courseId: 2, moduleTitle: "Module 1: Basics", title: "OOP Concepts", type: "reading", duration: "8 min read", completed: true, videoUrl: null },
  ],
  3: [
    { id: 301, courseId: 3, moduleTitle: "Module 1: Arrays & Strings", title: "Two Pointer Technique", type: "video", duration: "25:15", completed: true, videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
    { id: 302, courseId: 3, moduleTitle: "Module 1: Arrays & Strings", title: "Sliding Window Practice", type: "reading", duration: "10 min read", completed: false, videoUrl: null },
  ],
};

// Learning resources keyed by courseId
export const trainingResources = {
  1: [
    { id: 1001, courseId: 1, title: "MERN Stack Cheat Sheet", type: "pdf", size: "1.2 MB", url: "#" },
    { id: 1002, courseId: 1, title: "Express Routing Notes", type: "notes", size: "3 min read", url: "#" },
    { id: 1003, courseId: 1, title: "Starter Project Files", type: "zip", size: "4.8 MB", url: "#" },
    { id: 1004, courseId: 1, title: "MongoDB Official Docs", type: "link", size: "External", url: "#" },
  ],
  2: [
    { id: 2001, courseId: 2, title: "Java OOP Slides", type: "pdf", size: "980 KB", url: "#" },
  ],
  3: [
    { id: 3001, courseId: 3, title: "DSA Interview Question Bank", type: "doc", size: "2.1 MB", url: "#" },
  ],
};

export const learningStatistics = {
  totalCoursesEnrolled: 6,
  coursesCompleted: 1,
  coursesInProgress: 3,
  coursesNotStarted: 2,
  totalLessonsCompleted: 69,
  totalHoursLearned: 42,
  currentStreakDays: 5,
};

export const trainingLearningApiResponse = {
  success: true,
  data: {
    courses: trainingCourses,
    statistics: learningStatistics,
  },
};
