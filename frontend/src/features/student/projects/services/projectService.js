/**
 * Service layer for the Advanced Project Workspace (MOD-07).
 * All data operations are centralised here.
 *
 * Currently backed by in-memory dummy data.
 * To integrate with the real backend, replace each function body with the
 * appropriate `fetch(...)` / `axios` call — all signatures and return shapes
 * are designed to stay identical, so no caller changes are needed.
 *
 * API_BASE_URL is read from the environment variable VITE_API_BASE_URL.
 */

import {
  dummyProjects,
  dummyMilestones,
  dummySubmissions,
  dummySubmissionHistory,
  dummyEvaluations,
} from '../types/projectDummyData';
import { MOCK_DELAY_MS } from '../constants/projectConstants';

// ─── Environment ───────────────────────────────────────────────────────────────
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ─── Private Helpers ───────────────────────────────────────────────────────────

/**
 * Simulated network latency.
 * @param {number} [ms]
 * @returns {Promise<void>}
 */
function delay(ms = MOCK_DELAY_MS) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * @template T
 * @param {T} data
 * @returns {{ success: true, data: T, error: null }}
 */
function wrapSuccess(data) {
  return { success: true, data, error: null };
}

/**
 * @param {string} [message]
 * @returns {{ success: false, data: null, error: string }}
 */
function wrapError(message = 'An unexpected error occurred.') {
  return { success: false, data: null, error: message };
}

/**
 * Deep-clone to prevent callers from mutating the in-memory store.
 * @template T
 * @param {T} value
 * @returns {T}
 */
function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

/** In-memory mutable project store. */
let projectStore = dummyProjects.map((p) => ({ ...p }));

/** In-memory mutable milestone store. */
const milestoneStore = deepClone(dummyMilestones);

/** In-memory mutable submission store. */
const submissionStore = deepClone(dummySubmissions);

/** In-memory mutable submission history store. */
const historyStore = deepClone(dummySubmissionHistory);

/** In-memory uploaded files store (per project). */
const uploadedFilesStore = {};

// ─── Public Service Methods ────────────────────────────────────────────────────

/**
 * Fetch all projects for the authenticated student.
 *
 * @returns {Promise<{ success: boolean, data: object[] | null, error: string | null }>}
 */
export async function getProjects() {
  try {
    await delay();
    // TODO: Replace with real API call.
    // const res = await fetch(`${API_BASE_URL}/student/projects`, { credentials: 'include' });
    // if (!res.ok) throw new Error(`HTTP ${res.status}`);
    // return wrapSuccess(await res.json());
    return wrapSuccess(projectStore.map((p) => deepClone(p)));
  } catch (err) {
    return wrapError(err.message || 'Failed to fetch projects.');
  }
}

/**
 * Fetch a single project by ID.
 *
 * @param {string} projectId
 * @returns {Promise<{ success: boolean, data: object | null, error: string | null }>}
 */
export async function getProjectById(projectId) {
  try {
    await delay();
    // TODO: Replace with real API call.
    // const res = await fetch(`${API_BASE_URL}/student/projects/${projectId}`, { credentials: 'include' });
    // if (!res.ok) throw new Error(`HTTP ${res.status}`);
    // return wrapSuccess(await res.json());
    const project = projectStore.find((p) => p.id === projectId);
    if (!project) return wrapError(`Project "${projectId}" not found.`);
    return wrapSuccess(deepClone(project));
  } catch (err) {
    return wrapError(err.message || 'Failed to fetch project details.');
  }
}

/**
 * Fetch milestones for a project.
 *
 * @param {string} projectId
 * @returns {Promise<{ success: boolean, data: object[] | null, error: string | null }>}
 */
export async function getMilestones(projectId) {
  try {
    await delay();
    // TODO: Replace with real API call.
    // const res = await fetch(`${API_BASE_URL}/student/projects/${projectId}/milestones`, { credentials: 'include' });
    // if (!res.ok) throw new Error(`HTTP ${res.status}`);
    // return wrapSuccess(await res.json());
    const milestones = milestoneStore[projectId] ?? [];
    return wrapSuccess(deepClone(milestones));
  } catch (err) {
    return wrapError(err.message || 'Failed to fetch milestones.');
  }
}

/**
 * Fetch the current submission for a project.
 *
 * @param {string} projectId
 * @returns {Promise<{ success: boolean, data: object | null, error: string | null }>}
 */
export async function getProjectSubmission(projectId) {
  try {
    await delay();
    // TODO: Replace with real API call.
    // const res = await fetch(`${API_BASE_URL}/student/projects/${projectId}/submission`, { credentials: 'include' });
    // if (!res.ok) throw new Error(`HTTP ${res.status}`);
    // return wrapSuccess(await res.json());
    const submission = submissionStore[projectId] ?? null;
    return wrapSuccess(submission ? deepClone(submission) : null);
  } catch (err) {
    return wrapError(err.message || 'Failed to fetch submission.');
  }
}

/**
 * Submit a project.
 *
 * @param {string} projectId
 * @param {{ githubUrl: string, deploymentUrl?: string, description: string, documentation?: string, additionalComments?: string, fileIds?: string[] }} payload
 * @returns {Promise<{ success: boolean, data: object | null, error: string | null }>}
 */
