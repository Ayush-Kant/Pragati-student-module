import { DataTypes } from '@sequelize/core';
import sequelize from '../config/sequelize.js';

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

export default QuizAnswer;
