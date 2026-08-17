import { DataTypes } from '@sequelize/core';
import sequelize from '../config/sequelize.js';

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

export default QuizOption;
