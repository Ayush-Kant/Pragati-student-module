import sequelize from '../config/sequelize.js';
import {
  Certificate,
  Achievement,
  Badge,
  StudentCertificate,
  CertificateVerification,
} from '../models/index.js';
import {
  generateUniqueCertificateId,
  generateVerificationCode,
  formatApiResponse,
  formatDate,
  resolveStudentId,
  getExpiryDate,
} from '../utils/certificateHelpers.js';
import {
  validateCertificateId,
  validateVerificationRequest,
  generateCertificateSchema,
} from '../validations/certificateValidation.js';
import {
  CERTIFICATE_STATUSES,
  ACHIEVEMENT_STATUSES,
  DEFAULT_CERTIFICATE_TYPE,
} from '../constants/certificateConstants.js';

const toPayload = (record) => ({
  ...record.toJSON(),
  issuedAt: formatDate(record.issuedAt),
  expiresAt: formatDate(record.expiresAt),
});

class CertificateService {
  async getCertificates(user) {
      const studentId = resolveStudentId(user);
      if (!studentId) {
        return formatApiResponse(false, 'Student not authenticated', null, 401);
      }

      const certificates = await Certificate.findAll({
        where: { studentId },
        include: [{ model: Achievement, as: 'achievement', required: false }],
        order: [['issuedAt', 'DESC']],
      });

      return formatApiResponse(true, 'Certificates fetched successfully', certificates.map(toPayload), 200);
  }

  async getCertificateById(user, certificateId) {
      const studentId = resolveStudentId(user);
      const validation = validateCertificateId(certificateId);

      if (!studentId) {
        return formatApiResponse(false, 'Student not authenticated', null, 401);
      }

      if (!validation.success) {
        return formatApiResponse(false, validation.message, null, 400);
      }

      const certificate = await Certificate.findOne({
        where: { certificateId },
        include: [{ model: Achievement, as: 'achievement', required: false }],
      });

      if (!certificate) {
        return formatApiResponse(false, 'Certificate not found', null, 404);
      }

      if (certificate.studentId !== studentId) {
        return formatApiResponse(false, 'Certificate not found', null, 404);
      }

      return formatApiResponse(true, 'Certificate details fetched successfully', toPayload(certificate), 200);
  }

  async generateCertificate(user, payload = {}) {
      const studentId = resolveStudentId(user);

      if (!studentId) {
        return formatApiResponse(false, 'Student not authenticated', null, 401);
      }

      const validation = generateCertificateSchema.validate(payload, { abortEarly: false, convert: true });
      if (validation.error) {
        return formatApiResponse(false, validation.error.message, null, 400);
      }

      const selectedAchievement = payload.achievementId
        ? await Achievement.findOne({ where: { id: payload.achievementId, studentId } })
        : null;

      const earnedAchievements = await Achievement.findAll({
        where: {
          studentId,
          status: ACHIEVEMENT_STATUSES.EARNED,
        },
      });

      const eligible = payload.achievementId
        ? selectedAchievement?.status === ACHIEVEMENT_STATUSES.EARNED
        : earnedAchievements.length > 0;

      if (payload.achievementId && !selectedAchievement) {
        return formatApiResponse(false, 'Achievement not found for this student', null, 404);
      }

      if (!eligible) {
        return formatApiResponse(false, 'Student is not eligible for a certificate', null, 403);
      }

      const existingCertificate = await Certificate.findOne({
        where: { studentId, title: payload.title || 'Achievement Certificate' },
      });

      if (existingCertificate) {
        return formatApiResponse(false, 'Certificate already exists for this achievement', null, 409);
      }

      const certificateId = generateUniqueCertificateId();
      const verificationCode = generateVerificationCode();
      const title = payload.title || 'Achievement Certificate';
      const description = payload.description || 'Certificate generated for achievement completion';
      const certificateType = payload.certificateType || DEFAULT_CERTIFICATE_TYPE;

      const certificate = await sequelize.transaction(async (transaction) => {
        const createdCertificate = await Certificate.create({
          certificateId,
          studentId,
          achievementId: payload.achievementId || null,
          title,
          description,
          certificateType,
          status: CERTIFICATE_STATUSES.ISSUED,
          issuedAt: new Date(),
          expiresAt: getExpiryDate(),
          verificationCode,
        }, { transaction });

        await StudentCertificate.create({
          studentId,
          certificateId: createdCertificate.id,
          status: 'active',
        }, { transaction });

        await CertificateVerification.create({
          certificateId: createdCertificate.id,
          verificationCode,
          status: 'pending',
        }, { transaction });

        return createdCertificate;
      });

      return formatApiResponse(true, 'Certificate generated successfully', toPayload(certificate), 201);
  }

