export const studentProfile = {
  id: 1,
  name: "Rahul Sharma",
  enrollmentNo: "2023CS001",
  department: "Computer Science",
  course: "B.Tech",
  semester: 5,
  cgpa: 8.75,
  attendance: "92%",
  placementStatus: "Eligible"
};

export const academicPerformance = [
  {
    semester: 1,
    sgpa: 8.20
  },
  {
    semester: 2,
    sgpa: 8.65
  },
  {
    semester: 3,
    sgpa: 8.81
  }
];

export const placementHistory = [
  {
    company: "Google",
    status: "Interview Scheduled"
  }
];

export const studentProfileApiResponse = {
  success: true,
  data: {
    studentProfile,
    academicPerformance,
    placementHistory
  }
};
