import { useState, useEffect, useCallback, useRef } from 'react';
import { questionBankService } from '../services/questionBankService';

export function useQuestionBank() {
  const [questions, setQuestions] = useState([]);
  const [stats, setStats] = useState({ total: 0, mcqs: 0, recentlyAdded: 0, avgDifficulty: 'Medium' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [tags, setTags] = useState([]);

  const [filters, setFilters] = useState({
    search: '',
    type: '',
    difficulty: '',
    tags: [],
    sort: 'newest',
    page: 1,
    pageSize: 10,
  });
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, page: 1 });

  const searchTimerRef = useRef(null);

  const fetchQuestions = useCallback(async (currentFilters) => {
    try {
      setLoading(true);
      setError(null);
      const result = await questionBankService.getQuestions(currentFilters || filters);
      setQuestions(result.data);
      setPagination({ total: result.total, totalPages: result.totalPages, page: result.page });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchStats = useCallback(async () => {
    try {
      const result = await questionBankService.getStats();
      setStats(result);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  }, []);

  const fetchTags = useCallback(async () => {
    try {
      const result = await questionBankService.getTags();
      setTags(result);
    } catch (err) {
      console.error('Failed to fetch tags:', err);
    }
  }, []);

  useEffect(() => {
    fetchQuestions(filters);
    fetchStats();
    fetchTags();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchQuestions(filters);
  }, [filters.type, filters.difficulty, filters.sort, filters.page, filters.pageSize, JSON.stringify(filters.tags)]); // eslint-disable-line react-hooks/exhaustive-deps

  // Debounced search
  const handleSearch = useCallback((value) => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    setFilters(prev => ({ ...prev, search: value }));
    searchTimerRef.current = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: value, page: 1 }));
      fetchQuestions({ ...filters, search: value, page: 1 });
    }, 400);
  }, [filters, fetchQuestions]);

  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  }, []);

  const resetFilters = useCallback(() => {
    const reset = { search: '', type: '', difficulty: '', tags: [], sort: 'newest', page: 1, pageSize: 10 };
    setFilters(reset);
    fetchQuestions(reset);
  }, [fetchQuestions]);

  const goToPage = useCallback((page) => {
    setFilters(prev => ({ ...prev, page }));
  }, []);

  const toggleSelect = useCallback((id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (selectedIds.length === questions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(questions.map(q => q.id));
    }
  }, [selectedIds, questions]);

  const clearSelection = useCallback(() => setSelectedIds([]), []);

  const createQuestion = useCallback(async (data) => {
    const result = await questionBankService.createQuestion(data);
    await fetchQuestions(filters);
    await fetchStats();
    return result;
  }, [filters, fetchQuestions, fetchStats]);

  const updateQuestion = useCallback(async (id, data) => {
    const result = await questionBankService.updateQuestion(id, data);
    await fetchQuestions(filters);
    return result;
  }, [filters, fetchQuestions]);

  const deleteQuestion = useCallback(async (id) => {
    await questionBankService.deleteQuestion(id);
    setSelectedIds(prev => prev.filter(x => x !== id));
    await fetchQuestions(filters);
    await fetchStats();
  }, [filters, fetchQuestions, fetchStats]);

  const deleteSelected = useCallback(async () => {
    if (selectedIds.length === 0) return;
    await questionBankService.deleteQuestions(selectedIds);
    setSelectedIds([]);
    await fetchQuestions(filters);
    await fetchStats();
  }, [selectedIds, filters, fetchQuestions, fetchStats]);

  return {
    questions, stats, loading, error, tags,
    filters, pagination,
    selectedIds,
    handleSearch, updateFilter, resetFilters, goToPage,
    toggleSelect, toggleSelectAll, clearSelection,
    createQuestion, updateQuestion, deleteQuestion, deleteSelected,
    refetch: () => { fetchQuestions(filters); fetchStats(); },
  };
}

export default useQuestionBank;
