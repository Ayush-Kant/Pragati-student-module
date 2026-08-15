// src/features/student/placement/services/placementService.js
// Placement API service client.
// Normalizes every response into a consistent { data, error } shape.
// Uses shared apiClient (no hardcoded base URLs).
// Falls back to offline dummy data in dev mode when VITE_USE_MOCK=true.

import apiClient from '@/lib/apiClient';
import {
  dummyProfile,
  dummyPlacementOverview,
  dummySkillReadiness,
  dummyAssessments,
  dummyApplications,
  dummyReadinessReport,
  dummyRecommendations,
} from '../types/placementDummyData';
import { buildApplicationQueryParams } from '../utils/applicationHelpers';

const IS_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

// Helper to simulate short network delay for smooth UI transition demo in mock mode
const mockDelay = (ms = 180) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Normalizes an API response or throws standard error
 */
function normalizeResponse(response) {
  if (response && typeof response.data !== 'undefined') {
    // If backend already wraps with { data: ..., ... }
    const rawData = response.data?.data !== undefined ? response.data.data : response.data;
    return { data: rawData, error: null };
  }
  return { data: response, error: null };
}

function normalizeError(err) {
  const message =
    err?.message ||
    err?.response?.data?.message ||
    'An error occurred while communicating with the server.';
  return {
    data: null,
    error: {
      message,
      status: err?.status || err?.response?.status || 500,
      code: err?.code || err?.response?.data?.code || 'FETCH_ERROR',
    },
  };
}

/**
 * 1. Fetch Complete Placement Dashboard
 * GET /api/student/placement/dashboard
 */
export async function getPlacementDashboard() {
  if (IS_MOCK) {
    await mockDelay();
    return {
      data: {
        overview: dummyPlacementOverview,
        skills: dummySkillReadiness,
        assessments: dummyAssessments,
        applications: dummyApplications,
        recommendations: dummyRecommendations,
      },
      error: null,
    };
  }

  try {
    const res = await apiClient.get('/student/placement/dashboard');
    return normalizeResponse(res);
  } catch (err) {
    return normalizeError(err);
  }
}

/**
 * 2. Fetch Career Profile
 * GET /api/student/placement/profile
 */
export async function getCareerProfile() {
  if (IS_MOCK) {
    await mockDelay();
    return { data: dummyProfile, error: null };
  }

  try {
    const res = await apiClient.get('/student/placement/profile');
    return normalizeResponse(res);
  } catch (err) {
    return normalizeError(err);
  }
}

/**
 * 3. Fetch Skill Readiness
 * GET /api/student/placement/skills
 */
export async function getSkillReadiness() {
  if (IS_MOCK) {
    await mockDelay();
    return { data: dummySkillReadiness, error: null };
  }

  try {
    const res = await apiClient.get('/student/placement/skills');
    return normalizeResponse(res);
  } catch (err) {
    return normalizeError(err);
  }
}

/**
 * 4. Fetch Assessment Performance
 * GET /api/student/placement/assessments
 */
export async function getAssessmentPerformance() {
  if (IS_MOCK) {
    await mockDelay();
    return { data: dummyAssessments, error: null };
  }

  try {
    const res = await apiClient.get('/student/placement/assessments');
    return normalizeResponse(res);
  } catch (err) {
    return normalizeError(err);
  }
}

/**
 * 5. Fetch Applications with Filters & Pagination
 * GET /api/student/placement/applications
 */
export async function getApplications(filters = {}) {
  if (IS_MOCK) {
    await mockDelay();
    let list = [...dummyApplications.applications];

    if (filters.status) {
      list = list.filter((app) => app.status === filters.status);
    }
    if (filters.jobType) {
      list = list.filter((app) => app.jobType === filters.jobType);
    }
    if (filters.location) {
      const loc = filters.location.toLowerCase();
      list = list.filter((app) => app.location?.toLowerCase().includes(loc));
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (app) =>
          app.company.toLowerCase().includes(q) ||
          app.jobTitle.toLowerCase().includes(q)
      );
    }

    const page = filters.page || 1;
    const pageSize = filters.pageSize || 10;
    const total = list.length;
    const totalPages = Math.ceil(total / pageSize) || 1;
    const startIndex = (page - 1) * pageSize;
    const paginatedApps = list.slice(startIndex, startIndex + pageSize);

    return {
      data: {
        total,
        page,
        pageSize,
        totalPages,
        applications: paginatedApps,
      },
      error: null,
    };
  }

  try {
    const params = buildApplicationQueryParams(filters);
    const res = await apiClient.get('/student/placement/applications', { params });
    return normalizeResponse(res);
  } catch (err) {
    return normalizeError(err);
  }
}

/**
 * 6. Fetch Application By ID
 * GET /api/student/placement/applications/:applicationId
 */
export async function getApplicationById(applicationId) {
  if (!applicationId) {
    return { data: null, error: { message: 'Application ID is required' } };
  }

  if (IS_MOCK) {
    await mockDelay();
    const app = dummyApplications.applications.find(
      (a) => a.applicationId === applicationId
    );
    if (!app) {
      return {
        data: null,
        error: { message: `Application ${applicationId} not found`, status: 404 },
      };
    }
    return { data: app, error: null };
  }

  try {
    const res = await apiClient.get(`/student/placement/applications/${applicationId}`);
    return normalizeResponse(res);
  } catch (err) {
    return normalizeError(err);
  }
}

/**
 * 7. Fetch Readiness Report
 * GET /api/student/placement/readiness
 */
export async function getReadinessReport() {
  if (IS_MOCK) {
    await mockDelay();
    return { data: dummyReadinessReport, error: null };
  }

  try {
    const res = await apiClient.get('/student/placement/readiness');
    return normalizeResponse(res);
  } catch (err) {
    return normalizeError(err);
  }
}

/**
 * 8. Fetch Career Recommendations
 * GET /api/student/placement/recommendations
 */
export async function getCareerRecommendations() {
  if (IS_MOCK) {
    await mockDelay();
    return { data: dummyRecommendations, error: null };
  }

  try {
    const res = await apiClient.get('/student/placement/recommendations');
    return normalizeResponse(res);
  } catch (err) {
    return normalizeError(err);
  }
}
