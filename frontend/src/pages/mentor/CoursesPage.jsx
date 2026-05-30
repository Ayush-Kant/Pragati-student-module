import React, { useState } from "react";
import { Download, Plus } from "lucide-react";
import CourseStatCards from "../../components/mentor/courses/CourseStatCards";
import CourseTable from "../../components/mentor/courses/CourseTable";
import { Link } from "react-router-dom";

const INITIAL_COURSES = [
  {
    id: 1,
    title: "JavaScript Fundamentals",
    description: "Learn basics from scratch",
    category: "Web Development",
    mentor: "Arjun Sharma",
    students: 124,
    status: "Published",
    image: "https://cdn-icons-png.flaticon.com/512/5968/5968292.png",
  },
  {
    id: 2,
    title: "Python for Beginners",
    description: "Comprehensive guide",
    category: "Data Science",
    mentor: "Neha Patel",
    students: 98,
    status: "Published",
    image: "https://cdn-icons-png.flaticon.com/512/5968/5968350.png",
  },
  {
    id: 3,
    title: "React.js Complete Guide",
    description: "Build modern web apps",
    category: "Web Development",
    mentor: "Riya Sharma",
    students: 156,
    status: "Published",
    image: "https://cdn-icons-png.flaticon.com/512/1126/1126012.png",
  },
  {
    id: 4,
    title: "UI/UX Design Principles",
    description: "Learn design guidelines",
    category: "Design",
    mentor: "Arjun Verma",
    students: 87,
    status: "Draft",
    image: "https://cdn-icons-png.flaticon.com/512/5968/5968705.png",
  },
  {
    id: 5,
    title: "SQL Database Management",
    description: "Master structured queries",
    category: "Data Science",
    mentor: "Neha Patel",
    students: 65,
    status: "Draft",
    image: "https://cdn-icons-png.flaticon.com/512/4248/4248443.png",
  },
];

export default function CoursesPage() {
  const [courses, setCourses] = useState(INITIAL_COURSES);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  // 1. Fully operational Native Data CSV Export Action Function
  const handleExportReport = () => {
    if (courses.length === 0) return alert("No course data to export!");

    const headers = ["ID", "Title", "Category", "Mentor", "Students", "Status"];
    const csvRows = [
      headers.join(","),
      ...courses.map(
        (c) =>
          `${c.id},"${c.title}","${c.category}","${c.mentor}",${c.students},"${c.status}"`,
      ),
    ];

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", "courses_report.csv");
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleArchive = (id) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "Archived" } : c)),
    );
  };

  // Reset pagination window when filters change to avoid empty view indexes
  const handleSetSearch = (val) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };
  const handleSetCategory = (val) => {
    setSelectedCategory(val);
    setCurrentPage(1);
  };
  const handleSetStatus = (val) => {
    setSelectedStatus(val);
    setCurrentPage(1);
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || course.category === selectedCategory;
    const matchesStatus =
      selectedStatus === "All" || course.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] p-2">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
          <p className="mt-1 text-gray-500">
            Manage and organize all courses in the platform.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Working Export Button */}
          <button
            onClick={handleExportReport}
            className="cursor-pointer flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <Download size={18} /> Export Report
          </button>

          <Link
            className="cursor-pointer flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
            to={"./create"}
          >
            <Plus size={18} /> Create New Course
          </Link>
        </div>
      </div>

      <CourseStatCards />

      <CourseTable
        courses={filteredCourses}
        searchQuery={searchQuery}
        setSearchQuery={handleSetSearch}
        selectedCategory={selectedCategory}
        setSelectedCategory={handleSetCategory}
        selectedStatus={selectedStatus}
        setSelectedStatus={handleSetStatus}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onArchive={handleArchive}
        onView={(id) => alert(`Viewing ID ${id}`)}
        onEdit={(id) => alert(`Editing ID ${id}`)}
      />
    </div>
  );
}
