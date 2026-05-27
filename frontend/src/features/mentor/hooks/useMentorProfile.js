import { useEffect, useState } from "react";

import {
  getMentorProfile,
  updateMentorProfile,
} from "../services/mentorService";

const mockProfile = {
  fullName: "Rahul Sharma",

  avatarUrl:
    "https://i.pravatar.cc/300",

  bio: "10 years MERN stack experience.",

  expertiseTags: [
    "MERN",
    "Python",
  ],

  verified: true,

  assignedDrives: [
    {
      driveId: "drv_01",
      title: "MERN Batch A",
    },
  ],

  availability: {
    monday: [
      {
        start: "09:00",
        end: "05:00 PM",
      },
    ],
  },
};

const useMentorProfile = () => {
  const [profile, setProfile] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [isEditing, setIsEditing] =
    useState(false);

  /* FETCH PROFILE */
  const fetchProfile = async () => {
    try {
      setLoading(true);

      /*
      BACKEND READY:
      const data =
        await getMentorProfile();
      */

      const data = mockProfile;

      setProfile(data);
    } catch (err) {
      setError(
        "Failed to load profile"
      );
    } finally {
      setLoading(false);
    }
  };

  /* SAVE PROFILE */
  const saveProfile = async (
    updatedData
  ) => {
    try {
      
      /*
      await updateMentorProfile(
        updatedData
      );
      */

      setProfile(updatedData);

      setIsEditing(false);

      return true;
    } catch (err) {
      setError(
        "Failed to update profile"
      );

      return false;
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,

    loading,

    error,

    isEditing,

    setIsEditing,

    saveProfile,
  };
};

export default useMentorProfile;