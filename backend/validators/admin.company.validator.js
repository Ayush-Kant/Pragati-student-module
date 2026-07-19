// admin.company.validator.js

const validateRejectBody = (req,res,next) => {

    if (!req.body || !req.body.reason || req.body.reason.trim().length < 5) {
        return res.status(400).json({error: true,message:'A rejection reason (min 5 characters) is required.',code: 'INVALID_REJECTION_REASON',});
  }
  next();
};


const validateSuspendBody = (req,res,next) => {

    if (!req.body || !req.body.reason || req.body.reason.trim().length < 5) {
        return res.status(400).json({error: true,message:'A suspension reason (min 5 characters) is required.',code: 'INVALID_SUSPENSION_REASON',});
  }
  next();
};


const validatePagination = (req,res,next) => {

    const { page, limit } = req.query;

    if (
        page &&
        (isNaN(page) || Number(page) < 1)
    ) {
        return res.status(400).json({
        error: true,
        message:
            'Page must be a positive number.',
        code: 'INVALID_PAGE',
        });
    }

    if (
        limit &&
        (
        isNaN(limit) ||
        Number(limit) < 1 ||
        Number(limit) > 100
        )
    ) {
        return res.status(400).json({
        error: true,
        message:
            'Limit must be between 1 and 100.',
        code: 'INVALID_LIMIT',
        });
    }

  next();
};

const validateCompanyId = (req,res,next) => {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
        return res.status(400).json({
        error: true,
        message: 'Invalid company ID.',
        code: 'INVALID_COMPANY_ID',
        });
    }

    next();
};

export {
  validateRejectBody,
  validateSuspendBody,
  validatePagination,
  validateCompanyId,
};