export async function submitProject(projectId, payload) {
  try {
    await delay(1500);
    // TODO: Replace with real API call.
    // const res = await fetch(`${API_BASE_URL}/student/projects/${projectId}/submit`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   credentials: 'include',
    //   body: JSON.stringify(payload),
    // });
    // if (!res.ok) throw new Error(`HTTP ${res.status}`);
    // return wrapSuccess(await res.json());

    const existingVersions = historyStore[projectId]?.length ?? 0;
    const submission = {
      id: `sub-${projectId}-${Date.now()}`,
      projectId,
      version: existingVersions + 1,
      githubUrl: payload.githubUrl,
      deploymentUrl: payload.deploymentUrl || null,
      description: payload.description,
      documentation: payload.documentation || null,
      additionalComments: payload.additionalComments || null,
      files: (uploadedFilesStore[projectId] ?? []).filter((f) =>
        (payload.fileIds ?? []).includes(f.id)
      ),
      submittedAt: new Date().toISOString(),
      status: 'submitted',
    };

    submissionStore[projectId] = deepClone(submission);

    if (!historyStore[projectId]) historyStore[projectId] = [];
    historyStore[projectId].unshift({
      id: submission.id,
      projectId,
      version: submission.version,
      submittedAt: submission.submittedAt,
      status: 'submitted',
      feedback: null,
      canResubmit: false,
    });

    // Update project status in store
    projectStore = projectStore.map((p) =>
      p.id === projectId ? { ...p, status: 'Submitted', submissionStatus: 'submitted' } : p
    );

    return wrapSuccess(deepClone(submission));
  } catch (err) {
    return wrapError(err.message || 'Failed to submit project.');
  }
}

/**
 * Fetch submission history for a project.
 *
 * @param {string} projectId
 * @returns {Promise<{ success: boolean, data: object[] | null, error: string | null }>}
 */
export async function getSubmissionHistory(projectId) {
  try {
    await delay();
    // TODO: Replace with real API call.
    // const res = await fetch(`${API_BASE_URL}/student/projects/${projectId}/submissions`, { credentials: 'include' });
    // if (!res.ok) throw new Error(`HTTP ${res.status}`);
    // return wrapSuccess(await res.json());
    const history = historyStore[projectId] ?? [];
    return wrapSuccess(deepClone(history));
  } catch (err) {
    return wrapError(err.message || 'Failed to fetch submission history.');
  }
}

/**
 * Upload a file attachment for a project (multipart-ready stub).
 *
 * @param {string} projectId
 * @param {File} file
 * @param {{ onProgress?: (pct: number) => void }} [options]
 * @returns {Promise<{ success: boolean, data: object | null, error: string | null }>}
 */
export async function uploadProjectFile(projectId, file, options = {}) {
  try {
    // Simulate progress callbacks
    const steps = [20, 40, 60, 80, 100];
    for (const pct of steps) {
      await delay(MOCK_DELAY_MS / 5);
      options.onProgress?.(pct);
    }

    // TODO: Replace with real multipart upload.
    // const formData = new FormData();
    // formData.append('file', file);
    // const res = await fetch(`${API_BASE_URL}/student/projects/${projectId}/files`, {
    //   method: 'POST',
    //   credentials: 'include',
    //   body: formData,
    // });
    // if (!res.ok) throw new Error(`HTTP ${res.status}`);
    // return wrapSuccess(await res.json());

    const uploadedFile = {
      id: `file-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
    };

    if (!uploadedFilesStore[projectId]) uploadedFilesStore[projectId] = [];
    uploadedFilesStore[projectId].push(uploadedFile);

    return wrapSuccess(deepClone(uploadedFile));
  } catch (err) {
    return wrapError(err.message || 'File upload failed.');
  }
}

/**
 * Delete an uploaded file from a project.
 *
 * @param {string} projectId
 * @param {string} fileId
 * @returns {Promise<{ success: boolean, data: null, error: string | null }>}
 */
export async function deleteProjectFile(projectId, fileId) {
  try {
    await delay(300);
    // TODO: Replace with real API call.
    // const res = await fetch(`${API_BASE_URL}/student/projects/${projectId}/files/${fileId}`, {
    //   method: 'DELETE',
    //   credentials: 'include',
    // });
    // if (!res.ok) throw new Error(`HTTP ${res.status}`);
    // return wrapSuccess(null);

    if (uploadedFilesStore[projectId]) {
      uploadedFilesStore[projectId] = uploadedFilesStore[projectId].filter(
        (f) => f.id !== fileId
      );
    }
    return wrapSuccess(null);
  } catch (err) {
    return wrapError(err.message || 'Failed to delete file.');
  }
}

/**
 * Fetch the evaluation result for a project.
 *
 * @param {string} projectId
 * @returns {Promise<{ success: boolean, data: object | null, error: string | null }>}
 */
export async function getProjectEvaluation(projectId) {
  try {
    await delay();
    // TODO: Replace with real API call.
    // const res = await fetch(`${API_BASE_URL}/student/projects/${projectId}/evaluation`, { credentials: 'include' });
    // if (!res.ok) throw new Error(`HTTP ${res.status}`);
    // return wrapSuccess(await res.json());
    const evaluation = dummyEvaluations[projectId] ?? null;
    return wrapSuccess(evaluation ? deepClone(evaluation) : null);
  } catch (err) {
    return wrapError(err.message || 'Failed to fetch evaluation.');
  }
}

const projectService = {
  getProjects,
  getProjectById,
  getMilestones,
  getProjectSubmission,
  submitProject,
  getSubmissionHistory,
  uploadProjectFile,
  deleteProjectFile,
  getProjectEvaluation,
};

export default projectService;
