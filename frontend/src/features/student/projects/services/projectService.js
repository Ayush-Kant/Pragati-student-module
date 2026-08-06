/**
 * Centralized Project Service using Axios & env-based Base URL.
 * Currently uses simulated async delays resolving from projectDummyData.js.
 * Standardized so swapping internal handlers for real backend API calls requires 0 component/hook changes.
 */
import axios from "axios";
import {
  mockProjects,
  mockMilestones,
  mockSubmissions,
  mockReviews,
  mockAnalytics,
} from "../types/projectDummyData";

// Environment-based API base URL configuration
const BASE_URL = import.meta.env?.VITE_API_BASE_URL || "https://api.pragati.uptoskills.com/v1";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Helper to simulate realistic network latency during development
const simulateLatency = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export const projectService = {
  /**
   * Fetch all student projects
   */
  async getProjects() {
    await simulateLatency(300);
    // Real API call structure:
    // const response = await apiClient.get('/projects');
    // return response.data;
    return [...mockProjects];
  },

  /**
   * Fetch details for a specific project by ID
   */
  async getProjectById(id) {
    await simulateLatency(300);
    const project = mockProjects.find((p) => p.id === id) || mockProjects[0];
    if (!project) {
      throw new Error(`Project with ID ${id} not found.`);
    }
    return { ...project };
  },

  /**
   * Fetch milestones & nested tasks for a specific project
   */
  async getProjectMilestones(id) {
    await simulateLatency(350);
    const milestones = mockMilestones.filter((m) => m.projectId === id || id === "proj-101");
    return [...milestones];
  },

  /**
   * Submit a project milestone or final bundle
   */
  async submitProject(id, payload) {
    await simulateLatency(500);
    const newSubmission = {
      id: `sub-${Date.now()}`,
      projectId: id,
      title: payload.title || "Project Submission",
      notes: payload.notes || "",
      submittedBy: {
        name: "Rahul Verma",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      },
      submittedAt: new Date().toISOString(),
      status: "UNDER_REVIEW",
      githubRepoUrl: payload.githubRepoUrl || "",
      githubBranch: payload.githubBranch || "main",
      commitHash: payload.commitHash || "latest",
      uploadedFiles: payload.files || [],
    };
    mockSubmissions.unshift(newSubmission);
    return newSubmission;
  },

  /**
   * Upload files attached to a project submission
   */
  async uploadProjectFiles(id, files) {
    await simulateLatency(600);
    const uploadedFileList = Array.from(files).map((file, idx) => ({
      id: `file-${Date.now()}-${idx}`,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
      url: "#",
    }));
    return uploadedFileList;
  },

  /**
   * Fetch mentor reviews, score rubrics, and feedback timeline
   */
  async getProjectReviews(id) {
    await simulateLatency(350);
    return { ...mockReviews, projectId: id };
  },

  /**
   * Fetch analytics, progress charts, and activity data for a project
   */
  async getProjectAnalytics(id) {
    await simulateLatency(400);
    return { ...mockAnalytics, projectId: id };
  },

  /**
   * Fetch submission history for a project
   */
  async getProjectSubmissions(id) {
    await simulateLatency(300);
    return mockSubmissions.filter((s) => s.projectId === id || id === "proj-101");
  },
};
