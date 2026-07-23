import { useState } from 'react';
import { challengeService } from '../services/challengeService';
import toast from 'react-hot-toast';

export const useChallenge = () => {
  const [isLoading, setIsLoading] = useState(false);

  // MENTOR ACTIONS
  const createNewChallenge = async (metadata) => {
    setIsLoading(true);
    try {
      const result = await challengeService.createChallenge(metadata);
      setIsLoading(false);
      return result.challengeId;
    } catch (error) {
      setIsLoading(false);
      toast.error("Failed to create challenge.");
      return null;
    }
  };

  const saveTestCases = async (challengeId, testCases) => {
    setIsLoading(true);
    try {
      await challengeService.addTestCases(challengeId, { testCases });
      setIsLoading(false);
      toast.success("Challenge published successfully!");
      return true;
    } catch (error) {
      setIsLoading(false);
      toast.error("Failed to save test cases.");
      return false;
    }
  };

  // STUDENT ACTIONS
  const submitStudentCode = async (challengeId, languageId, sourceCode) => {
    setIsLoading(true);
    try {
      const result = await challengeService.submitCode(challengeId, { languageId, sourceCode });
      setIsLoading(false);
      return result;
    } catch (error) {
      setIsLoading(false);
      toast.error("Code evaluation failed.");
      return null;
    }
  };

  const fetchLeaderboard = async (challengeId) => {
    setIsLoading(true);
    try {
      const result = await challengeService.getLeaderboard(challengeId);
      setIsLoading(false);
      return result.leaderboard;
    } catch (error) {
      setIsLoading(false);
      toast.error("Failed to load leaderboard.");
      return [];
    }
  };

  return {
    isLoading,
    createNewChallenge,
    saveTestCases,
    submitStudentCode,
    fetchLeaderboard
  };
};