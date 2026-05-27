import axios from "axios";

const API_URL =
  "/api/mentor/profile";

/* GET PROFILE */
export const getMentorProfile =
  async () => {
    const response =
      await axios.get(API_URL);

    return response.data;
  };

/* UPDATE PROFILE */
export const updateMentorProfile =
  async (profileData) => {
    const response =
      await axios.put(
        API_URL,
        profileData
      );

    return response.data;
  };