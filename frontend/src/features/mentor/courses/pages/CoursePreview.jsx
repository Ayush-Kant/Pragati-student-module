import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCourseDetails } from '../hooks/useCourseDetails';
import PreviewHeroSection from '../components/PreviewHeroSection';
import PreviewCurriculumAccordion from '../components/PreviewCurriculumAccordion';
import { ArrowLeft, Edit } from 'lucide-react';

export default function CoursePreview() {
  const { courseId } = useParams();
  const { data: courseData, loading, error } = useCourseDetails(courseId);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4 max-w-4xl mx-auto">
          <div className="h-64 bg-slate-200 rounded-lg w-full"></div>
          <div className="h-10 bg-slate-200 rounded w-1/3 mt-8"></div>
          <div className="h-4 bg-slate-200 rounded w-full"></div>
          <div className="h-4 bg-slate-200 rounded w-5/6"></div>
          <div className="space-y-2 mt-8">
            <div className="h-12 bg-slate-200 rounded w-full"></div>
            <div className="h-12 bg-slate-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="p-6 text-center text-gray-500 max-w-4xl mx-auto">
        Course not found.
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen p-6">
      <div className="max-w-4xl mx-auto mb-4 flex justify-between items-center">
        <Link to="/mentor/courses" className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Courses
        </Link>
        <Link to={`/mentor/courses/${courseId}/edit`} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2 shadow-sm">
          <Edit className="w-4 h-4" /> Edit Course
        </Link>
      </div>

      <PreviewHeroSection data={courseData} />
      
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-gray-800">About This Course</h2>
            <div 
              className="prose max-w-none text-gray-600"
              dangerouslySetInnerHTML={{ __html: courseData.fullDescription || 'No description provided.' }}
            />
          </section>

          <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Curriculum</h2>
            <PreviewCurriculumAccordion modules={courseData.modules} />
          </section>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-3">Skills You Will Gain</h3>
            <div className="flex flex-wrap gap-2">
              {courseData.skillTags && courseData.skillTags.map((tag, idx) => (
                <span key={idx} className="bg-indigo-50 text-indigo-700 text-xs px-2.5 py-1 rounded-md font-medium">
                  {tag}
                </span>
              ))}
              {(!courseData.skillTags || courseData.skillTags.length === 0) && (
                <span className="text-gray-400 text-sm italic">No skills listed</span>
              )}
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-3">Course Features</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex justify-between border-b pb-2">
                <span>Category</span>
                <span className="font-medium text-gray-800 capitalize">{courseData.category}</span>
              </li>
              <li className="flex justify-between border-b pb-2">
                <span>Level</span>
                <span className="font-medium text-gray-800 capitalize">{courseData.level}</span>
              </li>
              <li className="flex justify-between border-b pb-2">
                <span>Duration</span>
                <span className="font-medium text-gray-800">{courseData.estimatedDuration}</span>
              </li>
              <li className="flex justify-between">
                <span>Visibility</span>
                <span className={`font-medium ${courseData.visibility === 'Published' ? 'text-green-600' : 'text-orange-500'}`}>
                  {courseData.visibility}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
