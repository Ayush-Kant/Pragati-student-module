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

export { QuizQuestion } from './quizQuestionModel.js';
export { QuizOption } from './quizOptionModel.js';
export { QuizAttempt } from './quizAttemptModel.js';
export { QuizAnswer } from './quizAnswerModel.js';
export { QuizResult } from './quizResultModel.js';

export const initializeQuizModule = async () => {
  await sequelize.sync({ alter: false });
};

export default Quiz;
