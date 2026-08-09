import { DataTypes } from '@sequelize/core';
import sequelize from '../../config/sequelize.js';
import { BADGE_LEVELS } from '../constants/certificateConstants.js';

const Badge = sequelize.define('Badge', {
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
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  level: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: BADGE_LEVELS.BRONZE,
  },
  earnedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'earned_at',
  },
}, {
  tableName: 'badges',
  underscored: true,
  timestamps: true,
});

export default Badge;