  async verifyCertificate(user, certificateId, payload = {}) {
      const validation = validateCertificateId(certificateId);
      if (!validation.success) {
        return formatApiResponse(false, validation.message, null, 400);
      }

      const verificationValidation = validateVerificationRequest({ certificateId, ...payload });
      if (!verificationValidation.success) {
        return formatApiResponse(false, verificationValidation.message, null, 400);
      }

      const certificate = await Certificate.findOne({
        where: { certificateId },
        include: [{ model: CertificateVerification, as: 'verifications', required: false }],
      });

      if (!certificate) {
        return formatApiResponse(false, 'Certificate not found', null, 404);
      }

      const isValidForVerification = [
        CERTIFICATE_STATUSES.ISSUED,
      ].includes(certificate.status);

      if (!isValidForVerification) {
        return formatApiResponse(false, 'Certificate is not currently verifiable', null, 403);
      }

      const verificationCode = payload.verificationCode;
      const verificationRecord = certificate.verifications?.[0];

      if (!verificationRecord) {
        return formatApiResponse(false, 'Certificate verification record not found', null, 404);
      }

      if (!verificationCode) {
        return formatApiResponse(false, 'Verification code is required', null, 400);
      }

      if (verificationRecord.verificationCode !== verificationCode) {
        return formatApiResponse(false, 'Invalid verification code', null, 403);
      }

      await verificationRecord.update({
        status: 'verified',
        verifiedAt: new Date(),
        verifiedBy: user?.studentId || user?.id || 'public',
      });

      return formatApiResponse(true, 'Certificate verified successfully', {
        certificateId: certificate.certificateId,
        verified: true,
        ownerId: certificate.studentId,
        verificationCode: certificate.verificationCode,
        status: certificate.status,
      }, 200);
  }

  async getAchievements(user) {
      const studentId = resolveStudentId(user);
      if (!studentId) {
        return formatApiResponse(false, 'Student not authenticated', null, 401);
      }

      const achievements = await Achievement.findAll({
        where: { studentId },
        order: [['earnedAt', 'DESC']],
      });

      return formatApiResponse(true, 'Achievements fetched successfully', achievements, 200);
  }

  async getBadges(user) {
      const studentId = resolveStudentId(user);
      if (!studentId) {
        return formatApiResponse(false, 'Student not authenticated', null, 401);
      }

      const badges = await Badge.findAll({
        where: { studentId },
        order: [['earnedAt', 'DESC']],
      });

      return formatApiResponse(true, 'Badges fetched successfully', badges, 200);
  }

  async getCertificateStatistics(user) {
      const studentId = resolveStudentId(user);
      if (!studentId) {
        return formatApiResponse(false, 'Student not authenticated', null, 401);
      }

      const [certificates, verifications] = await Promise.all([
        Certificate.findAll({
          where: { studentId },
          attributes: ['id', 'status'],
        }),
        CertificateVerification.findAll({
          include: [
            {
              model: Certificate,
              as: 'certificate',
              required: true,
              where: { studentId },
              attributes: ['id'],
            },
          ],
          attributes: ['status'],
        }),
      ]);

      const totalCertificates = certificates.length;
      const generatedCertificates = totalCertificates;
      const verifiedCertificates = verifications.filter((item) => item.status === 'verified').length;
      const pendingCertificates = Math.max(totalCertificates - verifiedCertificates, 0);

      return formatApiResponse(
        true,
        'Statistics fetched successfully',
        {
          totalCertificates,
          generatedCertificates,
          verifiedCertificates,
          pendingCertificates,
        },
        200,
      );
  }

  async getAchievementSummary(user) {
      const studentId = resolveStudentId(user);
      if (!studentId) {
        return formatApiResponse(false, 'Student not authenticated', null, 401);
      }

      const achievements = await Achievement.findAll({
        where: { studentId },
        attributes: ['status', 'title'],
      });

      const totalAchievements = achievements.length;
      const completedAchievements = achievements.filter((item) => item.status === ACHIEVEMENT_STATUSES.EARNED).length;
      const pendingAchievements = achievements.filter(
        (item) => item.status === ACHIEVEMENT_STATUSES.PENDING || item.status === ACHIEVEMENT_STATUSES.IN_PROGRESS,
      ).length;

      return formatApiResponse(
        true,
        'Achievement summary fetched successfully',
        {
          totalAchievements,
          completedAchievements,
          pendingAchievements,
        },
        200,
      );
  }

  async getBadgeCount(user) {
      const studentId = resolveStudentId(user);
      if (!studentId) {
        return formatApiResponse(false, 'Student not authenticated', null, 401);
      }

      const totalEarnedBadges = await Badge.count({ where: { studentId } });

      return formatApiResponse(
        true,
        'Badge count fetched successfully',
        {
          totalEarnedBadges,
          count: totalEarnedBadges,
        },
        200,
      );
  }

  async getCompletionInsights(user) {
      const studentId = resolveStudentId(user);
      if (!studentId) {
        return formatApiResponse(false, 'Student not authenticated', null, 401);
      }

      const [achievements, certificates] = await Promise.all([
        Achievement.findAll({
          where: { studentId },
          attributes: ['status', 'title'],
          order: [['earnedAt', 'ASC']],
        }),
        Certificate.findAll({
          where: { studentId },
          attributes: ['id', 'status'],
        }),
      ]);

      const totalAchievements = achievements.length;
      const completedAchievements = achievements.filter((item) => item.status === ACHIEVEMENT_STATUSES.EARNED).length;
      const completionPercentage = totalAchievements
        ? Math.round((completedAchievements / totalAchievements) * 100)
        : 0;
      const eligibleCertificates = completedAchievements;
      const remainingCertificates = Math.max(eligibleCertificates - certificates.length, 0);
      const nextAchievementMilestone = achievements.find((item) => item.status !== ACHIEVEMENT_STATUSES.EARNED)?.title || 'No pending milestones';

      return formatApiResponse(
        true,
        'Completion insights fetched successfully',
        {
          completionPercentage,
          eligibleCertificates,
          remainingCertificates,
          nextAchievementMilestone,
          certificatesIssued: certificates.length,
        },
        200,
      );
  }
}

export default CertificateService;
