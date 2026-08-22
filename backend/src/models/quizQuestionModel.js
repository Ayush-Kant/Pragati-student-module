import { DataTypes } from '@sequelize/core';
import sequelize from '../config/sequelize.js';

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

export default QuizQuestion;
