import React, { useState, useEffect } from "react";
import { Download, Plus } from "lucide-react";
import CourseStatCards from "../../components/mentor/courses/CourseStatCards";
import CourseTable from "../../components/mentor/courses/CourseTable";
import { Link } from "react-router-dom";
import { useCourses } from "../../hooks/useCourses.js";

export default function CoursesPage() {
  const { courses, loading, error, fetchCourses, handleArchiveCourse } =
    useCourses();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({});

  // Fetch courses on mount and when filters change
  useEffect(() => {
    fetchCourses(filters);
  }, [fetchCourses, filters]);

  // 1. Fully operational Native Data CSV Export Action Function
  const handleExportReport = () => {
    if (courses.length === 0) return alert("No course data to export!");

    const headers = ["ID", "Title", "Category", "Mentor", "Students", "Status"];
    const csvRows = [
      headers.join(","),
      ...courses.map(
        (c) =>
          `${c.courseId},"${c.title}","${c.category}","${c.mentor}",${c.students},"${c.status}"`,
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

  const handleArchive = async (id) => {
    try {
      await handleArchiveCourse(id);
      await fetchCourses(filters);
    } catch (err) {
      console.error("Archiving routine failed:", err);
    }
  };
  // Reset pagination window when filters change to avoid empty view indexes
  const handleSetSearch = (val) => {
    setSearchQuery(val);
    setCurrentPage(1);
    setFilters((prev) => ({ ...prev, search: val }));
  };
  const handleSetCategory = (val) => {
    setSelectedCategory(val);
    setCurrentPage(1);
    setFilters((prev) => ({
      ...prev,
      category: val === "All" ? undefined : val,
    }));
  };
  const handleSetStatus = (val) => {
    setSelectedStatus(val);
    setCurrentPage(1);
    setFilters((prev) => ({
      ...prev,
      status: val === "All" ? undefined : val,
    }));
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

      {loading && <p className="text-center py-8">Loading courses...</p>}
      {error && <p className="text-center text-red-500 py-8">Error: {error}</p>}

      {!loading && !error && (
        <>
          <CourseStatCards courses={courses} loading={loading} error={error} />

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
        </>
      )}
    </div>
  );
}
