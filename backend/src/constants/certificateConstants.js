export const CERTIFICATE_STATUSES = Object.freeze({
  DRAFT: 'draft',
  ISSUED: 'issued',
  REVOKED: 'revoked',
  EXPIRED: 'expired',
});

export const ACHIEVEMENT_STATUSES = Object.freeze({
  EARNED: 'earned',
  IN_PROGRESS: 'in_progress',
  PENDING: 'pending',
});

export const BADGE_LEVELS = Object.freeze({
  BRONZE: 'bronze',
  SILVER: 'silver',
  GOLD: 'gold',
  PLATINUM: 'platinum',
});

export const DEFAULT_CERTIFICATE_TYPE = 'achievement';
export const DEFAULT_VALIDITY_DAYS = 365;
export const CERTIFICATE_PREFIX = 'CERT-';
export const VERIFICATION_PREFIX = 'VER-';
