import { useEffect, useState } from "react";

export const useAdminProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // FETCH PROFILE
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = {
        adminId: "adm_001",
        fullName: "Priya Mehta",
        displayTitle: "Senior Software Engineer",
        email: "priya@pragati.dev",
        avatarUrl: "",
        bio: "Experienced software engineer with expertise in frontend development.",
        bio2: "I have spent over 8 years in the software industry, specialized in building scalable UI architectures using React & Next.js. I love teaching and helping the next generation of engineers.",
        role: "super_admin",
        permissions: [
          "manage_mentors",
          "manage_drives",
          "view_reports"
        ],
        contactInfo: {
          phone: "+91 9876543210",
          timezone: "Asia/Kolkata",
        },
        socialLinks: {
          github: "https://github.com/priyamehta",
          linkedin: "https://linkedin.com/in/priyamehta",
        },
        designation: "Senior Software Engineer",
        yearsExp: "5-10 years",
        expertise: ["Frontend Architecture", "UI/UX Systems"],
        coreSkills: [
          { name: "React.js & Next.js", level: "EXPERT" },
          { name: "System Design", level: "INTERMEDIATE" }
        ],
        availability: {
          "MON_09:00 AM": true,
          "WED_09:00 AM": true,
          "THU_05:00 PM": true,
          "MON_02:00 PM": true,
          "TUE_02:00 PM": true
        },
        certifications: [
          { name: "AWS Solutions Architect", fileName: "aws_solutions_architect.pdf" }
        ]
      };
      setProfile(data);
      setError("");
    } catch (err) {
      console.log(err);
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  // UPDATE PROFILE
  const saveProfile = async (updatedData) => {
    try {
      // simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      // update local frontend state
      setProfile(updatedData);
      return {
        success: true,
      };
    } catch (err) {
      return {
        success: false,
        error: "Failed to update profile",
      };
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    loading,
    error,
    saveProfile,
  };
};