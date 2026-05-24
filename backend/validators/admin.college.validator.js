// admin.college.validator.js
 
const validateRejectBody = (req, res, next) => {
  if (!req.body || !req.body.reason || req.body.reason.trim().length < 5)
    return res.status(400).json({ error: 'A rejection reason (min 5 characters) is required.' });
  next();
};
 
const validateSuspendBody = (req, res, next) => {
  if (!req.body || !req.body.reason || req.body.reason.trim().length < 5)
    return res.status(400).json({ error: 'A suspension reason (min 5 characters) is required.' });
  next();
};
 
export{ validateRejectBody, validateSuspendBody };