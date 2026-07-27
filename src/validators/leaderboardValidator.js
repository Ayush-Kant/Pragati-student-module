export const validateLeaderboard = (data) => {
    const errors = {};
    
    if (!data.studentId) {
        errors.studentId = "Student ID is required.";
    }
    
    if (typeof data.score !== 'number') {
        errors.score = "Score must be a number.";
    }
    
    if (typeof data.rank !== 'number') {
        errors.rank = "Rank must be a number.";
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

export const sanitizeInput = (data) => {
    return {
        studentId: data.studentId ? String(data.studentId).trim() : null,
        score: data.score ? Number(data.score) : null,
        rank: data.rank ? Number(data.rank) : null
    };
};