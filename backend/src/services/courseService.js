import * as courseModel from "../models/courseModel.js";

export const getModules = async (courseId) => {
    const modules = await courseModel.getCourseModules(courseId);
    return modules.map((module) => ({
        id: module.id,
        courseId: module.course_id,
        title: module.title,
        description: module.description,
        moduleOrder: module.module_order,
        lessonCount: Number(module.lesson_count ?? 0),
        createdAt: module.created_at,
        updatedAt: module.updated_at,
    }));
};

export const getModule = async (moduleId) => {
    return await courseModel.getModuleDetails(moduleId);
};