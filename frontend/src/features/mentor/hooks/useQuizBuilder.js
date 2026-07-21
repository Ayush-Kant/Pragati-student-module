/**
 * useQuizBuilder Hook
 * Manages quiz configuration state: general info, question selection, timer, passing rules, answer reveal.
 */
import { useState, useCallback, useMemo } from 'react';
import { questionBankService } from '../services/questionBankService';

const defaultConfig = {
  name: '',
  description: '',
  selectionMode: 'manual', // 'manual' | 'random'
  selectedQuestionIds: [],
  // Random config
  totalQuestions: 10,
  categoryDistribution: {},
  difficultyDistribution: { Easy: 30, Medium: 50, Hard: 20 },
  randomSeed: '',
  // Timer
  quizDuration: 60,
  perQuestionTimer: 0,
  // Passing rules
  passingPercentage: 60,
  negativeMarking: false,
  negativeMarkValue: 0.25,
  shuffleQuestions: true,
  shuffleOptions: true,
  // Answer reveal
  answerReveal: 'after_submission', // 'immediately' | 'after_submission' | 'never'
};

export function useQuizBuilder() {
  const [config, setConfig] = useState({ ...defaultConfig });
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateConfig = useCallback((key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateMultiple = useCallback((updates) => {
    setConfig(prev => ({ ...prev, ...updates }));
  }, []);

  const resetConfig = useCallback(() => {
    setConfig({ ...defaultConfig });
    setGeneratedQuestions([]);
  }, []);

  const generateRandomQuestions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const questions = await questionBankService.getRandomQuestions({
        totalCount: config.totalQuestions,
        categoryDistribution: config.categoryDistribution,
        difficultyDistribution: config.difficultyDistribution,
      });
      setGeneratedQuestions(questions);
      return questions;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [config.totalQuestions, config.categoryDistribution, config.difficultyDistribution]);

  const saveQuiz = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await questionBankService.createQuiz({
        ...config,
        questions: config.selectionMode === 'random' ? generatedQuestions.map(q => q.id) : config.selectedQuestionIds,
      });
      return result;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [config, generatedQuestions]);

  const summary = useMemo(() => {
    const questionCount = config.selectionMode === 'random'
      ? generatedQuestions.length || config.totalQuestions
      : config.selectedQuestionIds.length;

    const totalMarks = config.selectionMode === 'random'
      ? generatedQuestions.reduce((s, q) => s + (q.marks || 1), 0)
      : 0;

    return {
      name: config.name || 'Untitled Quiz',
      questionCount,
      duration: config.quizDuration,
      passingPercentage: config.passingPercentage,
      negativeMarking: config.negativeMarking,
      shuffleQuestions: config.shuffleQuestions,
      shuffleOptions: config.shuffleOptions,
      answerReveal: config.answerReveal,
      totalMarks,
      estimatedTime: `${config.quizDuration} mins`,
    };
  }, [config, generatedQuestions]);

  return {
    config, generatedQuestions, loading, error, summary,
    updateConfig, updateMultiple, resetConfig,
    generateRandomQuestions, saveQuiz,
  };
}

export default useQuizBuilder;
