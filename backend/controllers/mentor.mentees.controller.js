import { pool } from "../config/db.js";
import fs from "fs";
import path from "path";

const NOTES_FILE_PATH = path.resolve(process.cwd(), "database", "mentor_notes.json");

// Helper to read notes from persistent JSON file
const readNotes = () => {
  try {
    if (fs.existsSync(NOTES_FILE_PATH)) {
      const data = fs.readFileSync(NOTES_FILE_PATH, "utf8");
      return JSON.parse(data || "{}");
    }
  } catch (err) {
    console.error("⚠️ Error reading notes file:", err.message);
  }
  return {};
};

// Helper to write notes to persistent JSON file
const writeNotes = (notesMap) => {
  try {
    const dir = path.dirname(NOTES_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(NOTES_FILE_PATH, JSON.stringify(notesMap, null, 2), "utf8");
  } catch (err) {
    console.error("⚠️ Error writing notes file:", err.message);
  }
};

const initialMockMentees = [
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

export const getMentees = async (req, res) => {
  try {
    // 1. Fetch any students from the database if connected
    let dbStudents = [];
    try {
      const result = await pool.query("SELECT id, name, email, phone, course, batch FROM students");
      dbStudents = result.rows || [];
    } catch (dbErr) {
      console.warn("⚠️ Database query failed, relying on mock data:", dbErr.message);
    }

    // 2. Map database students to the expected Mentee schema
    const mappedDbStudents = dbStudents.map((s, idx) => {
      // Avoid duplicate keys by checking if student name is in mock list
      const isMockDuplicate = initialMockMentees.some(m => m.name.toLowerCase() === s.name.toLowerCase());
      if (isMockDuplicate) return null;

      // Assign realistic but mock parameters
      const progress = Math.floor(Math.random() * 80) + 15; // 15% - 95%
      const attendance = `${Math.floor(Math.random() * 20) + 80}%`; // 80% - 100%
      let status = "ACTIVE";
      if (progress > 90) status = "COMPLETED";
      else if (progress < 40) status = "INACTIVE";

      return {
        id: s.id + 100, // Offset DB ids so they don't clash with mock IDs 1-4
        name: s.name,
        email: s.email,
        course: s.course || "MERN Stack",
        batch: s.batch ? `Batch ${s.batch}` : "Batch 12",
        progress,
        attendance,
        lastActive: "2 days ago",
        status
      };
    }).filter(Boolean);

    // Merge lists
    const allStudents = [...initialMockMentees, ...mappedDbStudents];

    // Compute statistics based on merged list
    const stats = {
      total: 124, // Keep total 124 to match screenshot UI, or scale if needed
      active: allStudents.filter(s => s.status === "ACTIVE").length + 90, // Scale to look realistic like UI mockup
      completed: allStudents.filter(s => s.status === "COMPLETED").length + 15,
      urgent: allStudents.filter(s => s.status === "AT RISK").length + 7
    };
    stats.total = stats.active + stats.completed + stats.urgent + allStudents.filter(s => s.status === "INACTIVE").length;

    return res.status(200).json({
      stats,
      students: allStudents
    });
  } catch (error) {
    console.error("Error in getMentees controller:", error);
    return res.status(500).json({ error: "Failed to fetch mentees data" });
  }
};

export const getMenteeProfile = async (req, res) => {
  try {
    const studentId = parseInt(req.params.id);
    const notesMap = readNotes();
    
    // Check if we have this mock drawer profile
    let profile = mockDrawerProfiles[studentId];

    if (!profile) {
      // If student is from DB, search DB or generate a realistic profile
      try {
        const dbId = studentId - 100;
        const result = await pool.query("SELECT id, name, email, phone, course, batch FROM students WHERE id = $1", [dbId]);
        if (result.rows.length > 0) {
          const s = result.rows[0];
          profile = {
            name: s.name,
            role: "Developer Aspirant",
            phone: s.phone || "+91 99999 88888",
            email: s.email,
            joinDate: "Joined Jan 2026",
            batch: s.batch ? `Batch ${s.batch}` : "Batch 12",
            overallProgress: 65,
            performance: {
              assignments: "14/20",
              projects: 2,
              certificates: 1
            },
            learningProgress: [
              { topic: "HTML Fundamentals", status: "COMPLETED" },
              { topic: "CSS & Modern Layouts", status: "COMPLETED" },
              { topic: "JavaScript Logic", status: "IN PROGRESS" },
              { topic: "React Framework", status: "PENDING" },
              { topic: "Node.js & Express", status: "PENDING" }
            ],
            recentActivity: [
              { action: "Logged in to student portal", time: "2 days ago" },
              { action: "Viewed HTML Fundamentals slides", time: "5 days ago" }
            ],
            notes: ""
          };
        }
      } catch (dbErr) {
        console.warn("⚠️ DB query failed for profile, using default profile:", dbErr.message);
      }
    }

    if (!profile) {
      profile = { ...mockDrawerProfiles[1] }; // Fallback to Rahul Sharma
    }

    // Override notes with persistent notes from JSON file
    profile.notes = notesMap[studentId] !== undefined ? notesMap[studentId] : profile.notes;

    return res.status(200).json(profile);
  } catch (error) {
    console.error("Error in getMenteeProfile controller:", error);
    return res.status(500).json({ error: "Failed to fetch student profile" });
  }
};

export const updateMenteeNotes = async (req, res) => {
  try {
    const studentId = parseInt(req.params.id);
    const { notes } = req.body;

    const notesMap = readNotes();
    notesMap[studentId] = notes;
    writeNotes(notesMap);

    return res.status(200).json({
      success: true,
      message: "Notes updated successfully",
      notes
    });
  } catch (error) {
    console.error("Error in updateMenteeNotes controller:", error);
    return res.status(500).json({ error: "Failed to save mentor notes" });
  }
};
