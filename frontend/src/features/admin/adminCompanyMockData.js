export const mockCompanies = [
  {
    id: 1,
    name: "Google",
    logo: "https://tse4.mm.bing.net/th/id/OIP.HgH-NjiOdFOrkmwjsZCCfAHaHl?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    industry: "Software & Cloud Computing",
    location: "Mountain View, California, USA",
    size: 180000,
    status: "Approved",
    engagementScore: 95,
    description:
      "Google is a global technology company specializing in internet services, cloud computing, artificial intelligence, search engines, and digital advertising solutions.",
    totalJobs: 120,
    totalHires: 75,
    acceptanceRate: 82,
    website: "https://google.com",
    offerAcceptanceRate: 79,
    interviewToHireConversion: 45,
    averageResponseTime: "2.5 Days",
    activityLogs: [
      {
        id: 1,
        action: "Company Approved",
        actor: "Admin",
        timestamp: "2025-08-05 10:45 AM",
        
      },
      {
        id: 2,
        action: "Posted New Internship Drive",
        actor: "System",
        timestamp: "2025-08-06 03:15 PM",
      }
    ],

    activeDrives: [
      {
        id: 1,
        title: "SDE Intern Hiring",
        status: "active",
        startDate: "2025-08-01",
        endDate: "2025-08-30",
      },
      {
        id: 2,
        title: "Cloud Engineer Drive",
        status: "active",
        startDate: "2025-08-01",
        endDate: "2025-08-30",
      }
    ]
  },
  {
    id: 2,
    name: "Microsoft",
    logo: "https://static.vecteezy.com/system/resources/previews/028/339/965/original/microsoft-icon-logo-symbol-free-png.png",
    industry: "Software & AI",
    location: "Redmond, Washington, USA",
    size: 220000,
    status: "Approved",
    engagementScore: 92,
    description:
      "Microsoft develops software, cloud platforms, AI technologies, and enterprise solutions, serving businesses and consumers worldwide.",
    totalJobs: 105,
    totalHires: 68,
    acceptanceRate: 79,
    website: "https://amazon.com",
    offerAcceptanceRate: 80,
    interviewToHireConversion: 49,
    averageResponseTime: "1.3 Days",
    activityLogs: [
      {
        id: 1,
        action: "Company Approved",
        actor: "System",
        timestamp: "2025-08-06 03:15 PM",
      },
      {
        id: 2,
        action: "Posted AI Research Internship",
        actor: "Admin",
        timestamp: "2025-06-08 01:15 PM",
      }
    ],
    activeDrives: [
      {
        id: 1,
        title: "Software Engineer Intern",
        status: "active",
        startDate: "2025-06-01",
        endDate: "2025-06-25",
      },
      {
        id: 2,
        title: "AI/ML Internship Program",
        status: "active",
        startDate: "2025-08-01",
        endDate: "2025-08-30",
      }
    ]
  },
  {
    id: 3,
    name: "Amazon",
    logo: "https://tse1.mm.bing.net/th/id/OIP.douAQqLQCydHXDqsPfOcpwHaEK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    industry: "E-Commerce & Cloud",
    location: "Seattle, Washington, USA",
    size: 1500000,
    status: "Suspended",
    engagementScore: 88,
    description:
      "Amazon is a multinational company focused on e-commerce, cloud computing through AWS, logistics, digital streaming, and artificial intelligence services.",
    totalJobs: 140,
    totalHires: 90,
    acceptanceRate: 75,
    website: "https://amazon.com",
    offerAcceptanceRate: 75,
    interviewToHireConversion: 42,
    averageResponseTime: "2.3 Days",
    activityLogs: [
      {
        id: 1,
        action: "Company Suspended",
        actor: "System",
        timestamp: "2025-08-06 03:15 PM",
      },
      {
        id: 2,
        action: "Compliance Review Initiated",
        actor: "System",
        timestamp: "2025-08-06 03:15 PM",
      }
    ],
    activeDrives: [
      {
        id: 1,
        title: "Backend Engineer Hiring",
        status: "paused",
        startDate: "2025-08-11",
        endDate: "2025-09-11",
      }
    ],
  },
  {
    id: 4,
    name: "Meta",
    logo: "https://tse2.mm.bing.net/th/id/OIP.N6q1UQrBEZ2PVWg-HcjjyQHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    industry: "Social Media & AI",
    location: "Menlo Park, California, USA",
    size: 70000,
    status: "Pending",
    engagementScore: 84,
    description:
      "Meta builds social networking platforms, virtual reality technologies, AI systems, and digital communication products used by billions of people.",
    totalJobs: 60,
    totalHires: 35,
    acceptanceRate: 81,
    website: "https://amazon.com",
    offerAcceptanceRate: 70,
    interviewToHireConversion: 40,
    averageResponseTime: "2 Days",
    activityLogs: [
      {
        id: 1,
        action: "Company Registration Submitted",
        actor: "System",
        timestamp: "2025-08-06 03:15 PM",
      },
      {
        id: 2,
        action: "Awaiting Admin Approval",
        actor: "System",
        timestamp: "2025-08-06 03:15 PM",
      }
    ],
    activeDrives: [
      {
        id: 1,
        title: "Frontend Engineer Internship",
        status: "pending",
        startDate: "2025-08-01",
        endDate: "2025-08-30",
      }
    ]
  },
  {
    id: 5,
    name: "Netflix",
    logo: "https://tse1.mm.bing.net/th/id/OIP.6aZRRKRJwGJo3XFL24g5bgHaD4?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    industry: "Entertainment Technology",
    location: "Los Gatos, California, USA",
    size: 13000,
    status: "Rejected",
    engagementScore: 79,
    description:
      "Netflix is a leading streaming platform providing movies, TV shows, documentaries, and entertainment content to subscribers worldwide.",
    totalJobs: 40,
    totalHires: 18,
    acceptanceRate: 62,

    website: "https://amazon.com",
    offerAcceptanceRate: 95,
    interviewToHireConversion: 60,
    averageResponseTime: "5 Days",
    activityLogs: [
      {
        id: 1,
        action: "Application Rejected",
        actor: "Admin",
        timestamp: "2025-08-06 03:15 PM",
      },
      {
        id: 2,
        action: "Profile Review Completed",
        actor: "System",
        timestamp: "2025-08-06 03:15 PM",
      }
    ],
    activeDrives: []
  },
  {
    id: 6,
    name: "Adobe",
    logo: "https://tse4.mm.bing.net/th/id/OIP.MPHAVL52hadir7pe0HszoAHaEK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    industry: "Creative Software",
    location: "San Jose, California, USA",
    size: 30000,
    status: "Pending",
    engagementScore: 87,
    description:
      "Adobe creates industry-leading creative software, digital marketing tools, document management solutions, and cloud-based design platforms.",
    totalJobs: 72,
    totalHires: 44,
    acceptanceRate: 85,
    website: "https://amazon.com",
    offerAcceptanceRate: 50,
    interviewToHireConversion: 41,
    averageResponseTime: "3.3 Days",
    activityLogs: [
      {
        id: 1,
        action: "Company Registration Submitted",
        actor: "Admin",
        timestamp: "2025-08-06 03:15 PM",
      },
      {
        id: 2,
        action: "Documents Under Verification",
        actor: "Admin",
        timestamp: "2025-08-06 03:15 PM",
      }
    ],
    activeDrives: [
      {
        id: 1,
        title: "UI/UX Design Internship",
        status: "pending",
        startDate: "2025-08-01",
        endDate: "2025-08-30",
      },
      {
        id: 2,
        title: "Software Development Internship",
        status: "pending",
        startDate: "2025-08-01",
        endDate: "2025-08-30",
      }
    ]
  },
];