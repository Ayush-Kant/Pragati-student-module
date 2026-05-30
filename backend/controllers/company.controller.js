// company.controller.js

import * as service from '../services/company.service.js';
import {
    sendApprovalEmail,
    sendRejectionEmail,
    sendSuspensionEmail,
    sendReinstatementEmail,
} from '../services/company.email.service.js';

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

const handleServiceError = (err, res) => {
    if (err.statusCode === 409) {
        return res.status(409).json({
            error:   true,
            message: err.message,
            code:    err.code || 'INVALID_STATE',
        });
    }
    console.error('[CompanyController]', err);
    return res.status(500).json({
        error:   true,
        message: 'An unexpected error occurred. Please try again.',
        code:    'INTERNAL_ERROR',
    });
};

// Fire-and-forget email — never blocks the response, never fails the request.
const fireEmail = async (fn, ...args) => {
    try {
        await fn(...args);
    } catch (emailErr) {
        console.error('[CompanyEmail] Failed to send email:', emailErr.message);
    }
};

// ─────────────────────────────────────────────────────────────
// LIST — GET /api/v1/admin/companies
// ─────────────────────────────────────────────────────────────
const listCompanies = async (req, res) => {
    try {
        const { rows, total } = await service.listCompanies(req.query);
        return res.status(200).json({
            companies: rows,
            total,
            page:  parseInt(req.query.page)  || 1,
            limit: parseInt(req.query.limit) || 20,
        });
    } catch (err) {
        return handleServiceError(err, res);
    }
};

// ─────────────────────────────────────────────────────────────
// DETAIL — GET /api/v1/admin/companies/:id
// ─────────────────────────────────────────────────────────────
const getCompanyById = async (req, res) => {
    try {
        const company = await service.getCompanyById(req.params.id);
        if (!company) {
            return res.status(404).json({
                error:   true,
                message: 'Company not found.',
                code:    'NOT_FOUND',
            });
        }
        return res.status(200).json({ company });
    } catch (err) {
        return handleServiceError(err, res);
    }
};

// ─────────────────────────────────────────────────────────────
// STATS — GET /api/v1/admin/companies/:id/stats
// ─────────────────────────────────────────────────────────────
const getCompanyStats = async (req, res) => {
    try {
        const stats = await service.getCompanyStats(req.params.id);
        if (!stats) {
            return res.status(404).json({
                error:   true,
                message: 'Stats not found for this company.',
                code:    'NOT_FOUND',
            });
        }
        return res.status(200).json({ stats });
    } catch (err) {
        return handleServiceError(err, res);
    }
};

// ─────────────────────────────────────────────────────────────
// DRIVES — GET /api/v1/admin/companies/:id/drives
// ─────────────────────────────────────────────────────────────
const getCompanyDrives = async (req, res) => {
    try {
        const drives = await service.getCompanyDrives(req.params.id);
        return res.status(200).json({ drives });
    } catch (err) {
        return handleServiceError(err, res);
    }
};

// ─────────────────────────────────────────────────────────────
// APPROVE — POST /api/v1/admin/companies/:id/approve
// ─────────────────────────────────────────────────────────────
const approveCompany = async (req, res) => {
    try {
        const company = await service.approveCompany(req.params.id, req.user.id);
        if (!company) {
            return res.status(404).json({
                error:   true,
                message: 'Company not found.',
                code:    'NOT_FOUND',
            });
        }
        fireEmail(sendApprovalEmail, company.email, company.name);
        return res.status(200).json({
            success: true,
            message: 'Company approved successfully.',
            company: {
                companyId:  company.companyId,
                status:     company.status,
                verifiedAt: company.verifiedAt,
            },
        });
    } catch (err) {
        return handleServiceError(err, res);
    }
};

// ─────────────────────────────────────────────────────────────
// REJECT — POST /api/v1/admin/companies/:id/reject
// ─────────────────────────────────────────────────────────────
const rejectCompany = async (req, res) => {
    try {
        const { reason } = req.body;
        const company = await service.rejectCompany(req.params.id, reason, req.user.id);
        if (!company) {
            return res.status(404).json({
                error:   true,
                message: 'Company not found.',
                code:    'NOT_FOUND',
            });
        }
        fireEmail(sendRejectionEmail, company.email, company.name, reason);
        return res.status(200).json({
            success: true,
            message: 'Company rejected.',
            company: {
                companyId:       company.companyId,
                status:          company.status,
                rejectionReason: company.rejectionReason,
            },
        });
    } catch (err) {
        return handleServiceError(err, res);
    }
};

// ─────────────────────────────────────────────────────────────
// SUSPEND — POST /api/v1/admin/companies/:id/suspend
// ─────────────────────────────────────────────────────────────
const suspendCompany = async (req, res) => {
    try {
        const { reason } = req.body;
        const company = await service.suspendCompany(req.params.id, reason, req.user.id);
        if (!company) {
            return res.status(404).json({
                error:   true,
                message: 'Company not found.',
                code:    'NOT_FOUND',
            });
        }
        fireEmail(sendSuspensionEmail, company.email, company.name, reason);
        return res.status(200).json({
            success: true,
            message: 'Company suspended.',
            company: {
                companyId:        company.companyId,
                status:           company.status,
                suspensionReason: company.suspensionReason,
            },
        });
    } catch (err) {
        return handleServiceError(err, res);
    }
};

// ─────────────────────────────────────────────────────────────
// REINSTATE — POST /api/v1/admin/companies/:id/reinstate
// ─────────────────────────────────────────────────────────────
const reinstateCompany = async (req, res) => {
    try {
        const company = await service.reinstateCompany(req.params.id, req.user.id);
        if (!company) {
            return res.status(404).json({
                error:   true,
                message: 'Company not found.',
                code:    'NOT_FOUND',
            });
        }
        fireEmail(sendReinstatementEmail, company.email, company.name);
        return res.status(200).json({
            success: true,
            message: 'Company reinstated.',
            company: {
                companyId:  company.companyId,
                status:     company.status,
                verifiedAt: company.verifiedAt,
            },
        });
    } catch (err) {
        return handleServiceError(err, res);
    }
};

// ─────────────────────────────────────────────────────────────
// RANKINGS — GET /api/v1/admin/companies/rankings
// ─────────────────────────────────────────────────────────────
const getCompanyRankings = async (req, res) => {
    try {
        const rankings = await service.getCompanyRankings(req.query.limit);
        return res.status(200).json({ rankings });
    } catch (err) {
        return handleServiceError(err, res);
    }
};

// ─────────────────────────────────────────────────────────────
// ACTIVE DRIVES — GET /api/v1/admin/companies/active-drives
// ─────────────────────────────────────────────────────────────
const getActiveDrives = async (req, res) => {
    try {
        const drives = await service.getActiveDrives();
        return res.status(200).json({ drives });
    } catch (err) {
        return handleServiceError(err, res);
    }
};

export {
    listCompanies,
    getCompanyById,
    getCompanyStats,
    getCompanyDrives,
    approveCompany,
    rejectCompany,
    suspendCompany,
    reinstateCompany,
    getCompanyRankings,
    getActiveDrives,
};
