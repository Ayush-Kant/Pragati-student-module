// admin.student.validator.js
const validateBlockBody = (req, res, next) => {
if (!req.body.reason || req.body.reason.trim().length < 5)
return res.status(400).json({ error: 'A block reason (min 5 characters) is required.' });
next();
};


export { validateBlockBody };