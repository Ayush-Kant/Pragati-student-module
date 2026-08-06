export async function getHiringPipelineData() {
  return {
    settings: {
      minimumScore: 75,
      requiredSkills: [
        "React",
        "Node.js",
        "PostgreSQL",
        "Docker",
        "Git",
      ],
    },

    content: {
      courses: [
        {
          id: 1,
          title: "MERN Bootcamp",
          category: "Full-stack",
          required: true,
        },
        {
          id: 2,
          title: "Advanced React",
          category: "Frontend",
          required: true,
        },
        {
          id: 3,
          title: "Backend APIs",
          category: "Backend",
          required: true,
        },
        {
          id: 4,
          title: "Git Basics",
          category: "Version Control",
          required: false,
        },
      ],

      projects: [
        {
          id: 1,
          title: "E-Commerce Website",
          category: "Full Stack",
          required: true,
        },
        {
          id: 2,
          title: "Attendance Optimizer",
          category: "Algorithms",
          required: true,
        },
        {
          id: 3,
          title: "Mini Calculator",
          category: "JavaScript",
          required: false,
        },
      ],
    },

    readinessStudents: [
      {
        id: 1,
        name: "John Doe",
        track: "Computer Science",
        score: 91,
        status: "Eligible",
      },
      {
        id: 2,
        name: "Alex",
        track: "Data Science",
        score: 68,
        status: "Below Threshold",
      },
      {
        id: 3,
        name: "Sara",
        track: "Software Engineering",
        score: 84,
        status: "Eligible",
      },
    ],

    shortlistedCandidates: [
      {
        id: 1,
        name: "John Doe",
        score: 91,
        note: "Excellent React developer",
        status: "Visible to Companies",
      },
      {
        id: 2,
        name: "Sara",
        score: 88,
        note: "Strong backend skills",
        status: "Visible to Companies",
      },
    ],
  };
}