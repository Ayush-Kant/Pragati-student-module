import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/admin",
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
    const response = await api.get(
      "/api/v1/admin/colleges/needs-recruitment"
    );
    return response.data;
  }
  catch (error) {
    console.log(error);
    throw error;
  }
}

//To fetch rankings of college
export const getCollegeRankings = async () => {
  try {
    const response = await api.get(
      "/api/v1/admin/colleges/rankings"
    );
    return response.data;
  }
  catch (error) {
    console.log(error);
    throw error;
  }
}

// getColleges()
// getCollegeById()
// getCollegeStats()

// approveCollege()
// rejectCollege()
// suspendCollege()

// getCollegeRankings()
// getNeedsRecruitment()