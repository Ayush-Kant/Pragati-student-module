import { DataTypes } from '@sequelize/core';
import sequelize from '../config/sequelize.js';

export const Quiz = sequelize.define('Quiz', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  durationMinutes: {
    type: DataTypes.INTEGER,
    defaultValue: 30,
  },
  passingScore: {
    type: DataTypes.INTEGER,
    defaultValue: 60,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'quizzes',
  underscored: true,
  timestamps: true,
});

export const QuizQuestion = sequelize.define('QuizQuestion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  quizId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  questionText: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  correctOptionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  displayOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
}, {
  tableName: 'quiz_questions',
  underscored: true,
  timestamps: true,
});

export const QuizOption = sequelize.define('QuizOption', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  quizQuestionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  optionText: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isCorrect: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  displayOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
}, {
  tableName: 'quiz_options',
  underscored: true,
  timestamps: true,
});

export const QuizAttempt = sequelize.define('QuizAttempt', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  quizId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'in_progress',
  },
  score: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  totalQuestions: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  percentage: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  passed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  submittedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  startedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'quiz_attempts',
  underscored: true,
  timestamps: true,
});

export const QuizAnswer = sequelize.define('QuizAnswer', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  quizAttemptId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  questionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  selectedOptionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  isCorrect: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
}, {
  tableName: 'quiz_answers',
  underscored: true,
  timestamps: true,
});

Quiz.hasMany(QuizQuestion, { foreignKey: 'quizId', as: 'questions' });
QuizQuestion.belongsTo(Quiz, { foreignKey: 'quizId', as: 'quiz' });
QuizQuestion.hasMany(QuizOption, { foreignKey: 'quizQuestionId', as: 'options' });
QuizOption.belongsTo(QuizQuestion, { foreignKey: 'quizQuestionId', as: 'question' });
Quiz.hasMany(QuizAttempt, { foreignKey: 'quizId', as: 'attempts' });
QuizAttempt.belongsTo(Quiz, { foreignKey: 'quizId', as: 'quiz' });
QuizAttempt.hasMany(QuizAnswer, { foreignKey: 'quizAttemptId', as: 'answers' });
QuizAnswer.belongsTo(QuizAttempt, { foreignKey: 'quizAttemptId', as: 'attempt' });
QuizAnswer.belongsTo(QuizQuestion, { foreignKey: 'questionId', as: 'question' });

export const initializeQuizModule = async () => {
  await sequelize.sync({ alter: false });
};
