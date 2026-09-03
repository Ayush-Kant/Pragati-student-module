import CourseDetailPage from './CourseDetailPage';

// The existing course-detail experience already provides the full SM-04 lesson workflow
// (video progress, sequencing/locks, chapters, transcripts, notes and resources).
// Keep that functional surface intact while routing it through a dedicated SM-04 entry point.
export default function SM04CourseWorkspace() {
  return <CourseDetailPage />;
}
