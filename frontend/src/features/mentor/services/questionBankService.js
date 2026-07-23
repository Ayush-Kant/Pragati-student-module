
const MOCK_TAGS = [
  'Data Structures', 'Algorithms', 'JavaScript', 'React', 'Core Concepts',
  'CSS', 'HTML', 'Node.js', 'Python', 'SQL', 'OOP', 'Design Patterns',
  'Testing', 'Git', 'REST API', 'GraphQL', 'TypeScript', 'MongoDB',
  'System Design', 'Security'
];

const QUESTION_TYPES = ['MCQ', 'Multiple Select', 'True/False', 'Short Answer', 'Long Answer', 'Coding'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

function generateMockQuestions(count = 50) {
  const questions = [];
  const sampleQuestions = [
    'What is the time complexity of searching in a perfectly balanced Binary Search Tree?',
    'Explain the concept of closures in JavaScript and provide a practical use case where it avoids global variables.',
    'Which of the following are valid React Hooks? (Select all that apply)',
    'Is JavaScript a single-threaded programming language?',
    'What is the difference between let, const, and var in JavaScript?',
    'Implement a function to reverse a linked list in-place.',
    'What does the useEffect hook do in React?',
    'Explain the difference between SQL and NoSQL databases.',
    'What is the purpose of the virtual DOM in React?',
    'How does event delegation work in JavaScript?',
    'What is the difference between == and === in JavaScript?',
    'Explain the concept of promises and async/await.',
    'What are higher-order functions? Give examples.',
    'What is RESTful API design? Explain the key principles.',
    'What is the difference between stack and queue data structures?',
  ];

  for (let i = 0; i < count; i++) {
    const type = QUESTION_TYPES[Math.floor(Math.random() * QUESTION_TYPES.length)];
    const difficulty = DIFFICULTIES[Math.floor(Math.random() * DIFFICULTIES.length)];
    const tagCount = Math.floor(Math.random() * 3) + 1;
    const tags = [];
    for (let t = 0; t < tagCount; t++) {
      const tag = MOCK_TAGS[Math.floor(Math.random() * MOCK_TAGS.length)];
      if (!tags.includes(tag)) tags.push(tag);
    }

    const daysAgo = Math.floor(Math.random() * 90);
    const created = new Date();
    created.setDate(created.getDate() - daysAgo);

    questions.push({
      id: `q-${String(i + 1).padStart(4, '0')}`,
      question: sampleQuestions[i % sampleQuestions.length],
      title: `Question ${i + 1}`,
      type,
      difficulty,
      tags,
      estimatedTime: [30, 60, 90, 120, 180, 300][Math.floor(Math.random() * 6)],
      marks: [1, 2, 3, 5, 10][Math.floor(Math.random() * 5)],
      createdAt: created.toISOString(),
      updatedAt: created.toISOString(),
      status: Math.random() > 0.2 ? 'published' : 'draft',
      category: ['Frontend', 'Backend', 'Database', 'DevOps', 'General'][Math.floor(Math.random() * 5)],
      options: type === 'MCQ' || type === 'Multiple Select' ? [
        { id: 'a', text: 'Option A', isCorrect: Math.random() > 0.7 },
        { id: 'b', text: 'Option B', isCorrect: Math.random() > 0.7 },
        { id: 'c', text: 'Option C', isCorrect: Math.random() > 0.7 },
        { id: 'd', text: 'Option D', isCorrect: Math.random() > 0.7 },
      ] : [],
      correctAnswer: type === 'True/False' ? (Math.random() > 0.5 ? 'True' : 'False') : '',
      explanation: 'This is a sample explanation for this question that helps students understand the concept better.',
    });
  }
  return questions;
}

let mockQuestions = generateMockQuestions(50);

function generateMockAttempts(count = 30) {
  const students = [
    'Aarav Sharma', 'Priya Patel', 'Rahul Kumar', 'Sneha Gupta', 'Vikram Singh',
    'Anjali Reddy', 'Karan Mehta', 'Divya Nair', 'Arjun Das', 'Meera Iyer',
    'Rohit Verma', 'Pooja Joshi', 'Aditya Rao', 'Neha Kapoor', 'Siddharth Bose'
  ];
  const quizNames = [
    'Midterm Evaluation - Fall 2024', 'JavaScript Fundamentals', 'React Advanced',
    'Data Structures Quiz', 'Algorithm Design Test', 'CSS Mastery Quiz',
    'Full Stack Assessment', 'System Design Basics'
  ];
  const statuses = ['passed', 'failed', 'in-progress'];

  const attempts = [];
  for (let i = 0; i < count; i++) {
    const score = Math.floor(Math.random() * 100);
    const totalMarks = 100;
    const timeTaken = Math.floor(Math.random() * 60) + 10;
    const daysAgo = Math.floor(Math.random() * 30);
    const submitted = new Date();
    submitted.setDate(submitted.getDate() - daysAgo);

    attempts.push({
      id: `att-${String(i + 1).padStart(4, '0')}`,
      studentName: students[Math.floor(Math.random() * students.length)],
      studentEmail: `student${i + 1}@example.com`,
      quizName: quizNames[Math.floor(Math.random() * quizNames.length)],
      score,
      totalMarks,
      percentage: Math.round((score / totalMarks) * 100),
      timeTaken: `${timeTaken} mins`,
      status: score >= 60 ? 'passed' : score >= 40 ? 'failed' : statuses[Math.floor(Math.random() * statuses.length)],
      submittedAt: submitted.toISOString(),
      answers: Array.from({ length: 10 }, (_, idx) => ({
        questionId: `q-${String(idx + 1).padStart(4, '0')}`,
        questionText: `Sample Question ${idx + 1}`,
        selectedAnswer: 'Option B',
        correctAnswer: 'Option A',
        isCorrect: Math.random() > 0.4,
        marks: Math.floor(Math.random() * 5) + 1,
        maxMarks: 5,
      })),
      feedback: score >= 60
        ? 'Good performance! Keep up the great work.'
        : 'Needs improvement. Please review the topics and try again.',
    });
  }
  return attempts;
}

const mockAttempts = generateMockAttempts(30);


const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const questionBankService = {
  // Questions
  async getQuestions({ search = '', type = '', difficulty = '', tags = [], sort = 'newest', page = 1, pageSize = 10 } = {}) {
    await delay(300);
    let filtered = [...mockQuestions];

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(item =>
        item.question.toLowerCase().includes(q) || item.title.toLowerCase().includes(q)
      );
    }
    if (type) filtered = filtered.filter(item => item.type === type);
    if (difficulty) filtered = filtered.filter(item => item.difficulty === difficulty);
    if (tags.length > 0) {
      filtered = filtered.filter(item => tags.some(tag => item.tags.includes(tag)));
    }

    switch (sort) {
      case 'newest': filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); break;
      case 'oldest': filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); break;
      case 'a-z': filtered.sort((a, b) => a.question.localeCompare(b.question)); break;
      case 'z-a': filtered.sort((a, b) => b.question.localeCompare(a.question)); break;
      default: break;
    }

    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const data = filtered.slice(start, start + pageSize);

    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  },

  async getQuestionById(id) {
    await delay(200);
    return mockQuestions.find(q => q.id === id) || null;
  },

  async createQuestion(questionData) {
    await delay(400);
    const newQuestion = {
      ...questionData,
      id: `q-${String(mockQuestions.length + 1).padStart(4, '0')}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockQuestions.unshift(newQuestion);
    return newQuestion;
  },

  async updateQuestion(id, questionData) {
    await delay(400);
    const idx = mockQuestions.findIndex(q => q.id === id);
    if (idx === -1) throw new Error('Question not found');
    mockQuestions[idx] = { ...mockQuestions[idx], ...questionData, updatedAt: new Date().toISOString() };
    return mockQuestions[idx];
  },

  async deleteQuestion(id) {
    await delay(300);
    mockQuestions = mockQuestions.filter(q => q.id !== id);
    return { success: true };
  },

  async deleteQuestions(ids) {
    await delay(400);
    mockQuestions = mockQuestions.filter(q => !ids.includes(q.id));
    return { success: true, deletedCount: ids.length };
  },

  async getStats() {
    await delay(200);
    const total = mockQuestions.length;
    const mcqs = mockQuestions.filter(q => q.type === 'MCQ').length;
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const recentlyAdded = mockQuestions.filter(q => new Date(q.createdAt) >= weekAgo).length;

    const diffMap = { Easy: 1, Medium: 2, Hard: 3 };
    const avgDiff = mockQuestions.reduce((sum, q) => sum + (diffMap[q.difficulty] || 2), 0) / total;
    const avgDiffLabel = avgDiff < 1.5 ? 'Easy' : avgDiff < 2.5 ? 'Medium' : 'Hard';

    return { total, mcqs, recentlyAdded, avgDifficulty: avgDiffLabel };
  },

  async getTags() {
    await delay(100);
    return MOCK_TAGS;
  },

  async createQuiz(quizData) {
    await delay(500);
    return { id: `quiz-${Date.now()}`, ...quizData, createdAt: new Date().toISOString() };
  },

  async getRandomQuestions({ totalCount = 10, categoryDistribution = {}, difficultyDistribution = {} } = {}) {
    await delay(300);
    const shuffled = [...mockQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, totalCount);
  },

  async getAttempts({ page = 1, pageSize = 10, search = '', status = '' } = {}) {
    await delay(300);
    let filtered = [...mockAttempts];

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(a =>
        a.studentName.toLowerCase().includes(q) || a.quizName.toLowerCase().includes(q)
      );
    }
    if (status) filtered = filtered.filter(a => a.status === status);

    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const data = filtered.slice(start, start + pageSize);

    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  },

  async getAttemptById(id) {
    await delay(200);
    return mockAttempts.find(a => a.id === id) || null;
  },
};

export default questionBankService;
