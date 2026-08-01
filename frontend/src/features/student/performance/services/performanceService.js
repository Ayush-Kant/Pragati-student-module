import { performanceDummyData } from "../types/performanceDummyData";

export const getPerformance = async () => {
  return Promise.resolve(performanceDummyData);
};

export const getProgress = async () => {
  return Promise.resolve(performanceDummyData.progress);
};

export const getStatistics = async () => {
  return Promise.resolve(performanceDummyData.statistics);
};