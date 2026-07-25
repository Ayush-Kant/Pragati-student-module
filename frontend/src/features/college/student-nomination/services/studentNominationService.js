import api from "../../../../services/api";
import {
  eligibleStudents as dummyEligible,
  nominatedStudents as dummyNominated,
} from "../types/studentNominationDummyData";

const USE_DUMMY = false;

// ─── Legacy: global eligible students (non-drive-scoped) ─────────────────────
// Reads from /api/students/eligible-pool which is backed by the students table.
// This is used on the nomination page when no drive is selected.
export const getEligibleStudents = async (params = {}) => {
  if (USE_DUMMY) return { success: true, data: dummyEligible };
  try {
    const response = await api.get("/students/eligible-pool", { params });
    return {
      success: true,
      data: response.data.data || [],
      pagination: response.data.pagination,
    };
  } catch {
    return { success: true, data: dummyEligible };
  }
};

// ─── Legacy: global nominations (non-drive-scoped) ───────────────────────────
export const getNominations = async (params = {}) => {
  if (USE_DUMMY) return { success: true, data: dummyNominated };
  try {
    const response = await api.get("/nominations", { params });
    return {
      success: true,
      data: response.data.data,
      pagination: response.data.pagination,
    };
  } catch {
    return { success: true, data: dummyNominated };
  }
};

// ─── Drive-scoped: eligible students for a specific drive ────────────────────
export const getEligibleForDrive = async (driveId) => {
  try {
    const response = await api.get(`/placement-drives/${driveId}/eligible`);
    return {
      success: true,
      data: response.data.data || [],
    };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Failed to fetch eligible students",
      data: [],
    };
  }
};

// ─── Drive-scoped: get all nominations for a drive ───────────────────────────
export const getDriveNominations = async (driveId, params = {}) => {
  try {
    const response = await api.get(`/placement-drives/${driveId}/nominations`, { params });
    return {
      success: true,
      data: response.data.data || [],
      pagination: response.data.pagination,
    };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Failed to fetch nominations",
      data: [],
    };
  }
};

// ─── Drive-scoped: get nominees (registered students) for a drive ─────────────
export const getDriveNominees = async (driveId) => {
  try {
    const response = await api.get(`/placement-drives/${driveId}/nominees`);
    return {
      success: true,
      data: response.data.data || [],
    };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Failed to fetch nominees",
      data: [],
    };
  }
};

// ─── Drive-scoped: bulk nominate students ────────────────────────────────────
export const nominateStudentsToDrive = async (driveId, studentIds) => {
  try {
    const response = await api.post(`/placement-drives/${driveId}/nominate`, {
      studentIds,
    });
    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
    };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Failed to nominate students",
    };
  }
};

// ─── Drive-scoped: bulk shortlist students ────────────────────────────────────
export const shortlistStudentsForDrive = async (driveId, studentIds) => {
  try {
    const response = await api.put(`/placement-drives/${driveId}/shortlist`, {
      studentIds,
    });
    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
    };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Failed to shortlist students",
    };
  }
};

// ─── Drive-scoped: approve / reject a student's eligibility ──────────────────
export const setStudentEligibility = async (driveId, studentId, approved) => {
  try {
    const response = await api.put(
      `/placement-drives/${driveId}/eligibility/${studentId}`,
      { approved }
    );
    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
    };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Failed to update eligibility",
    };
  }
};

// ─── Legacy: single-student nomination (non-drive-scoped) ────────────────────
export const nominateStudent = async (data) => {
  try {
    const response = await api.post("/nominations", data);
    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
    };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Failed to nominate student",
    };
  }
};

// ─── Legacy: update nomination status ────────────────────────────────────────
export const updateNomination = async (id, data) => {
  try {
    const response = await api.put(`/nominations/${id}`, data);
    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
    };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Failed to update nomination",
    };
  }
};

// ─── Legacy: remove a nomination ─────────────────────────────────────────────
export const removeNomination = async (id) => {
  try {
    const response = await api.delete(`/nominations/${id}`);
    return { success: true, message: response.data.message };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Failed to remove nomination",
    };
  }
};

// ─── Shortlists ───────────────────────────────────────────────────────────────
export const getShortlistedStudents = async (params = {}) => {
  try {
    const response = await api.get("/shortlists", { params });
    return {
      success: true,
      data: response.data.data,
      pagination: response.data.pagination,
    };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Failed to fetch shortlisted students",
      data: [],
    };
  }
};

export const getCompanyShortlist = async (companyId, params = {}) => {
  try {
    const response = await api.get(`/shortlists/company/${companyId}`, { params });
    return { success: true, data: response.data.data };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Failed to fetch company shortlist",
      data: [],
    };
  }
};

export const getNominationStatistics = async () => {
  try {
    const response = await api.get("/nominations/statistics");
    return { success: true, data: response.data.data };
  } catch {
    return { success: false, data: null };
  }
};
