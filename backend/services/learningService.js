import * as learningModel from "../src/models/learningModel.js";
import * as lessonModel from "../src/models/lessonModel.js";

export const getCourses = async (studentId, queryPayload) => {
    return await learningModel.getCourses();
};

export const getCourseDetail = async (courseId) => {
    return await learningModel.getCourseById(courseId);
};

export const getLesson = async (lessonId) => {
    return await lessonModel.getLessonById(lessonId, null);
};

export const updateProgress = async (lessonId, studentId, payload) => {
    const completed = Number(payload.progress) >= 100;
    return await lessonModel.updateLessonProgress(lessonId, studentId, completed);
};

export const saveNotes = async (studentId, payload) => {
    return await learningModel.saveStudentNote({
        studentId,
        lessonId: payload.lessonId,
        content: payload.note,
        noteId: payload.noteId,
    });
};

export const getContinueLearning = async (studentId) => {
    const progress = await learningModel.getLessonProgress({ studentId });
    const notes = await learningModel.getStudentNotes({ studentId });

    return { progress, notes };
};
