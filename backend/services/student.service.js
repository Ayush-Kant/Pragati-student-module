import studentModel from "../models/studentModel.js";
import academicModel from "../models/academicModel.js";
import skillsModel from "../models/skillsModel.js";

class StudentService {
  async getStudents(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const students = await studentModel.getAllStudents(limit, offset);
    return {
      success: true,
      message: "Students fetched successfully",
      data: students,
      pagination: {
        page,
        limit,
      }
    };
  }

  async getStudent(id) {
    const student = await studentModel.getStudentById(id);
    if (!student) {
      throw new Error("Student not found");
    }
    
    const academic = await academicModel.getAcademicDetails(id);
    const skills = await skillsModel.getStudentSkills(id);

    return {
      success: true,
      message: "Student details fetched successfully",
      data: {
        ...student,
        academic: academic || null,
        skills: skills || []
      }
    };
  }

  async addStudent(studentData) {
    try {
      const newStudent = await studentModel.createStudent(studentData);
      return {
        success: true,
        message: "Student created successfully",
        data: newStudent
      };
    } catch (error) {
      if (error.code === '23505') { 
        throw new Error("Student with this enrollment number or email already exists");
      }
      throw error;
    }
  }

  async editStudent(id, studentData) {
    const existing = await studentModel.getStudentById(id);
    if (!existing) {
      throw new Error("Student not found");
    }

    try {
      const updatedStudent = await studentModel.updateStudent(id, studentData);
      return {
        success: true,
        message: "Student updated successfully",
        data: updatedStudent
      };
    } catch (error) {
      if (error.code === '23505') { 
        throw new Error("Student with this enrollment number or email already exists");
      }
      throw error;
    }
  }

  async removeStudent(id) {
    const existing = await studentModel.getStudentById(id);
    if (!existing) {
      throw new Error("Student not found");
    }

    await studentModel.deleteStudent(id);
    return {
      success: true,
      message: "Student deleted successfully"
    };
  }

  async searchStudents(searchTerm) {
    if (!searchTerm) {
      return this.getStudents(1, 100);
    }
    const students = await studentModel.searchStudents(searchTerm);
    return {
      success: true,
      message: "Students search results",
      data: students
    };
  }

  async filterStudents(filters) {
    const students = await studentModel.filterStudents(filters);
    return {
      success: true,
      message: "Filtered students",
      data: students
    };
  }

  async getStatistics() {
    const stats = await studentModel.getStudentStatistics();
    return {
      success: true,
      message: "Student statistics fetched successfully",
      data: stats
    };
  }

  async getAcademicDetails(studentId) {
    const academic = await academicModel.getAcademicDetails(studentId);
    if (!academic) {
      throw new Error("Academic details not found");
    }
    return {
      success: true,
      message: "Academic details fetched successfully",
      data: academic
    };
  }

  async updateAcademicDetails(studentId, academicData) {
    const student = await studentModel.getStudentById(studentId);
    if (!student) {
      throw new Error("Student not found");
    }

    const updated = await academicModel.updateAcademicDetails(studentId, academicData);
    return {
      success: true,
      message: "Academic details updated successfully",
      data: updated
    };
  }

  async getStudentSkills(studentId) {
    const skills = await skillsModel.getStudentSkills(studentId);
    return {
      success: true,
      message: "Skills fetched successfully",
      data: skills
    };
  }

  async addStudentSkill(studentId, skillData) {
    const student = await studentModel.getStudentById(studentId);
    if (!student) {
      throw new Error("Student not found");
    }

    try {
      const newSkill = await skillsModel.addStudentSkill(studentId, skillData);
      return {
        success: true,
        message: "Skill added successfully",
        data: newSkill
      };
    } catch (error) {
       if (error.code === '23505') { 
        throw new Error("Skill already exists for this student");
      }
      throw error;
    }
  }

  async updateStudentSkill(studentId, skillId, skillData) {
    const updatedSkill = await skillsModel.updateStudentSkill(studentId, skillId, skillData);
    if (!updatedSkill) {
      throw new Error("Skill not found");
    }
    return {
      success: true,
      message: "Skill updated successfully",
      data: updatedSkill
    };
  }

  async removeStudentSkill(studentId, skillId) {
    const deleted = await skillsModel.deleteStudentSkill(studentId, skillId);
    if (!deleted) {
      throw new Error("Skill not found");
    }
    return {
      success: true,
      message: "Skill removed successfully"
    };
  }
}

export default new StudentService();
