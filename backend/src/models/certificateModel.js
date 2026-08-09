import { DataTypes } from '@sequelize/core';
import sequelize from '../../config/sequelize.js';
import { CERTIFICATE_STATUSES, DEFAULT_CERTIFICATE_TYPE } from '../constants/certificateConstants.js';

const Certificate = sequelize.define('Certificate', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  certificateId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    field: 'certificate_id',
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'student_id',
  },
  achievementId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'achievement_id',
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  certificateType: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: DEFAULT_CERTIFICATE_TYPE,
    field: 'certificate_type',
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: CERTIFICATE_STATUSES.ISSUED,
  },
  issuedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'issued_at',
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'expires_at',
  },
  verificationCode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    field: 'verification_code',
  },
}, {
  tableName: 'certificates',
  underscored: true,
  timestamps: true,
});

export default Certificate;
