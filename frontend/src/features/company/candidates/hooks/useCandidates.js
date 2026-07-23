import { useState, useEffect, useCallback } from 'react';
import { candidateService } from '../services/candidateService';

export const useCandidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [allCandidates, setAllCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    college: '',
    role: '',
    skills: '',
    gpa: '',
    location: '',
    assessmentScore: ''
  });

  // Get unique values for filter dropdowns from unfiltered candidate list
  const getUniqueValues = useCallback((key) => {
    const list = allCandidates.length > 0 ? allCandidates : candidates;
    return [...new Set(list.map(c => c[key]).filter(Boolean))].sort();
  }, [allCandidates, candidates]);

  // Fetch filtered candidates
  const fetchCandidates = useCallback(async () => {
    try {
      setLoading(true);
      const data = await candidateService.getAllCandidates(filters);
      setCandidates(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch candidates');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  // Fetch initial allCandidates for filter lists once on mount
  useEffect(() => {
    const initFetch = async () => {
      try {
        const data = await candidateService.getAllCandidates();
        setAllCandidates(data);
      } catch (err) {
        console.error('Failed to fetch initial candidates for filters:', err);
      }
    };
    initFetch();
  }, []);

  // Update specific filter
  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setFilters({
      search: '',
      status: '',
      college: '',
      role: '',
      skills: '',
      gpa: '',
      location: '',
      assessmentScore: ''
    });
  }, []);

  // Update candidate status (shortlist/reject)
  const updateCandidateStatus = useCallback(async (id, status) => {
    try {
      await candidateService.updateCandidateStatus(id, status);
      // Refresh the filtered list
      await fetchCandidates();
      setError(null);
    } catch (err) {
      setError('Failed to update candidate status');
      console.error(err);
    }
  }, [fetchCandidates]);

  // Update candidate details / stage / notes
  const updateCandidate = useCallback(async (id, updatedFields) => {
    try {
      let currentStage = 'screening';
      if (updatedFields.status === 'Shortlisted') {
        currentStage = 'shortlist';
      } else if (updatedFields.status === 'Assessment') {
        currentStage = 'screening';
      } else if (updatedFields.status === 'Interview') {
        currentStage = 'interviews';
      } else if (updatedFields.status === 'Rejected' || updatedFields.status === 'Offered') {
        currentStage = 'selection';
      }
      
      const payload = {
        current_stage: currentStage,
        stage: updatedFields.status,
        notes: updatedFields.notes
      };
      await candidateService.moveCandidateStage(id, payload);
      await fetchCandidates();
      setError(null);
    } catch (err) {
      setError('Failed to update candidate details');
      console.error(err);
    }
  }, [fetchCandidates]);

  // Export list
  const exportCandidates = useCallback(async () => {
    try {
      await candidateService.exportCandidates(filters);
    } catch (err) {
      setError('Failed to export candidates list');
      console.error(err);
    }
  }, [filters]);

  // Bulk Shortlist
  const bulkShortlistCandidates = useCallback(async (ids) => {
    try {
      setLoading(true);
      await candidateService.bulkShortlistCandidates(ids);
      await fetchCandidates();
      setError(null);
    } catch (err) {
      setError('Failed to bulk shortlist candidates');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [fetchCandidates]);

  // Bulk Reject
  const bulkRejectCandidates = useCallback(async (ids) => {
    try {
      setLoading(true);
      await candidateService.bulkRejectCandidates(ids);
      await fetchCandidates();
      setError(null);
    } catch (err) {
      setError('Failed to bulk reject candidates');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [fetchCandidates]);

  // Bulk Move Stage
  const bulkMoveCandidatesStage = useCallback(async (ids, status) => {
    try {
      setLoading(true);
      let currentStage = 'screening';
      if (status === 'Shortlisted') {
        currentStage = 'shortlist';
      } else if (status === 'Assessment') {
        currentStage = 'screening';
      } else if (status === 'Interview') {
        currentStage = 'interviews';
      } else if (status === 'Rejected' || status === 'Offered') {
        currentStage = 'selection';
      }

      await candidateService.bulkMoveCandidatesStage(ids, { current_stage: currentStage, stage: status });
      await fetchCandidates();
      setError(null);
    } catch (err) {
      setError('Failed to bulk move candidates stage');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [fetchCandidates]);

  return {
    candidates,
    allCandidates,
    loading,
    error,
    filters,
    updateFilter,
    resetFilters,
    updateCandidateStatus,
    updateCandidate,
    exportCandidates,
    bulkShortlistCandidates,
    bulkRejectCandidates,
    bulkMoveCandidatesStage,
    getUniqueValues,
    totalCandidates: candidates.length
  };
};
