import api from '../../../../services/api';

// Candidate Service
export const candidateService = {
  // Get all candidates
  getAllCandidates: async (filters = {}) => {
    try {
      const response = await api.get('/v1/company/candidates', { params: filters });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching candidates:', error);
      throw error;
    }
  },

  // Get candidate by ID
  getCandidateById: async (id) => {
    try {
      const response = await api.get(`/v1/company/candidates/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching candidate:', error);
      throw error;
    }
  },

  // Search candidates
  searchCandidates: async (query) => {
    try {
      const response = await api.get('/v1/company/candidates', { params: { search: query } });
      return response.data.data;
    } catch (error) {
      console.error('Error searching candidates:', error);
      throw error;
    }
  },

  // Filter candidates
  filterCandidates: async (filters = {}) => {
    try {
      const response = await api.get('/v1/company/candidates', { params: filters });
      return response.data.data;
    } catch (error) {
      console.error('Error filtering candidates:', error);
      throw error;
    }
  },

  // Update candidate status
  updateCandidateStatus: async (id, status) => {
    try {
      let response;
      if (status === 'Shortlisted') {
        response = await api.patch(`/v1/company/candidates/${id}/shortlist`);
      } else if (status === 'Rejected') {
        response = await api.patch(`/v1/company/candidates/${id}/reject`);
      } else {
        response = await api.patch(`/v1/company/candidates/${id}/movestage`, { stage: status });
      }
      return response.data;
    } catch (error) {
      console.error('Error updating candidate status:', error);
      throw error;
    }
  },

  // Move candidate stage
  moveCandidateStage: async (id, payload) => {
    try {
      const response = await api.patch(`/v1/company/candidates/${id}/movestage`, payload);
      return response.data;
    } catch (error) {
      console.error('Error moving candidate stage:', error);
      throw error;
    }
  },

  // Export candidates as CSV
  exportCandidates: async (filters = {}) => {
    try {
      const response = await api.get('/v1/company/candidates/export', {
        params: filters,
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'candidates_list.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting candidates:', error);
      throw error;
    }
  },

  // Bulk Shortlist
  bulkShortlistCandidates: async (ids) => {
    try {
      const response = await api.patch('/v1/company/candidates/bulk-shortlist', { ids });
      return response.data;
    } catch (error) {
      console.error('Error bulk shortlisting candidates:', error);
      throw error;
    }
  },

  // Bulk Reject
  bulkRejectCandidates: async (ids) => {
    try {
      const response = await api.patch('/v1/company/candidates/bulk-reject', { ids });
      return response.data;
    } catch (error) {
      console.error('Error bulk rejecting candidates:', error);
      throw error;
    }
  },

  // Bulk Move Stage
  bulkMoveCandidatesStage: async (ids, payload) => {
    try {
      const response = await api.patch('/v1/company/candidates/bulk-movestage', { ids, ...payload });
      return response.data;
    } catch (error) {
      console.error('Error bulk moving candidates stage:', error);
      throw error;
    }
  }
};
