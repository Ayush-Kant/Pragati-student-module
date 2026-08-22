import { DataTypes } from '@sequelize/core';
import sequelize from '../config/sequelize.js';

export const QuizResult = sequelize.define('QuizResult', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  quizAttemptId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quizId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  score: {
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
}, {
  tableName: 'quiz_results',
  underscored: true,
  timestamps: true,
});

export default QuizResult;
