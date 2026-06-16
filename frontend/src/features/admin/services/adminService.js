import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
});

export const getAdminProfile = async () => {
  const response = await API.get("/profile");
  return response.data;
};

export const updateAdminProfile = async (profileData) => {
  const response = await API.put("/profile", profileData);
  return response.data;
};

//For college needing recruitment
export const getNeedsRecruitment = async () => {
  try {
    const response = await API.get("/api/v1/admin/colleges/needs-recruitment");
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

//To fetch rankings of college
export const getCollegeRankings = async () => {
  try {
    const response = await API.get("/api/v1/admin/colleges/rankings");
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const approveCollege = async (id) => {
  try {
<<<<<<< HEAD
    const response = await API.put(`/api/v1/admin/colleges/${id}/approve`);
    return response.data;
  } catch (error) {
=======
    const response = await API.put(
      `/api/v1/admin/colleges/${id}/approve`
    );
    return response.data;
  }
  catch (error) {
>>>>>>> parent of ebaa280 (Merge branch 'feature/admin-student-management-fe' of https://github.com/krishnabackup/Pragati into feature/admin-student-management-fe)
    throw error;
  }
};

export const rejectCollege = async (id, reason) => {
  try {
    const response = await API.put(`/api/v1/admin/colleges/${id}/reject`, {
      reason,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const suspendCollege = async (id, reason) => {
  try {
    const response = await API.put(`/api/v1/admin/colleges/${id}/suspend`, {
      reason,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
