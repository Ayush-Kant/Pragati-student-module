const reactImage = "https://via.placeholder.com/400x200/FF6B35/FFFFFF?text=React+Fundamentals";
const nodeImage = "https://via.placeholder.com/400x200/14B8A6/FFFFFF?text=Node.js+API";
const pythonImage = "https://via.placeholder.com/400x200/FF6B35/FFFFFF?text=Python+Data";
const awsImage = "https://via.placeholder.com/400x200/14B8A6/FFFFFF?text=AWS+Cloud";
const dockerImage = "https://via.placeholder.com/400x200/FF6B35/FFFFFF?text=Docker";

const today = new Date("2026-07-27T00:00:00+05:30");
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const lastWeek = new Date(today);
lastWeek.setDate(lastWeek.getDate() - 7);
const twoDaysAgo = new Date(today);
twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

const formatDate = (date) => date.toISOString();

export const dummyModules = [
  {
    id: "react-fundamentals",
    title: "React Fundamentals",
    description:
      "Master the core concepts of React including components, JSX, state management, and hooks. Build modern user interfaces from scratch with hands-on projects.",
    category: "Frontend",
    level: "Beginner",
    duration: 360,
    progress: 0,
    image: reactImage,
    tags: ["react", "javascript", "frontend"],
    lastAccessed: formatDate(twoDaysAgo),
    prerequisites: ["HTML", "CSS", "JavaScript ES6+"],
    lessons: [
      {
        id: "react-intro",
        title: "Introduction to React",
        description:
          "Understand what React is, why it's so popular, and how the component-based architecture works.",
        duration: 45,
        isCompleted: false,
        contentPreview:
          "Learn about React's virtual DOM, unidirectional data flow, and how it compares to other frameworks.",
        resources: [
          {
            id: "react-res-1",
            type: "link",
            title: "React Official Documentation",
            url: "https://react.dev",
          },
          {
            id: "react-res-2",
            type: "video",
            title: "React in 100 Seconds",
            url: "https://www.youtube.com/watch?v=Tn6-PIq8EMU",
          },
        ],
      },
      {
        id: "react-jsx",
        title: "JSX Deep Dive",
        description:
          "Learn how to write JSX syntax, understand expressions, attributes, and how JSX gets transpiled.",
        duration: 40,
        isCompleted: false,
        contentPreview:
          "Explore JSX syntax rules, embedding JavaScript expressions, and working with props and children.",
        resources: [
          {
            id: "react-res-3",
            type: "document",
            title: "JSX In Depth",
            url: "https://react.dev/learn/writing-markup-with-jsx",
          },
        ],
      },
      {
        id: "react-components",
        title: "Components & Props",
        description:
          "Build reusable UI components and pass data between them using props.",
        duration: 60,
        isCompleted: false,
        contentPreview:
          "Understand functional vs class components, prop passing, prop validation, and component composition.",
        resources: [
          {
            id: "react-res-4",
            type: "link",
            title: "Components and Props",
            url: "https://react.dev/learn/your-first-component",
          },
          {
            id: "react-res-5",
            type: "pdf",
            title: "JSX Cheat Sheet",
            url: "https://react.dev/learn/installation",
          },
        ],
      },
      {
        id: "react-state",
        title: "State & Lifecycle",
        description:
          "Manage component state and understand the component lifecycle.",
        duration: 75,
        isCompleted: false,
        contentPreview:
          "Dive into useState hook, immutable state updates, and when to use state vs props.",
        resources: [
          {
            id: "react-res-6",
            type: "video",
            title: "React State Explained",
            url: "https://www.youtube.com/watch?v=I6ypD7qvEFU",
          },
        ],
      },
      {
        id: "react-hooks",
        title: "React Hooks",
        description:
          "Master useState, useEffect, useContext, and custom hooks.",
        duration: 90,
        isCompleted: false,
        contentPreview:
          "Simplify component logic with hooks. Learn the rules of hooks and build your first custom hook.",
        resources: [
          {
            id: "react-res-7",
            type: "link",
            title: "Hooks Reference",
            url: "https://react.dev/reference/react",
          },
          {
            id: "react-res-8",
            type: "video",
            title: "Hooks Full Course",
            url: "https://www.youtube.com/watch?v=bM26v5fNGKU",
          },
        ],
      },
    ],
  },
  {
    id: "nodejs-api",
    title: "Node.js API Development",
    description:
      "Build scalable and secure RESTful APIs using Node.js, Express.js, and MongoDB. Learn authentication, validation, error handling, and deployment.",
    category: "Backend",
    level: "Intermediate",
    duration: 480,
    progress: 25,
    image: nodeImage,
    tags: ["nodejs", "api", "backend"],
    lastAccessed: formatDate(yesterday),
    prerequisites: ["JavaScript ES6+", "HTTP Basics", "SQL Fundamentals"],
    lessons: [
      {
        id: "node-intro",
        title: "Node.js Overview",
        description:
          "Set up your Node.js environment and understand the event loop.",
        duration: 50,
        isCompleted: true,
        contentPreview:
          "Install Node.js, understand npm, and write your first server program.",
        resources: [
          {
            id: "node-res-1",
            type: "link",
            title: "Node.js Official Guide",
            url: "https://nodejs.org/en/docs",
          },
        ],
      },
      {
        id: "node-express",
        title: "Express.js Fundamentals",
        description:
          "Create routes, middleware, and handle requests and responses.",
        duration: 70,
        isCompleted: true,
        contentPreview:
          "Build a simple Express server, use routing, and explore built-in middleware.",
        resources: [
          {
            id: "node-res-2",
            type: "video",
            title: "Express Crash Course",
            url: "https://www.youtube.com/watch?v=SccSCucHJe4",
          },
        ],
      },
      {
        id: "node-mongodb",
        title: "MongoDB Integration",
        description:
          "Connect your API to MongoDB using Mongoose.",
        duration: 80,
        isCompleted: false,
        contentPreview:
          "Define schemas, create models, and perform CRUD operations.",
        resources: [
          {
            id: "node-res-3",
            type: "link",
            title: "Mongoose Documentation",
            url: "https://mongoosejs.com/docs/",
          },
        ],
      },
      {
        id: "node-auth",
        title: "Authentication & Authorization",
        description:
          "Implement JWT-based authentication and role-based access.",
        duration: 90,
        isCompleted: false,
        contentPreview:
          "Hash passwords with bcrypt, sign and verify JWTs, and protect routes.",
        resources: [
          {
            id: "node-res-4",
            type: "document",
            title: "JWT Best Practices",
            url: "https://jwt.io/introduction",
          },
          {
            id: "node-res-5",
            type: "video",
            title: "Auth in Node.js",
            url: "https://www.youtube.com/watch?v=mbsmi_G7g8U",
          },
        ],
      },
      {
        id: "node-validation",
        title: "Input Validation & Error Handling",
        description:
          "Use Joi or Zod to validate incoming data and handle errors gracefully.",
        duration: 60,
        isCompleted: false,
        contentPreview:
          "Create validation schemas, return consistent error responses, and centralize error handlers.",
        resources: [
          {
            id: "node-res-6",
            type: "link",
            title: "Express Error Handling",
            url: "https://expressjs.com/en/guide/error-handling.html",
          },
        ],
      },
      {
        id: "node-deployment",
        title: "Deployment & Production",
        description:
          "Deploy your API to services like Render, Railway, or AWS.",
        duration: 70,
        isCompleted: false,
        contentPreview:
          "Configure environment variables, use Docker, and set up CI/CD.",
        resources: [
          {
            id: "node-res-7",
            type: "pdf",
            title: "Deployment Checklist",
            url: "https://render.com/docs",
          },
        ],
      },
    ],
  },
  {
    id: "python-data-analysis",
    title: "Python Data Analysis",
    description:
      "Analyze and visualize data using Python, Pandas, NumPy, and Matplotlib. Derive actionable insights from real-world datasets.",
    category: "Database",
    level: "Beginner",
    duration: 300,
    progress: 50,
    image: pythonImage,
    tags: ["python", "data", "analytics"],
    lastAccessed: formatDate(today),
    prerequisites: ["Basic Python Programming", "High School Mathematics"],
    lessons: [
      {
        id: "py-pandas",
        title: "Pandas Basics",
        description:
          "Load, clean, and manipulate tabular data with Pandas.",
        duration: 60,
        isCompleted: true,
        contentPreview:
          "DataFrames, Series, indexing, filtering, and basic statistics.",
        resources: [
          {
            id: "py-res-1",
            type: "link",
            title: "Pandas Documentation",
            url: "https://pandas.pydata.org/docs/",
          },
        ],
      },
      {
        id: "py-numpy",
        title: "NumPy Arrays",
        description:
          "Efficient numerical computing with NumPy arrays and operations.",
        duration: 50,
        isCompleted: true,
        contentPreview:
          "Understand broadcasting, vectorization, and array manipulations.",
        resources: [
          {
            id: "py-res-2",
            type: "video",
            title: "NumPy Tutorial",
            url: "https://www.youtube.com/watch?v=QUT1VHiLmmI",
          },
        ],
      },
      {
        id: "py-visualization",
        title: "Data Visualization",
        description:
          "Create charts and plots using Matplotlib and Seaborn.",
        duration: 70,
        isCompleted: false,
        contentPreview:
          "Line charts, bar charts, histograms, and heatmaps.",
        resources: [
          {
            id: "py-res-3",
            type: "link",
            title: "Matplotlib Gallery",
            url: "https://matplotlib.org/stable/gallery/index.html",
          },
          {
            id: "py-res-4",
            type: "pdf",
            title: "Visualization Cheat Sheet",
            url: "https://seaborn.pydata.org/tutorial.html",
          },
        ],
      },
      {
        id: "py-analysis",
        title: "Exploratory Data Analysis",
        description:
          "Apply statistical methods to discover patterns in real datasets.",
        duration: 80,
        isCompleted: false,
        contentPreview:
          "Correlation analysis, outliers detection, and summary statistics.",
        resources: [
          {
            id: "py-res-5",
            type: "video",
            title: "EDA with Python",
            url: "https://www.youtube.com/watch?v=K8L6KVGG-7o",
          },
        ],
      },
    ],
  },
  {
    id: "aws-cloud",
    title: "AWS Cloud Basics",
    description:
      "Understand core AWS services including EC2, S3, RDS, and Lambda. Design scalable, resilient cloud architectures.",
    category: "Cloud",
    level: "Intermediate",
    duration: 420,
    progress: 75,
    image: awsImage,
    tags: ["aws", "cloud", "devops"],
    lastAccessed: formatDate(today),
    prerequisites: ["Basic Networking", "Command Line Proficiency", "Understanding of Virtualization"],
    lessons: [
      {
        id: "aws-intro",
        title: "AWS Overview",
        description:
          "Introduction to AWS global infrastructure and the console.",
        duration: 55,
        isCompleted: true,
        contentPreview:
          "Regions, Availability Zones, IAM basics, and billing alerts.",
        resources: [
          {
            id: "aws-res-1",
            type: "link",
            title: "AWS Getting Started",
            url: "https://aws.amazon.com/getting-started/",
          },
        ],
      },
      {
        id: "aws-ec2",
        title: "EC2 Instances",
        description:
          "Launch, configure, and manage virtual servers on EC2.",
        duration: 75,
        isCompleted: true,
        contentPreview:
          "Instance types, security groups, key pairs, and AMI customization.",
        resources: [
          {
            id: "aws-res-2",
            type: "video",
            title: "EC2 Beginner Tutorial",
            url: "https://www.youtube.com/watch?v=lb1_SVHwHOA",
          },
        ],
      },
      {
        id: "aws-s3",
        title: "S3 Storage",
        description:
          "Store and retrieve objects using S3 buckets and lifecycle policies.",
        duration: 60,
        isCompleted: true,
        contentPreview:
          "Buckets, objects, versioning, static websites, and permissions.",
        resources: [
          {
            id: "aws-res-3",
            type: "document",
            title: "S3 Developer Guide",
            url: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/",
          },
        ],
      },
      {
        id: "aws-lambda",
        title: "Serverless with Lambda",
        description:
          "Run code without provisioning servers using AWS Lambda.",
        duration: 90,
        isCompleted: true,
        contentPreview:
          "Functions, triggers, layers, environment variables, and Python/Node.js runtimes.",
        resources: [
          {
            id: "aws-res-4",
            type: "link",
            title: "Lambda Developer Guide",
            url: "https://docs.aws.amazon.com/lambda/latest/dg/",
          },
        ],
      },
      {
        id: "aws-rds",
        title: "RDS Databases",
        description:
          "Deploy and manage relational databases on AWS RDS.",
        duration: 115,
        isCompleted: false,
        contentPreview:
          "Engines, read replicas, backups, and Multi-AZ deployments.",
        resources: [
          {
            id: "aws-res-5",
            type: "video",
            title: "RDS Tutorial",
            url: "https://www.youtube.com/watch?v=yAEBSwVwfzE",
          },
          {
            id: "aws-res-6",
            type: "pdf",
            title: "RDS Best Practices",
            url: "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/",
          },
        ],
      },
    ],
  },
  {
    id: "docker-containers",
    title: "Docker Containerization",
    description:
      "Package applications into containers using Docker. Master Dockerfiles, Compose, networking, volumes, and production best practices.",
    category: "DevOps",
    level: "Advanced",
    duration: 540,
    progress: 100,
    image: dockerImage,
    tags: ["docker", "containers", "devops"],
    lastAccessed: formatDate(lastWeek),
    prerequisites: ["Linux Command Line", "Networking Basics", "Git Proficiency"],
    lessons: [
      {
        id: "docker-intro",
        title: "Introduction to Containers",
        description:
          "Understand containers vs virtual machines and when to use Docker.",
        duration: 45,
        isCompleted: true,
        contentPreview:
          "Containerization concepts, Docker architecture, and installation.",
        resources: [
          {
            id: "docker-res-1",
            type: "video",
            title: "Docker Overview",
            url: "https://www.youtube.com/watch?v=fTkvn-ZR6lc",
          },
        ],
      },
      {
        id: "docker-images",
        title: "Docker Images",
        description:
          "Create optimized Docker images with multi-stage builds.",
        duration: 80,
        isCompleted: true,
        contentPreview:
          "Dockerfile instructions, layering, caching, and image best practices.",
        resources: [
          {
            id: "docker-res-2",
            type: "link",
            title: "Dockerfile Reference",
            url: "https://docs.docker.com/engine/reference/builder/",
          },
        ],
      },
      {
        id: "docker-compose",
        title: "Docker Compose",
        description:
          "Orchestrate multiple containers with Compose files.",
        duration: 70,
        isCompleted: true,
        contentPreview:
          "Services, networks, volumes, environment variables, and scaling.",
        resources: [
          {
            id: "docker-res-3",
            type: "document",
            title: "Compose Specification",
            url: "https://docs.docker.com/compose/compose-file/",
          },
        ],
      },
      {
        id: "docker-volumes",
        title: "Volumes & Storage",
        description:
          "Persist data with bind mounts, volumes, and tmpfs mounts.",
        duration: 65,
        isCompleted: true,
        contentPreview:
          "Storage drivers, named volumes, anonymous volumes, and backup strategies.",
        resources: [
          {
            id: "docker-res-4",
            type: "link",
            title: "Manage Data in Docker",
            url: "https://docs.docker.com/storage/",
          },
        ],
      },
      {
        id: "docker-networking",
        title: "Networking",
        description:
          "Configure container-to-container communication and expose ports.",
        duration: 75,
        isCompleted: true,
        contentPreview:
          "Bridge networks, host networks, DNS resolution, and port mapping.",
        resources: [
          {
            id: "docker-res-5",
            type: "video",
            title: "Docker Networking",
            url: "https://www.youtube.com/watch?v=nTg4CeiSrxE",
          },
        ],
      },
      {
        id: "docker-security",
        title: "Security & Best Practices",
        description:
          "Secure containers with non-root users, scanning, and secrets.",
        duration: 90,
        isCompleted: true,
        contentPreview:
          "Image hardening, secret management, read-only filesystems, and vulnerability scanning.",
        resources: [
          {
            id: "docker-res-6",
            type: "pdf",
            title: "Docker Security Cheat Sheet",
            url: "https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html",
          },
        ],
      },
      {
        id: "docker-production",
        title: "Production Deployment",
        description:
          "Deploy containerized applications to production environments.",
        duration: 115,
        isCompleted: true,
        contentPreview:
          "Health checks, logging, monitoring, and rolling deployments.",
        resources: [
          {
            id: "docker-res-7",
            type: "link",
            title: "Docker Swarm Mode",
            url: "https://docs.docker.com/engine/swarm/",
          },
          {
            id: "docker-res-8",
            type: "video",
            title: "Docker in Production",
            url: "https://www.youtube.com/watch?v=J9p_Sbcw_wA",
          },
        ],
      },
    ],
  },
];
