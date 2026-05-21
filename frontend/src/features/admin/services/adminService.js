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


// getColleges()
// getCollegeById()
// getCollegeStats()

// approveCollege()
// rejectCollege()
// suspendCollege()

// getCollegeRankings()
// getNeedsRecruitment()