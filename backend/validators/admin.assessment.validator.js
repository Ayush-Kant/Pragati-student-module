// admin.assessment.validator.js

const validateCreateAssessment = (req, res, next) => {
  const { title, type, difficulty, timeLimitMinutes, totalMarks } = req.body;
  
  // Basic sanity checks
  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'Valid title is required.' });
  }
  
  if (!type || !['MCQ', 'Coding'].includes(type)) {
    return res.status(400).json({ error: 'Type must be either MCQ or Coding.' });
  }
  
  if (!difficulty || !['Easy', 'Medium', 'Hard'].includes(difficulty)) {
    return res.status(400).json({ error: 'Difficulty must be Easy, Medium, or Hard.' });
  }
  
  // ensure numbers are strictly positive
  if (typeof timeLimitMinutes !== 'number' || timeLimitMinutes <= 0) {
    return res.status(400).json({ error: 'timeLimitMinutes must be a positive integer.' });
  }
  
  if (typeof totalMarks !== 'number' || totalMarks <= 0) {
    return res.status(400).json({ error: 'totalMarks must be a positive integer.' });
  }
  
  next();
};

const validateCreateQuestion = (req, res, next) => {
  const { type, marks } = req.body;
  
  if (!type || !['MCQ', 'Coding'].includes(type)) {
    return res.status(400).json({ error: 'Question type must be either MCQ or Coding.' });
  }
  
  if (typeof marks !== 'number' || marks <= 0) {
    return res.status(400).json({ error: 'marks must be a positive integer.' });
  }
  
  // specific validation based on the type of question
  if (type === 'MCQ') {
    const { question_text, options, correct_option } = req.body;
    
    if (!question_text || typeof question_text !== 'string') {
      return res.status(400).json({ error: 'question_text is required for MCQ.' });
    }
    
    // An MCQ must have exactly 4 options
    if (!Array.isArray(options) || options.length !== 4) {
      return res.status(400).json({ error: '4 options are required for MCQ.' });
    }
    
    if (typeof correct_option !== 'number') {
      return res.status(400).json({ error: 'correct_option index is required for MCQ.' });
    }
  } else if (type === 'Coding') {
    // TODO: We might want to validate language_support strictly against supported languages later
    const { problem_statement, language_support } = req.body;
    
    if (!problem_statement || typeof problem_statement !== 'string') {
      return res.status(400).json({ error: 'problem_statement is required for Coding question.' });
    }
    
    if (!Array.isArray(language_support) || language_support.length === 0) {
      return res.status(400).json({ error: 'language_support array is required for Coding question.' });
    }
  }
  
  next();
};

const validateAssignDrive = (req, res, next) => {
  const { driveId } = req.body;
  if (!driveId) {
    return res.status(400).json({ error: 'driveId is required.' });
  }
  next();
};

// exporting as the aliases needed in the routes
export { 
  validateCreateAssessment, 
  validateCreateQuestion, 
  validateAssignDrive as validateAssignAssessment 
};
