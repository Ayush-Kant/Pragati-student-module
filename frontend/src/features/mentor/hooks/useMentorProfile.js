import { useState, useEffect } from "react";
import api from "../../../services/api";

// Fallback mock used until the backend endpoint is fully wired up.
// Remove this once GET /api/mentor/profile returns real data.
const mockProfile = {
  mentorId: 1,
  fullName: "Rahul Sharma",
  bio: "Senior MERN Stack Developer with 6+ years of experience mentoring engineers.",
  avatarUrl: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
  expertiseTags: ["React", "Node.js", "System Design", "DSA"],
  verified: true,
  availability: {},
  assignedDrives: [
    { driveId: 1, title: "Campus Hiring Drive – June 2025" },
  ],
};

const useMentorProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    api
      .get("/mentor/profile")
      .then((res) => setProfile(res.data))
      .catch((err) => {
        console.warn("Profile API unavailable, using mock data.", err.message);
        // Fall back to mock so the UI is still usable during development
        setProfile(mockProfile);
      })
      .finally(() => setLoading(false));
  }, []);

  const saveProfile = async (updatedData) => {
    try {
      const res = await api.put("/mentor/profile", {
        bio: updatedData.bio,
        avatarUrl: updatedData.avatarUrl,
        expertiseTags: updatedData.expertiseTags,
        availability: updatedData.availability,
      });
      // Merge the server-confirmed fields back into local state
      setProfile((prev) => ({ ...prev, ...res.data.profile }));
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to save profile:", err.message);
      // Optimistic update so the UI reflects the change even if backend is down
      setProfile(updatedData);
      setIsEditing(false);
    }
  };

  return { profile, loading, error, isEditing, setIsEditing, saveProfile };
};

export default useMentorProfile;
