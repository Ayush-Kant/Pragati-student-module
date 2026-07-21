import api from "../../../../services/api";

export const getEligibleStudents = async () => {
  try {
    const response = await api.get('/nominations/eligible');
    return {
      success: true,
      data: response.data?.data || response.data || [],
    };
  } catch (error) {
    console.error("Error fetching eligible students:", error);
    throw error;
  }
};

export const getNominatedStudents = async () => {
  try {
    const response = await api.get('/nominations');
    return {
      success: true,
      data: response.data?.data || response.data || [],
    };
  } catch (error) {
    console.error("Error fetching nominated students:", error);
    throw error;
  }
};

export const getShortlistedStudents = async () => {
  try {
    const response = await api.get('/shortlists');
    return {
      success: true,
      data: response.data?.data || response.data || [],
    };
  } catch (error) {
    console.error("Error fetching shortlisted students:", error);
    throw error;
  }
};

export const nominateStudent = async (student) => {
  try {
    const response = await api.post('/nominations', student);
    return {
      success: true,
      data: response.data?.data || response.data,
      message: response.data?.message || "Student nominated successfully.",
    };
  } catch (error) {
    console.error("Error nominating student:", error);
    throw error;
  }
};

export const updateNomination = async (studentId, updatedData) => {
  try {
    const response = await api.put(`/nominations/${studentId}`, updatedData);
    return {
      success: true,
      data: response.data?.data || response.data,
      message: response.data?.message || "Nomination updated successfully.",
    };
  } catch (error) {
    console.error("Error updating nomination:", error);
    throw error;
  }
};

export const removeNomination = async (studentId) => {
  try {
    const response = await api.delete(`/nominations/${studentId}`);
    return {
      success: true,
      data: response.data?.data || response.data,
      message: response.data?.message || "Nomination removed successfully.",
    };
  } catch (error) {
    console.error("Error removing nomination:", error);
    throw error;
  }
};