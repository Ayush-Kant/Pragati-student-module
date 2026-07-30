import axios from 'axios';
import {
  dummyProjects,
  dummyMilestones,
  dummySubmissions,
  dummyFeedback,
  dummyAnalytics,
} from '../types/projectDummyData';

// API Base URL from env variable (Section 3 rule: No hardcoded API URLs anywhere)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.pragati.uptoskills.com/v1';

// Optional Axios instance configured for future real backend integration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper to simulate realistic async network latency (300-600ms)
const simulateNetworkDelay = (ms = 400) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fetch list of all student projects
 * @returns {Promise<Array>} List of projects
 */
export const getProjects = async () => {
  await simulateNetworkDelay();
  
  /* REAL BACKEND SWAP LINE:
  // const response = await apiClient.get('/student/projects');
  // return response.data;
  */

  return [...dummyProjects];
};

/**
 * Fetch detailed view of a single project by ID
 * @param {string} projectId
 * @returns {Promise<Object>} Single project object
 */
export const getProjectById = async (projectId) => {
  await simulateNetworkDelay();

  /* REAL BACKEND SWAP LINE:
  // const response = await apiClient.get(`/student/projects/${projectId}`);
  // return response.data;
  */

  const project = dummyProjects.find((p) => p.id === projectId);
  if (!project) {
    throw new Error(`Project with ID "${projectId}" was not found.`);
  }
  return { ...project };
};

/**
 * Fetch milestones and nested tasks for a specific project
 * @param {string} projectId
 * @returns {Promise<Array>} List of milestones
 */
export const getMilestones = async (projectId) => {
  await simulateNetworkDelay();

  /* REAL BACKEND SWAP LINE:
  // const response = await apiClient.get(`/student/projects/${projectId}/milestones`);
  // return response.data;
  */

  const milestones = dummyMilestones[projectId] || [];
  return JSON.parse(JSON.stringify(milestones));
};

/**
 * Submit project deliverable/version
 * @param {string} projectId
 * @param {Object} payload - { title, notes, githubRepoUrl, files }
 * @returns {Promise<Object>} Created submission object
 */
export const submitProject = async (projectId, payload) => {
  await simulateNetworkDelay(600);

  /* REAL BACKEND SWAP LINE:
  // const response = await apiClient.post(`/student/projects/${projectId}/submissions`, payload);
  // return response.data;
  */

  const newSubmission = {
    id: `sub-${Date.now()}`,
    projectId,
    version: `v${((dummySubmissions[projectId]?.length || 0) + 1)}.0-draft`,
    submittedAt: new Date().toISOString(),
    status: 'submitted',
    title: payload.title,
    notes: payload.notes,
    githubRepoUrl: payload.githubRepoUrl,
    commitHash: Math.random().toString(36).substring(2, 9),
    files: payload.files || [],
  };

  if (!dummySubmissions[projectId]) {
    dummySubmissions[projectId] = [];
  }
  dummySubmissions[projectId].unshift(newSubmission);

  return newSubmission;
};

/**
 * Upload files attached to a project deliverable
 * @param {string} projectId
 * @param {Array<File>} files
 * @returns {Promise<Array<Object>>} Formatted file records
 */
export const uploadProjectFiles = async (projectId, files) => {
  await simulateNetworkDelay(700);

  /* REAL BACKEND SWAP LINE:
  // const formData = new FormData();
  // files.forEach(file => formData.append('files', file));
  // const response = await apiClient.post(`/student/projects/${projectId}/files`, formData);
  // return response.data;
  */

  return Array.from(files).map((f) => ({
    name: f.name,
    size: f.size,
    type: f.type || 'application/octet-stream',
    url: URL.createObjectURL(f),
  }));
};

/**
 * Fetch mentor review & evaluation feedback for a project
 * @param {string} projectId
 * @returns {Promise<Object|null>} Feedback object
 */
export const getProjectFeedback = async (projectId) => {
  await simulateNetworkDelay();

  /* REAL BACKEND SWAP LINE:
  // const response = await apiClient.get(`/student/projects/${projectId}/feedback`);
  // return response.data;
  */

  return dummyFeedback[projectId] ? JSON.parse(JSON.stringify(dummyFeedback[projectId])) : null;
};

/**
 * Fetch project analytics data (charts, statistics, activity timeline)
 * @param {string} projectId
 * @returns {Promise<Object>} Analytics metadata object
 */
export const getProjectAnalytics = async (projectId) => {
  await simulateNetworkDelay();

  /* REAL BACKEND SWAP LINE:
  // const response = await apiClient.get(`/student/projects/${projectId}/analytics`);
  // return response.data;
  */

  const analytics = dummyAnalytics[projectId];
  if (!analytics) {
    // Generate default analytics structure if none exists
    return {
      projectId,
      completionPercentage: 0,
      tasksCompleted: 0,
      totalTasks: 0,
      milestonesCompleted: 0,
      totalMilestones: 0,
      daysRemaining: 14,
      velocity: 0,
      weeklyProgress: [],
      taskDistribution: [
        { name: 'Completed', value: 0, color: '#10b981' },
        { name: 'In Progress', value: 0, color: '#3b82f6' },
        { name: 'To Do', value: 1, color: '#64748b' }
      ],
      activityLog: []
    };
  }

  return JSON.parse(JSON.stringify(analytics));
};
