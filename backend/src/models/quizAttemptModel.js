import { DataTypes } from '@sequelize/core';
import sequelize from '../config/sequelize.js';

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

export default QuizAttempt;
