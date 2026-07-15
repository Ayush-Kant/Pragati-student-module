export const departmentList = [
  {
    id: 1,
    name: "Computer Science Engineering",
    code: "CSE",
    hod: "Dr. Rajesh Kumar",
    totalCourses: 8,
    totalStudents: 420
  },
  {
    id: 2,
    name: "Information Technology",
    code: "IT",
    hod: "Dr. Anil Sharma",
    totalCourses: 6,
    totalStudents: 310
  }
];

export const courseList = [
  {
    id: 1,
    courseName: "Data Structures",
    courseCode: "CS201",
    credits: 4,
    semester: 3,
    department: "CSE"
  },
  {
    id: 2,
    courseName: "Database Management Systems",
    courseCode: "CS301",
    credits: 4,
    semester: 5,
    department: "CSE"
  }
];

export const departmentApiResponse = {
  success: true,
  data: {
    departments: departmentList,
    courses: courseList
  }
};