import { useState, useEffect, useCallback } from 'react';
import { questionBankService } from '../services/questionBankService';

export function useAttempts() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAttempt, setSelectedAttempt] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [filters, setFilters] = useState({
    search: '',
    status: '',
    page: 1,
    pageSize: 10,
  });
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, page: 1 });

  const fetchAttempts = useCallback(async (currentFilters) => {
    try {
      setLoading(true);
      setError(null);
      const f = currentFilters || filters;
      const result = await questionBankService.getAttempts(f);
      setAttempts(result.data);
      setPagination({ total: result.total, totalPages: result.totalPages, page: result.page });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchAttempts(filters);
  }, [filters.page, filters.status]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: key !== 'page' ? 1 : value }));
  }, []);

  const searchAttempts = useCallback((value) => {
    setFilters(prev => ({ ...prev, search: value, page: 1 }));
    fetchAttempts({ ...filters, search: value, page: 1 });
  }, [filters, fetchAttempts]);

  const goToPage = useCallback((page) => {
    setFilters(prev => ({ ...prev, page }));
  }, []);

  const openDrawer = useCallback(async (attemptId) => {
    const attempt = await questionBankService.getAttemptById(attemptId);
    setSelectedAttempt(attempt);
    setDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    setSelectedAttempt(null);
  }, []);

  return {
    attempts, loading, error,
    filters, pagination,
    selectedAttempt, drawerOpen,
    updateFilter, searchAttempts, goToPage,
    openDrawer, closeDrawer,
    refetch: () => fetchAttempts(filters),
  };
}

export default useAttempts;
