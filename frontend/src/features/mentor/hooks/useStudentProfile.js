import { useState, useCallback } from "react";
import { menteeManagementService } from "../services/menteeManagementService";
import { toast } from "react-hot-toast";

export default function useStudentProfile() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notes, setNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  const fetchProfile = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await menteeManagementService.getMenteeProfile(id);
      setProfile(data);
      setNotes(data.notes || "");
    } catch (err) {
      console.error(`Error fetching student profile for ID ${id}:`, err);
      setError(err.message || "Failed to load student profile");
      toast.error("Failed to load student profile");
    } finally {
      setLoading(false);
    }
  }, []);

  const openProfile = useCallback(async (studentId) => {
    setSelectedStudentId(studentId);
    setIsOpen(true);
    await fetchProfile(studentId);
  }, [fetchProfile]);

  const closeProfile = useCallback(() => {
    setIsOpen(false);
    setSelectedStudentId(null);
    setProfile(null);
    setNotes("");
  }, []);

  const saveNotes = useCallback(async () => {
    if (!selectedStudentId) return;
    setSavingNotes(true);
    try {
      await menteeManagementService.updateMenteeNotes(selectedStudentId, notes);
      setProfile((prev) => prev ? { ...prev, notes } : null);
      toast.success("Notes saved successfully");
    } catch (err) {
      console.error("Error saving notes:", err);
      toast.error("Failed to save notes");
    } finally {
      setSavingNotes(false);
    }
  }, [selectedStudentId, notes]);

  return {
    isOpen,
    selectedStudentId,
    profile,
    loading,
    error,
    notes,
    setNotes,
    savingNotes,
    openProfile,
    closeProfile,
    saveNotes,
  };
}
