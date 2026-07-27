export const calculateProgressPercent = (completedLessons, totalLessons) => {
    if (!Number.isFinite(Number(totalLessons)) || Number(totalLessons) <= 0) {
        return 0;
    }

    const completed = Math.max(0, Number(completedLessons) || 0);
    const total = Math.max(0, Number(totalLessons) || 0);
    const ratio = completed / total;

    return Math.min(100, Math.max(0, Math.round(ratio * 100)));
};

export const summarizeProgress = (completedLessons, totalLessons) => {
    const completed = Math.max(0, Number(completedLessons) || 0);
    const total = Math.max(0, Number(totalLessons) || 0);

    return {
        completedLessons: completed,
        totalLessons: total,
        remainingLessons: Math.max(0, total - completed),
        progressPercent: calculateProgressPercent(completed, total),
    };
};
