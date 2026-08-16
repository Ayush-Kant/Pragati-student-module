// src/features/student/placement/validations/placementValidation.js
// Pure validation helpers — no side effects, no API calls.
// Returns { valid: boolean, errors: string[] } for every validator.

import {
  APPLICATION_STATUS,
  JOB_TYPE,
  PROFILE_SECTION,
  DATE_RANGE_PRESET,
} from '../constants/placementConstants';

// ─── Helpers ─────────────────────────────────────────────────────────────────
const ok  = ()            => ({ valid: true,  errors: [] });
const err = (...msgs)     => ({ valid: false, errors: msgs.filter(Boolean) });
const isNonEmptyString = (v) => typeof v === 'string' && v.trim().length > 0;
const isValidDate      = (v) => {
  if (!v) return false;
  const d = new Date(v);
  return !isNaN(d.getTime());
};

// ─── validateApplicationFilter ───────────────────────────────────────────────
/**
 * Validates the filter object passed to useApplications() / getApplications().
 * @param {Object} filters
 * @param {string}  [filters.status]    - APPLICATION_STATUS value or ''
 * @param {string}  [filters.jobType]   - JOB_TYPE value or ''
 * @param {string}  [filters.location]  - free-text, max 100 chars
 * @param {string}  [filters.dateRange] - DATE_RANGE_PRESET value
 * @param {string}  [filters.startDate] - ISO date string (required when dateRange === 'custom')
 * @param {string}  [filters.endDate]   - ISO date string (required when dateRange === 'custom')
 * @param {number}  [filters.page]      - >= 1
 * @param {number}  [filters.pageSize]  - >= 1, <= 100
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateApplicationFilter(filters = {}) {
  const errors = [];

  // status
  if (
    filters.status &&
    !Object.values(APPLICATION_STATUS).includes(filters.status)
  ) {
    errors.push(
      `Invalid status "${filters.status}". Must be one of: ${Object.values(APPLICATION_STATUS).join(', ')}`,
    );
  }

  // jobType
  if (
    filters.jobType &&
    !Object.values(JOB_TYPE).includes(filters.jobType)
  ) {
    errors.push(
      `Invalid jobType "${filters.jobType}". Must be one of: ${Object.values(JOB_TYPE).join(', ')}`,
    );
  }

  // location
  if (filters.location && filters.location.length > 100) {
    errors.push('Location filter must not exceed 100 characters.');
  }

  // dateRange
  if (
    filters.dateRange &&
    !Object.values(DATE_RANGE_PRESET).includes(filters.dateRange)
  ) {
    errors.push(
      `Invalid dateRange "${filters.dateRange}". Must be one of: ${Object.values(DATE_RANGE_PRESET).join(', ')}`,
    );
  }

  // Custom date range — both dates required and start must be before end
  if (filters.dateRange === DATE_RANGE_PRESET.CUSTOM) {
    if (!isValidDate(filters.startDate)) {
      errors.push('startDate is required and must be a valid date when dateRange is "custom".');
    }
    if (!isValidDate(filters.endDate)) {
      errors.push('endDate is required and must be a valid date when dateRange is "custom".');
    }
    if (
      isValidDate(filters.startDate) &&
      isValidDate(filters.endDate) &&
      new Date(filters.startDate) > new Date(filters.endDate)
    ) {
      errors.push('startDate must not be after endDate.');
    }
  }

  // page
  if (filters.page !== undefined) {
    if (!Number.isInteger(filters.page) || filters.page < 1) {
      errors.push('page must be an integer >= 1.');
    }
  }

  // pageSize
  if (filters.pageSize !== undefined) {
    if (
      !Number.isInteger(filters.pageSize) ||
      filters.pageSize < 1 ||
      filters.pageSize > 100
    ) {
      errors.push('pageSize must be an integer between 1 and 100.');
    }
  }

  return errors.length === 0 ? ok() : err(...errors);
}

// ─── validateJobType ──────────────────────────────────────────────────────────
/**
 * @param {string} jobType
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateJobType(jobType) {
  if (!isNonEmptyString(jobType)) {
    return err('jobType must be a non-empty string.');
  }
  if (!Object.values(JOB_TYPE).includes(jobType)) {
    return err(
      `Invalid jobType "${jobType}". Must be one of: ${Object.values(JOB_TYPE).join(', ')}`,
    );
  }
  return ok();
}

// ─── validateApplicationStatus ───────────────────────────────────────────────
/**
 * @param {string} status
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateApplicationStatus(status) {
  if (!isNonEmptyString(status)) {
    return err('Application status must be a non-empty string.');
  }
  if (!Object.values(APPLICATION_STATUS).includes(status)) {
    return err(
      `Invalid status "${status}". Must be one of: ${Object.values(APPLICATION_STATUS).join(', ')}`,
    );
  }
  return ok();
}

// ─── validateProfileSection ──────────────────────────────────────────────────
/**
 * @param {string} section
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateProfileSection(section) {
  if (!isNonEmptyString(section)) {
    return err('Profile section must be a non-empty string.');
  }
  if (!Object.values(PROFILE_SECTION).includes(section)) {
    return err(
      `Invalid profile section "${section}". Must be one of: ${Object.values(PROFILE_SECTION).join(', ')}`,
    );
  }
  return ok();
}

// ─── validateDateRange ───────────────────────────────────────────────────────
/**
 * Validates a custom date range pair (startDate / endDate).
 * For preset ranges, use validateApplicationFilter instead.
 * @param {string|Date} startDate
 * @param {string|Date} endDate
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateDateRange(startDate, endDate) {
  const errors = [];

  if (!isValidDate(startDate)) {
    errors.push('startDate must be a valid date string or Date object.');
  }
  if (!isValidDate(endDate)) {
    errors.push('endDate must be a valid date string or Date object.');
  }
  if (
    isValidDate(startDate) &&
    isValidDate(endDate) &&
    new Date(startDate) > new Date(endDate)
  ) {
    errors.push('startDate must not be after endDate.');
  }

  return errors.length === 0 ? ok() : err(...errors);
}
