// useProfileData.js
// Custom hook — fetches all profile data, handles loading & error states
// src/features/student/profile/hooks/useProfileData.js

import { useState, useEffect, useCallback } from "react";
import {
  getStudentProfile,
  updateStudentProfile,
  uploadResume,
  getSkills,
  updateSkills,
  getProjects,
  getPortfolio,
  updatePortfolio,
  getSocialLinks,
  updateSocialLinks,
} from "../services/profileService";
import { LOADING_STATES } from "../constants/profileConstants";

// ── Demo student ID — replace with auth context later ─
const DEMO_STUDENT_ID = "demo-student-01";

const useProfileData = (studentId = DEMO_STUDENT_ID) => {
  // ── State ────────────────────────────────────────────
  const [profile,     setProfile]     = useState(null);
  const [skills,      setSkills]      = useState([]);
  const [projects,    setProjects]    = useState([]);
  const [portfolio,   setPortfolio]   = useState(null);
  const [socialLinks, setSocialLinks] = useState(null);
  const [resume,      setResume]      = useState(null);

  const [loadingState, setLoadingState] = useState(LOADING_STATES.IDLE);
  const [saving,       setSaving]       = useState(false);
  const [uploading,    setUploading]    = useState(false);
  const [error,        setError]        = useState(null);
  const [successMsg,   setSuccessMsg]   = useState("");

  // ── Show success for 3 seconds ───────────────────────
  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  // ── Fetch all data on mount ──────────────────────────
  useEffect(() => {
    const fetchAll = async () => {
      setLoadingState(LOADING_STATES.LOADING);
      setError(null);
      try {
        const [
          profileData,
          skillsData,
          projectsData,
          portfolioData,
          socialData,
        ] = await Promise.all([
          getStudentProfile(studentId),
          getSkills(studentId),
          getProjects(studentId),
          getPortfolio(studentId),
          getSocialLinks(studentId),
        ]);

        setProfile(profileData);
        setSkills(skillsData);
        setProjects(projectsData);
        setPortfolio(portfolioData);
        setSocialLinks(socialData);
        setLoadingState(LOADING_STATES.SUCCESS);
      } catch (err) {
        setError(err.message || "Failed to load profile data");
        setLoadingState(LOADING_STATES.ERROR);
      }
    };

    fetchAll();
  }, [studentId]);

  // ── Update Profile ───────────────────────────────────
  const saveProfile = useCallback(async (updatedData) => {
    setSaving(true);
    setError(null);
    try {
      const res = await updateStudentProfile(studentId, updatedData);
      setProfile((prev) => ({ ...prev, ...updatedData }));
      showSuccess("Profile updated successfully!");
      return true;
    } catch (err) {
      setError(err.message || "Failed to update profile");
      return false;
    } finally {
      setSaving(false);
    }
  }, [studentId]);

  // ── Upload Resume ────────────────────────────────────
  const saveResume = useCallback(async (file) => {
    setUploading(true);
    setError(null);
    try {
      const res = await uploadResume(studentId, file);
      setResume({ filename: res.filename, uploadedAt: res.uploadedAt, url: res.resumeUrl });
      setProfile((prev) => ({ ...prev, resumeUrl: res.resumeUrl }));
      showSuccess("Resume uploaded successfully!");
      return true;
    } catch (err) {
      setError(err.message || "Failed to upload resume");
      return false;
    } finally {
      setUploading(false);
    }
  }, [studentId]);

  // ── Update Skills ────────────────────────────────────
  const saveSkills = useCallback(async (updatedSkills) => {
    setSaving(true);
    setError(null);
    try {
      await updateSkills(studentId, updatedSkills);
      setSkills(updatedSkills);
      showSuccess("Skills updated successfully!");
      return true;
    } catch (err) {
      setError(err.message || "Failed to update skills");
      return false;
    } finally {
      setSaving(false);
    }
  }, [studentId]);

  // ── Update Portfolio ─────────────────────────────────
  const savePortfolio = useCallback(async (data) => {
    setSaving(true);
    setError(null);
    try {
      await updatePortfolio(studentId, data);
      setPortfolio(data);
      showSuccess("Portfolio updated successfully!");
      return true;
    } catch (err) {
      setError(err.message || "Failed to update portfolio");
      return false;
    } finally {
      setSaving(false);
    }
  }, [studentId]);

  // ── Update Social Links ──────────────────────────────
  const saveSocialLinks = useCallback(async (data) => {
    setSaving(true);
    setError(null);
    try {
      await updateSocialLinks(studentId, data);
      setSocialLinks(data);
      showSuccess("Social links updated successfully!");
      return true;
    } catch (err) {
      setError(err.message || "Failed to update social links");
      return false;
    } finally {
      setSaving(false);
    }
  }, [studentId]);

  return {
    // Data
    profile,
    skills,
    projects,
    portfolio,
    socialLinks,
    resume,

    // States
    loading: loadingState === LOADING_STATES.LOADING,
    loadingState,
    saving,
    uploading,
    error,
    successMsg,

    // Actions
    saveProfile,
    saveResume,
    saveSkills,
    savePortfolio,
    saveSocialLinks,
  };
};

export default useProfileData;
