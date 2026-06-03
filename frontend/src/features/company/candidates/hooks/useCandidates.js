import { useState, useEffect, useCallback } from 'react';
import { candidateService } from '../services/candidateService';

export const useCandidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    college: '',
    role: ''
  });

  // Get unique values for filter dropdowns
  const getUniqueValues = useCallback((key) => {
    return [...new Set(candidates.map(c => c[key]))].sort();
  }, [candidates]);

  // Fetch all candidates
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        const data = await candidateService.getAllCandidates();
        setCandidates(data);
        setFilteredCandidates(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch candidates');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  // Apply filters and search
  useEffect(() => {
    const applyFilters = async () => {
      try {
        let result = [...candidates];

        // Apply search filter
        if (filters.search) {
          result = result.filter(c =>
            c.name.toLowerCase().includes(filters.search.toLowerCase()) ||
            c.role.toLowerCase().includes(filters.search.toLowerCase()) ||
            c.college.toLowerCase().includes(filters.search.toLowerCase())
          );
        }

        // Apply status filter
        if (filters.status) {
          result = result.filter(c => c.status === filters.status);
        }

        // Apply college filter
        if (filters.college) {
          result = result.filter(c => c.college === filters.college);
        }

        // Apply role filter
        if (filters.role) {
          result = result.filter(c => c.role === filters.role);
        }

        setFilteredCandidates(result);
      } catch (err) {
        console.error('Error applying filters:', err);
      }
    };

    applyFilters();
  }, [filters, candidates]);

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
      role: ''
    });
  }, []);

  // Update candidate status
  const updateCandidateStatus = useCallback(async (id, status) => {
    try {
      await candidateService.updateCandidateStatus(id, status);
      setCandidates(prev =>
        prev.map(c => c.id === id ? { ...c, status } : c)
      );
      setError(null);
    } catch (err) {
      setError('Failed to update candidate status');
      console.error(err);
    }
  }, []);

  // Update all candidate fields (used by Edit modal)
  const updateCandidate = useCallback((id, updatedFields) => {
    setCandidates(prev =>
      prev.map(c => c.id === id ? { ...c, ...updatedFields } : c)
    );
  }, []);

  return {
    candidates: filteredCandidates,
    allCandidates: candidates,
    loading,
    error,
    filters,
    updateFilter,
    resetFilters,
    updateCandidateStatus,
    updateCandidate,
    getUniqueValues,
    totalCandidates: filteredCandidates.length
  };
};
