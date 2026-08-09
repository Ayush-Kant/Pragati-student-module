import Joi from 'joi';
import {
  ACHIEVEMENT_STATUSES,
  DEFAULT_CERTIFICATE_TYPE,
} from '../constants/certificateConstants.js';

const certificateIdSchema = Joi.string().trim().min(3).required();

export const verificationRequestSchema = Joi.object({
  verificationCode: Joi.string().trim().optional(),
}).unknown(true).required();

export const generateCertificateSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200).optional(),
  description: Joi.string().trim().max(1000).optional(),
  certificateType: Joi.string().valid(DEFAULT_CERTIFICATE_TYPE).optional(),
  achievementId: Joi.number().integer().positive().optional(),
}).required();

const achievementStatusSchema = Joi.string()
  .valid(
    ACHIEVEMENT_STATUSES.EARNED,
    ACHIEVEMENT_STATUSES.IN_PROGRESS,
    ACHIEVEMENT_STATUSES.PENDING,
  )
  .required();

const studentEligibilitySchema = Joi.object({
  studentId: Joi.number().integer().positive().required(),
  achievements: Joi.array()
    .items(
      Joi.object({
        status: Joi.string()
          .valid(
            ACHIEVEMENT_STATUSES.EARNED,
            ACHIEVEMENT_STATUSES.IN_PROGRESS,
            ACHIEVEMENT_STATUSES.PENDING,
          )
          .required(),
      }),
    )
    .optional(),
  isEligible: Joi.boolean().optional(),
}).required();

export const validateCertificateId = (certificateId) => {
  const { error } = certificateIdSchema.validate(certificateId);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
  };
};

export const validateVerificationRequest = (payload) => {
  const { error, value } = verificationRequestSchema.validate(payload, { abortEarly: false, convert: true });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    value,
  };
};

export const validateAchievementStatus = (status) => {
  const { error } = achievementStatusSchema.validate(status);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
  };
};

export const validateStudentEligibility = (payload) => {
  const { error } = studentEligibilitySchema.validate(payload, { abortEarly: false, convert: true });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
  };
};
