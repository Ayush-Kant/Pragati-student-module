export const validateDashboard = (data) => {
  if (!data) {
    throw new Error('Validation failed: Dashboard payload is completely empty.');
  }
  if (!data.student || !data.student.name || data.student.profileCompletion === undefined) {
    throw new Error('Validation failed: Student object must contain name and profileCompletion.');
  }
  if (!data.statistics) {
    throw new Error('Validation failed: Dashboard statistics object is missing.');
  }
  return true;
};

export const validateProgress = (progress) => {
  if (!progress) {
    throw new Error('Validation failed: Progress payload is empty.');
  }
  if (progress.courseProgress && Array.isArray(progress.courseProgress)) {
    progress.courseProgress.forEach((course, idx) => {
      if (!course.title || course.progress === undefined) {
        throw new Error(`Validation failed at course index ${idx}: Title and progress percentage are required.`);
      }
      if (course.progress < 0 || course.progress > 100) {
        throw new Error(`Validation failed: Progress for "${course.title}" must be between 0 and 100.`);
      }
    });
  }
  if (progress.attendanceRate !== undefined) {
    if (progress.attendanceRate < 0 || progress.attendanceRate > 100) {
      throw new Error('Validation failed: Attendance rate must be between 0 and 100.');
    }
  }
  return true;
};

export const validateActivity = (activity) => {
  if (!activity) {
    throw new Error('Validation failed: Activity payload is empty.');
  }
  if (!activity.title || !activity.date || !activity.type) {
    throw new Error(`Validation failed for activity "${activity.title || 'Untitled'}": Title, date, and type are required.`);
  }
  return true;
};

export const validatePerformance = (performance) => {
  if (!performance) {
    throw new Error('Validation failed: Performance payload is empty.');
  }
  if (performance.gpa !== undefined && (performance.gpa < 0 || performance.gpa > 4.0)) {
    throw new Error('Validation failed: GPA must be between 0.0 and 4.0.');
  }
  if (performance.scores && Array.isArray(performance.scores)) {
    performance.scores.forEach((score, idx) => {
      if (!score.subject || score.value === undefined) {
        throw new Error(`Validation failed at score index ${idx}: Subject and value are required.`);
      }
      if (score.value < 0 || score.value > 100) {
        throw new Error(`Validation failed: Score for "${score.subject}" must be between 0 and 100.`);
      }
    });
  }
  return true;
};
