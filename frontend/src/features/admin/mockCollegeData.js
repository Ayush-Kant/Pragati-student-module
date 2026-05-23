export const mockColleges = [
  {
    collegeId: 1, name: "BITS Pilani", email: "admin@bits.ac.in",
    location: "Rajasthan", departments: ["CSE", "ECE", "MBA"],
    studentStrength: 5000, status: "approved", verifiedAt: "2025-03-01T10:00:00Z",
    rejectionReason:null, suspensionReason:null,
    stats:{
        totalStudentsEnrolled:320,
        totalSelected:160,
        activeDriveCount:4,
        participationRate:64.5,
        selectionRate:52.5,
        performanceRank:1
    }
  },
  {
    collegeId: 2, name: "NIT Trichy", email: "admin@nit.ac.in",
    location: "Tamil Nadu", departments: ["CSE", "Mech"],
    studentStrength: 3500, status: "pending", verifiedAt: null,
    rejectionReason:null, suspensionReason:null,
    stats:{
        totalStudentsEnrolled:320,
        totalSelected:142,
        activeDriveCount:3,
        participationRate:64.5,
        selectionRate:52.5,
        performanceRank:2
    }
  },
  {
    collegeId: 3, name: "VIT Vellore", email: "placements@vit.ac.in",
    location: "Tamil Nadu", departments: ["CSE", "ECE", "Civil"],
    studentStrength: 8000, status: "suspended", verifiedAt: null,
    rejectionReason:null, suspensionReason:"Placement reports were missing.",
    stats:{
        totalStudentsEnrolled:320,
        totalSelected:142,
        activeDriveCount:3,
        participationRate:64.5,
        selectionRate:52.5,
        performanceRank:2
    }
  },
  
];

export const mockRankings = [
  { rank: 1, collegeId: 1, name: "BITS Pilani", selectionRate: 52.5, participationRate: 71.0, totalSelected: 142 },
  { rank: 2, collegeId: 2, name: "NIT Trichy", selectionRate: 46.2, participationRate: 65.3, totalSelected: 98 },
  { rank: 3, collegeId: 3, name: "VIT Vellore", selectionRate: 42.2, participationRate: 58.1, totalSelected: 80 }
];

export const mockNeedsRecruitment = [

  {
    collegeId: 3,
    name: "VIT Vellore",
    email: "placements@vit.ac.in",
    studentStrength: 8000,
    lastDriveAt: "2025-01-10"
  },

  {
    collegeId: 2,
    name: "NIT Trichy",
    email: "admin@nit.ac.in",
    studentStrength: 3500,
    lastDriveAt: "2025-02-15"
  }

];