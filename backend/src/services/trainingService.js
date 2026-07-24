import * as trainingModel from "../models/trainingModel.js";

const formatCourse = (course) => ({
    id: course.id,
    title: course.title,
    category: course.category,
    level: course.level,
    duration: course.duration,
    description: course.description,
    moduleCount: Number(course.module_count ?? 0),
    lessonCount: Number(course.lesson_count ?? 0),
    progressPercent: Number(course.progress_percent ?? 0),
    createdAt: course.created_at,
    updatedAt: course.updated_at,
});

export const getStudentCourses = async (studentId) => {
    const courses = await trainingModel.getAllCourses(studentId);
    return courses.map(formatCourse);
};

export const getStudentCourse = async (studentId, id) => {
    const course = await trainingModel.getCourseById(id, studentId);
    return course ? formatCourse(course) : null;
};