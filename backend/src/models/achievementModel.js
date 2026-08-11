import { DataTypes } from '@sequelize/core';
import sequelize from '../../config/sequelize.js';
import { ACHIEVEMENT_STATUSES } from '../constants/certificateConstants.js';

const Achievement = sequelize.define('Achievement', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'student_id',
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: ACHIEVEMENT_STATUSES.EARNED,
  },
  earnedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'earned_at',
  },
}, {
  tableName: 'achievements',
  underscored: true,
  timestamps: true,
});

export default Achievement;
