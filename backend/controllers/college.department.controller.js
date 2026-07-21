import * as departmentService from "../services/college.department.service.js";

/**
 * Location: backend/controllers/college.department.controller.js
 */

export const getDepartments = async (req, res, next) => {
  try {
    const { page, pageSize, activeOnly } = req.query;
    const result = await departmentService.getDepartments({
      page,
      pageSize,
      activeOnly: activeOnly === "true",
    });
    res.status(200).json({ success: true, data: result.departments, meta: result.meta });
  } catch (err) {
    next(err);
  }
};

export const getDepartmentById = async (req, res, next) => {
  try {
    const department = await departmentService.getDepartment(req.params.id);
    res.status(200).json({ success: true, data: department });
  } catch (err) {
    next(err);
  }
};

export const createDepartment = async (req, res, next) => {
  try {
    const department = await departmentService.addDepartment(req.body);
    res.status(201).json({ success: true, message: "Department created successfully.", data: department });
  } catch (err) {
    next(err);
  }
};

export const updateDepartment = async (req, res, next) => {
  try {
    const department = await departmentService.editDepartment(req.params.id, req.body);
    res.status(200).json({ success: true, message: "Department updated successfully.", data: department });
  } catch (err) {
    next(err);
  }
};

export const deleteDepartment = async (req, res, next) => {
  try {
    const result = await departmentService.removeDepartment(req.params.id);
    res.status(200).json({ success: true, message: "Department deleted successfully.", data: result });
  } catch (err) {
    next(err);
  }
};

export const searchDepartments = async (req, res, next) => {
  try {
    const { q, page, pageSize } = req.query;
    if (!q || q.trim() === "") {
      return res.status(400).json({ success: false, error: "Query parameter 'q' is required for search." });
    }
    const departments = await departmentService.searchDepartments(q, { page, pageSize });
    res.status(200).json({ success: true, data: departments });
  } catch (err) {
    next(err);
  }
};

export default {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  searchDepartments,
};