export const formatTime = (seconds) => {
  if (
    seconds === undefined ||
    seconds === null ||
    isNaN(seconds) ||
    seconds < 0
  ) {
    return "00:00";
  }
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

export const calculatePercentage = (score, totalMarks) => {
  if (!totalMarks || totalMarks === 0 || isNaN(score) || isNaN(totalMarks)) return 0;
  return Math.round((score / totalMarks) * 100);
};