// admin.company.controller.js

import * as service from '../services/company.service.js';

import {sendApprovalEmail} from '../services/admin.company.email.service.js';
import {sendRejectionEmail} from '../services/admin.company.email.service.js';
import {sendSuspensionEmail} from '../services/admin.company.email.service.js';
import {sendReinstatementEmail} from '../services/admin.company.email.service.js';

const getAllCompanies = async (req, res) => {
    try {
        const data = await service.getAllCompanies(req.query);

        res.status(200).json({
        companies: data,
        total: data.length,
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 20,
        });
    } 
    catch (err) {
        res.status(500).json({
        error: err.message,
        });
    }
};

const getCompanyById = async (req, res) => {
    try {
        const company = await service.getCompanyById(
        req.params.id
        );

        if (!company) {
        return res.status(404).json({
            message: 'Company not found',
        });
        }

        res.json(company);
    } 
    catch (err) {
        res.status(500).json({
        error: err.message,
        });
    }
};


const getCompanyStats = async (req, res) => {
    try {
        const stats = await service.getCompanyStats(
        req.params.id
        );

        if (!stats) {
        return res.status(404).json({
            message: 'Stats not found',
        });
        }

        res.json(stats);
    }
    catch (err) {
        res.status(500).json({
        error: err.message,
        });
    }
};


const getCompanyDrives = async (req, res) => {
    try {
        const drives = await service.getCompanyDrives(
        req.params.id
        );

        res.json({
        drives,
        });
    }
    catch (err) {
        res.status(500).json({
        error: err.message,
        });
    }
};


const approveCompany = async (req, res) => {
    try {
        const company = await service.approveCompany(req.params.id);
        if (!company) {
            return res.status(404).json({
                message: 'Company not found',
            });
        }

        if (company.alreadyApproved) {
            return res.status(409).json({
                error: 'Company is already approved.',
            });
        }

        try {
            await sendApprovalEmail(
                company.email,
                company.name
            );
        } 
        catch (emailErr) {
            console.error(
                'Approval email failed:',
                emailErr.message
            );
        }

        res.json({
            success: true,
            message:'Company approved and notification email sent.',
            company: {
                companyId: company.companyId,
                status: company.status,
            },
        });
    } catch (err) {
        res.status(500).json({
        error: err.message,
        });
    }
};


const rejectCompany = async (req, res) => {
  try {
    const { reason } = req.body;

    const company = await service.rejectCompany(
      req.params.id,
      reason
    );

    if (!company) {
      return res.status(404).json({
        message: 'Company not found',
      });
    }

    try {
      await sendRejectionEmail(
        company.email,
        company.name,
        reason
      );
    } catch (emailErr) {
      console.error(
        'Rejection email failed:',
        emailErr.message
      );
    }

    res.json({
      success: true,
      message:
        'Company rejected and notification email sent.',
      company: {
        companyId: company.companyId,
        status: company.status,
        rejectionReason:
          company.rejectionReason,
      },
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

const suspendCompany = async (req, res) => {
  try {
    const { reason } = req.body;

    const company = await service.suspendCompany(
      req.params.id,
      reason
    );

    if (!company) {
      return res.status(404).json({
        message: 'Company not found',
      });
    }

    try {
      await sendSuspensionEmail(
        company.email,
        company.name,
        reason
      );
    } catch (emailErr) {
      console.error(
        'Suspension email failed:',
        emailErr.message
      );
    }

    res.json({
      success: true,
      message:
        'Company suspended and notification email sent.',
      company: {
        companyId: company.companyId,
        status: company.status,
        suspensionReason:
          company.suspensionReason,
      },
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

const reinstateCompany = async (req, res) => {
  try {
    const company =
      await service.reinstateCompany(
        req.params.id
      );

    if (!company) {
      return res.status(404).json({
        message: 'Company not found',
      });
    }

    try {
      await sendReinstatementEmail(
        company.email,
        company.name
      );
    } catch (emailErr) {
      console.error(
        'Reinstatement email failed:',
        emailErr.message
      );
    }

    res.json({
      success: true,
      message:
        'Company reinstated successfully.',
      company: {
        companyId: company.companyId,
        status: company.status,
      },
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

const getCompanyRankings = async (
  req,
  res
) => {
  try {
    const data =
      await service.getCompanyRankings(
        req.query.limit
      );

    res.json({
      rankings: data,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

const getActiveDriveCompanies = async (
  req,
  res
) => {
  try {
    const data =
      await service.getActiveDriveCompanies();

    res.json({
      companies: data,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

export {
  getAllCompanies,
  getCompanyById,
  getCompanyStats,
  getCompanyDrives,
  approveCompany,
  rejectCompany,
  suspendCompany,
  reinstateCompany,
  getCompanyRankings,
  getActiveDriveCompanies,
};