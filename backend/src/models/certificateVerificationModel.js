import { DataTypes } from '@sequelize/core';
import sequelize from '../../config/sequelize.js';

const CertificateVerification = sequelize.define('CertificateVerification', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  certificateId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    field: 'certificate_id',
  },
  verificationCode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    field: 'verification_code',
  },
  verifiedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'verified_at',
  },
  verifiedBy: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'verified_by',
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pending',
  },
}, {
  tableName: 'certificate_verifications',
  underscored: true,
  timestamps: true,
  indexes: [
    { fields: ['certificate_id'] },
    { unique: true, fields: ['verification_code'] },
  ],
});

export default CertificateVerification;
