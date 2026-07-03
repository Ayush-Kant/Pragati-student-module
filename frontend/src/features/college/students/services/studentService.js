import api from "../../../../services/api";

export const getStudents = async () => {
  try {
    const response = await api.get('/students');
    const mappedData = response.data.data.map(student => ({
      id: student.id,
      enrollmentNo: student.enrollment_no,
      name: student.name,
      email: student.email,
      phone: student.phone,
      department: student.department,
      course: student.course,
      semester: student.semester,
      batch: student.graduation_year ? student.graduation_year.toString() : "Unknown",
      cgpa: student.cgpa,
      placementStatus: student.placement_status || "Eligible",
      skills: student.skills ? student.skills.map(s => typeof s === 'string' ? s : s.skill_name) : [],
      address: student.address || "",
      resumeStatus: student.resume_url ? "Uploaded" : "Not Uploaded",
      linkedin: student.linkedin_url || "",
      github: student.github_url || "",
      placedAt: student.placed_at || null,
      package: student.package || null,
    }));
    return { success: true, data: mappedData };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Failed to fetch students" };
  }
};

export const getStudentById = async (id) => {
  try {
    const response = await api.get(`/students/${id}`);
    const student = response.data.data;
    
    const mappedStudent = {
      id: student.id,
      enrollmentNo: student.enrollment_no,
      name: student.name,
      email: student.email,
      phone: student.phone,
      department: student.department,
      course: student.course,
      semester: student.semester,
      batch: student.graduation_year ? student.graduation_year.toString() : "Unknown",
      cgpa: student.cgpa,
      placementStatus: student.placement_status || "Eligible",
      skills: student.skills ? student.skills.map(s => typeof s === 'string' ? s : s.skill_name) : [],
      address: student.address || "",
      resumeStatus: student.resume_url ? "Uploaded" : "Not Uploaded",
      linkedin: student.linkedin_url || "",
      github: student.github_url || "",
      placedAt: student.placed_at || null,
      package: student.package || null,
    };
    return { success: true, data: mappedStudent };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Student not found" };
  }
};

export const createStudent = async (studentData) => {
  try {
    const payload = {
      enrollment_no: studentData.enrollmentNo,
      name: studentData.name,
      email: studentData.email,
      phone: studentData.phone,
      department: studentData.department,
      course: studentData.course,
      semester: studentData.semester,
      cgpa: studentData.cgpa,
      placement_status: studentData.placementStatus,
      graduation_year: studentData.batch && studentData.batch !== "All" ? parseInt(studentData.batch) : null,
      skills: studentData.skills || []
    };
    
    const response = await api.post('/students', payload);
    const student = response.data.data;
    const mappedStudent = {
      id: student.id,
      enrollmentNo: student.enrollment_no,
      name: student.name,
      email: student.email,
      phone: student.phone,
      department: student.department,
      course: student.course,
      semester: student.semester,
      batch: student.graduation_year ? student.graduation_year.toString() : "Unknown",
      cgpa: student.cgpa,
      placementStatus: student.placement_status || "Eligible",
      skills: student.skills ? student.skills.map(s => typeof s === 'string' ? s : s.skill_name) : [],
      address: student.address || "",
      resumeStatus: student.resume_url ? "Uploaded" : "Not Uploaded",
      linkedin: student.linkedin_url || "",
      github: student.github_url || "",
      placedAt: student.placed_at || null,
      package: student.package || null,
    };
    return { success: true, data: mappedStudent };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Failed to create student" };
  }
};

export const updateStudent = async (id, studentData) => {
  try {
    const payload = {
      enrollment_no: studentData.enrollmentNo,
      name: studentData.name,
      email: studentData.email,
      phone: studentData.phone,
      department: studentData.department,
      course: studentData.course,
      semester: studentData.semester,
      cgpa: studentData.cgpa,
      placement_status: studentData.placementStatus,
      graduation_year: studentData.batch && studentData.batch !== "All" ? parseInt(studentData.batch) : null,
      skills: studentData.skills || []
    };
    
    Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

    const response = await api.put(`/students/${id}`, payload);
    const student = response.data.data;
    const mappedStudent = {
      id: student.id,
      enrollmentNo: student.enrollment_no,
      name: student.name,
      email: student.email,
      phone: student.phone,
      department: student.department,
      course: student.course,
      semester: student.semester,
      batch: student.graduation_year ? student.graduation_year.toString() : "Unknown",
      cgpa: student.cgpa,
      placementStatus: student.placement_status || "Eligible",
      skills: student.skills ? student.skills.map(s => typeof s === 'string' ? s : s.skill_name) : [],
      address: student.address || "",
      resumeStatus: student.resume_url ? "Uploaded" : "Not Uploaded",
      linkedin: student.linkedin_url || "",
      github: student.github_url || "",
      placedAt: student.placed_at || null,
      package: student.package || null,
    };
    return { success: true, data: mappedStudent };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Failed to update student" };
  }
};

export const deleteStudent = async (id) => {
  try {
    const response = await api.delete(`/students/${id}`);
    return { success: true, message: response.data.message || "Student deleted successfully" };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Failed to delete student" };
  }
};