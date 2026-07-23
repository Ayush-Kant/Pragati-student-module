import {
  getDepartments as getDepartmentsModel,
  createDepartment as createDepartmentModel,
  updateDepartment as updateDepartmentModel,
  deleteDepartment as deleteDepartmentModel
} from '../models/departmentModel.js';

/**
 * Controller to fetch all departments.
 */
export const getDepartments = async (req, res, next) => {
  try {
    const departments = await getDepartmentsModel();
    
    // Map to expected response format
    const formattedDepartments = departments.map(dept => ({
      deptId: dept.dept_id,
      name: dept.name,
      courses: dept.courses
    }));
    
    res.status(200).json({ success: true, data: formattedDepartments });
  } catch (error) {
    next(error); // Passes error to errorMiddleware
  }
};

/**
 * Controller to create a new department.
 */
export const createDepartment = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ success: false, message: "Request body is missing or Content-Type is not application/json" });
    }
    const { name, courses } = req.body;
    
    // Input Validation
    if (!name || name.trim() === "") {
      return res.status(400).json({ success: false, message: "name is required" });
    }
    if (!Array.isArray(courses)) {
      return res.status(400).json({ success: false, message: "courses must be an array" });
    }

    const newDept = await createDepartmentModel(name, courses);
    
    res.status(201).json({
      success: true,
      message: "Department created successfully",
      deptId: newDept.dept_id
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to update an existing department.
 */
export const updateDepartment = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid department ID" });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ success: false, message: "Request body is missing or Content-Type is not application/json" });
    }
    const { name, courses } = req.body;

    // Input Validation
    if (!name || name.trim() === "") {
      return res.status(400).json({ success: false, message: "name is required" });
    }
    if (!Array.isArray(courses)) {
      return res.status(400).json({ success: false, message: "courses must be an array" });
    }

    const updatedDept = await updateDepartmentModel(id, name, courses);
    
    if (!updatedDept) {
      return res.status(404).json({ success: false, message: "Department not found" });
    }

    res.status(200).json({
      success: true,
      message: "Department updated successfully",
      updatedDept: {
        deptId: updatedDept.dept_id,
        name: updatedDept.name,
        courses: updatedDept.courses
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to delete a department.
 */
export const deleteDepartment = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Invalid department ID" });
    }

    const deletedDept = await deleteDepartmentModel(id);
    
    if (!deletedDept) {
      return res.status(404).json({ success: false, message: "Department not found" });
    }

    res.status(200).json({
      success: true,
      message: "Deleted"
    });
  } catch (error) {
    next(error);
  }
};
