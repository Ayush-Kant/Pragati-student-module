import React from 'react';
import { ChevronLeft, ChevronRight } from "lucide-react";
import CourseFilters from './CourseFilters';
import CourseTableRow from './CourseTableRow';

export default function CourseTable({ 
  courses, 
  searchQuery, setSearchQuery, 
  selectedCategory, setSelectedCategory, 
  selectedStatus, setSelectedStatus,
  currentPage, setCurrentPage,
  onArchive, onView, onEdit 
}) {
  
  const ITEMS_PER_PAGE = 3;
  const totalPages = Math.ceil(courses.length / ITEMS_PER_PAGE) || 1;
  
  // Slice array data specifically for current page segment context
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCourses = courses.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="mt-8 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
      <CourseFilters 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
      />

      {courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <img src="https://cdn-icons-png.flaticon.com/512/7486/7486740.png" alt="empty" className="h-40 w-40 object-contain" />
          <h3 className="mt-6 text-2xl font-semibold text-gray-800">No courses found</h3>
          <p className="mt-2 text-gray-500">Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <>
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-3">
              <thead>
                <tr className="text-left text-sm font-semibold text-gray-500">
                  <th className="pb-3">Course</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Mentor</th>
                  <th className="pb-3">Students</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCourses.map((course) => (
                  <CourseTableRow 
                    key={course.courseId} 
                    course={course} 
                    onArchive={onArchive} 
                    onView={onView}
                    onEdit={onEdit}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Dynamic Working Pagination Container */}
          <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-gray-500">
              Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, courses.length)} of {courses.length} entries
            </p>
            
            <div className="flex items-center gap-2">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="cursor-pointer flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 disabled:opacity-40 transition hover:bg-gray-50"
              >
                <ChevronLeft size={18} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`cursor-pointer flex h-10 w-10 items-center justify-center rounded-xl font-medium transition ${
                    currentPage === pageNum 
                      ? 'bg-blue-600 text-white' 
                      : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="cursor-pointer flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 disabled:opacity-40 transition hover:bg-gray-50"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}