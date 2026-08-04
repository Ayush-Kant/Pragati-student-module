import api from "../../../../services/api";

/**
 * Student Nomination & Shortlisting API Service Layer
 */

// ─── Nomination Endpoints ───────────────────────────────────────────────────

/**
 * Fetch eligible students pool (drive-scoped or global)
 * @param {Object} params - Query parameters (driveId, page, limit, search, department)
 */
export const getEligibleStudents = async (params = {}) => {
  try {
    const response = await api.get("/nominations/eligible", { params });
    return {
      success: true,
      data: response.data.data || [],
      pagination: response.data.pagination || null,
    };
  } catch (err) {
    throw new Error(
      err.response?.data?.message || "Failed to fetch eligible students"
    );
  }
};

/**
 * Fetch nominations list
 * @param {Object} params - Query parameters (driveId, status, page, limit)
 */
export const getNominations = async (params = {}) => {
  try {
    const response = await api.get("/nominations", { params });
    return {
      success: true,
      data: response.data.data || [],
      pagination: response.data.pagination || null,
    };
  } catch (err) {
    throw new Error(
      err.response?.data?.message || "Failed to fetch nominations"
    );
  }
};

/**
 * Single-student nomination
 * @param {Object} payload - { studentId, companyId, driveId, minCgpa }
 */
export const nominateStudent = async (payload) => {
  try {
    const response = await api.post("/nominations", payload);
    return {
      success: true,
      data: response.data.data,
      message: response.data.message || "Student nominated successfully",
    };
  } catch (err) {
    throw new Error(
      err.response?.data?.message || "Failed to nominate student"
    );
  }
};

/**
 * Update nomination status
 * @param {string|number} id - Nomination ID
 * @param {Object} data - { status }
 */
export const updateNomination = async (id, data) => {
  try {
    const response = await api.put(`/nominations/${id}`, data);
    return {
      success: true,
      data: response.data.data,
      message: response.data.message || "Nomination updated successfully",
    };
  } catch (err) {
    throw new Error(
      err.response?.data?.message || "Failed to update nomination"
    );
  }
};

/**
 * Remove a nomination
 * @param {string|number} id - Nomination ID
 */
export const removeNomination = async (id) => {
  try {
    const response = await api.delete(`/nominations/${id}`);
    return {
      success: true,
      message: response.data.message || "Nomination removed successfully",
    };
  } catch (err) {
    throw new Error(
      err.response?.data?.message || "Failed to remove nomination"
    );
  }
};

// ─── Shortlists & Placement Actions ───────────────────────────────────────────

/**
 * Fetch shortlisted students
 * @param {Object} params - Query parameters (companyId, status, page, limit)
 */
export const getShortlistedStudents = async (params = {}) => {
  try {
    const response = await api.get("/shortlists", { params });
    return {
      success: true,
      data: response.data.data || [],
      pagination: response.data.pagination || null,
    };
  } catch (err) {
    throw new Error(
      err.response?.data?.message || "Failed to fetch shortlisted students"
    );
  }
};

/**
 * Fetch company-specific shortlisted students
 * @param {string|number} companyId - Company ID
 * @param {Object} params - Query parameters
 */
export const getCompanyShortlist = async (companyId, params = {}) => {
  try {
    const response = await api.get(`/shortlists/company/${companyId}`, {
      params,
    });
    return {
      success: true,
      data: response.data.data || [],
      pagination: response.data.pagination || null,
    };
  } catch (err) {
    throw new Error(
      err.response?.data?.message || "Failed to fetch company shortlist"
    );
  }
};

/**
 * Update shortlisted student status (e.g. Mark Selected / Placed / Rejected)
 * @param {string|number} shortlistId - Shortlist record ID
 * @param {Object} data - Update payload ({ status })
 */
export const updateShortlistStatus = async (shortlistId, data) => {
  try {
    const response = await api.put(`/shortlists/${shortlistId}`, data);
    return {
      success: true,
      data: response.data.data,
      message: response.data.message || "Shortlist status updated",
    };
  } catch (err) {
    throw new Error(
      err.response?.data?.message || "Failed to update shortlist status"
    );
  }
};

/**
 * Remove student from shortlist
 * @param {string|number} shortlistId - Shortlist record ID
 */
export const removeShortlistEntry = async (shortlistId) => {
  try {
    const response = await api.delete(`/shortlists/${shortlistId}`);
    return {
      success: true,
      message: response.data.message || "Student removed from shortlist",
    };
  } catch (err) {
    throw new Error(
      err.response?.data?.message || "Failed to remove student from shortlist"
    );
  }
};

// ─── Analytics & Statistics ───────────────────────────────────────────────────

/**
 * Fetch real-time placement and nomination statistics
 */
export const getNominationStatistics = async () => {
  try {
    const response = await api.get("/nominations/statistics");
    return {
      success: true,
      data: response.data.data || null,
    };
  } catch (err) {
    throw new Error(
      err.response?.data?.message || "Failed to fetch placement statistics"
    );
  }
};