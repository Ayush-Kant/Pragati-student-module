import { useEffect, useState } from "react";
import {
  getMentors,
  createMentor,
  deleteMentor,
  assignMentor as assignMentorApi,
  replaceMentor as replaceMentorApi,
} from "../services/adminService";
import toast from "react-hot-toast";

export default function useMentorManagement() {
  const [loading, setLoading] = useState(true);
  const [mentors, setMentors] = useState([]);

  const [search, setSearch] = useState("");
  const [expertise, setExpertise] = useState("all");
  const [status, setStatus] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  const mockMentors = [
    {
      id: "mentor_001",
      name: "Rohit Sharma",
      email: "rohit@uptoskills.com",
      expertise: ["MERN", "React", "Node.js"],
      rating: 4.8,
      activeBatches: 3,
      isActive: true,
    },
    {
      id: "mentor_002",
      name: "Priya Singh",
      email: "priya@uptoskills.com",
      expertise: ["AI/ML", "Python"],
      rating: 4.2,
      activeBatches: 1,
      isActive: true,
    },
    {
      id: "mentor_003",
      name: "Arjun Das",
      email: "arjun@uptoskills.com",
      expertise: ["Java", "Spring Boot"],
      rating: 3.8,
      activeBatches: 0,
      isActive: false,
    },
  ];

  const fetchMentors = async () => {
    try {
      setLoading(true);
      const data = await getMentors();
      setMentors(data);
    } catch (error) {
      console.warn("Backend unavailable, using mock mentors");
      console.error("Original error:", error);
      // Use mock data if backend is unavailable
      setMentors(mockMentors);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentors();
  }, []);

  const filteredMentors = mentors.filter((mentor) => {
    const searchTerm = search.trim().toLowerCase();

    const matchesSearch =
      searchTerm === "" ||
      mentor.id.toLowerCase().includes(searchTerm) ||
      mentor.name.toLowerCase().includes(searchTerm) ||
      mentor.email.toLowerCase().includes(searchTerm) ||
      mentor.expertise.join(" ").toLowerCase().includes(searchTerm);

    const matchesExpertise =
      expertise === "all"
        ? true
        : mentor.expertise.includes(expertise);

    const matchesStatus =
      status === "all"
        ? true
        : status === "active"
        ? mentor.isActive
        : !mentor.isActive;

    return matchesSearch && matchesExpertise && matchesStatus;
  });

  const totalPages = Math.ceil(filteredMentors.length / itemsPerPage);

  const currentMentors = filteredMentors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, expertise, status]);

  const getNextMentorId = () => {
    const highestId = mentors.reduce((max, mentor) => {
      const match = mentor.id?.match(/^mentor_(\d+)$/i);
      if (!match) {
        return max;
      }
      const num = parseInt(match[1], 10);
      return Number.isNaN(num) ? max : Math.max(max, num);
    }, 0);

    const nextIdNumber = highestId + 1;
    return `mentor_${String(nextIdNumber).padStart(3, "0")}`;
  };

  const addMentor = async (mentorData) => {
    const newMentor = {
      id: getNextMentorId(),
      ...mentorData,
      rating: Number(mentorData.rating) || 0,
      activeBatches: Number(mentorData.activeBatches) || 0,
      isActive: Number(mentorData.activeBatches) > 0,
    };

    try {
      await createMentor(mentorData);
      setMentors((current) => [...current, newMentor]);
      toast.success("Mentor added successfully");
    } catch (error) {
      console.warn("Mentor added locally (mock)");
      setMentors((current) => [...current, newMentor]);
      toast.success("Mentor added successfully");
    }
  };

  const removeMentor = async (mentorId) => {
    try {
      await deleteMentor(mentorId);
      setMentors((current) => current.filter((m) => m.id !== mentorId));
      toast.success("Mentor removed successfully");
    } catch (error) {
      console.warn("Mentor removed locally (mock)");
      setMentors((current) => current.filter((m) => m.id !== mentorId));
      toast.success("Mentor removed successfully");
    }
  };

  const assignMentor = async (mentorId, batchId) => {
    try {
      await assignMentorApi(mentorId, batchId);
      toast.success("Mentor assigned successfully");
    } catch (error) {
      console.warn("Mentor assigned locally (mock)");
      toast.success("Mentor assigned successfully");
    }
  };

  const replaceMentor = async (mentorId, newMentorId) => {
    try {
      await replaceMentorApi(mentorId, newMentorId);
      toast.success("Mentor replaced successfully");
    } catch (error) {
      console.warn("Mentor replaced locally (mock)");
      toast.success("Mentor replaced successfully");
    }
  };
  const toggleMentorStatus = (mentorId) => {
  setMentors((prev) =>
    prev.map((mentor) =>
      mentor.id === mentorId
        ? {
            ...mentor,
            isActive: !mentor.isActive,
          }
        : mentor
    )
  );
};

  return {
    loading,
    mentors,
    fetchMentors,
    addMentor,
    removeMentor,

    currentMentors,
    filteredMentors,

    currentPage,
    setCurrentPage,
    totalPages,

    search,
    setSearch,

    expertise,
    setExpertise,

    status,
    setStatus,

    assignMentor,
    replaceMentor,

    toggleMentorStatus,
  };
}