import { v4 as uuidv4 } from 'uuid';
import {
  ACHIEVEMENT_STATUSES,
  CERTIFICATE_PREFIX,
  VERIFICATION_PREFIX,
  DEFAULT_VALIDITY_DAYS,
} from '../constants/certificateConstants.js';

export const generateUniqueCertificateId = () => {
  const suffix = uuidv4().split('-')[0].toUpperCase();
  return `${CERTIFICATE_PREFIX}${suffix}`;
};

export const generateVerificationCode = () => {
  const suffix = uuidv4().split('-')[0].toUpperCase();
  return `${VERIFICATION_PREFIX}${suffix}`;
};

export const formatApiResponse = (success, message, data = null, statusCode = 200) => ({
  success,
  message,
  data,
  statusCode,
});

export const formatDate = (value) => {
  if (!value) {
    return '';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const resolveStudentId = (user = {}) => {
  if (!user || typeof user !== 'object') {
    return null;
  }

  const rawValue = user.studentId ?? user.id ?? user.userId;

  if (rawValue === null || rawValue === undefined || rawValue === '') {
    return null;
  }

  const parsedValue = Number.parseInt(rawValue, 10);

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    return null;
  }

  return parsedValue;
};

export const checkEligibility = (studentContext = {}) => {
  const achievements = Array.isArray(studentContext.achievements) ? studentContext.achievements : [];
  return achievements.some((achievement) => achievement?.status === ACHIEVEMENT_STATUSES.EARNED);
};

export const getExpiryDate = () => {
  const now = new Date();
  now.setDate(now.getDate() + DEFAULT_VALIDITY_DAYS);
  return now;
};
