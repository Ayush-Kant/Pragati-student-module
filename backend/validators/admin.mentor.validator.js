const validateRegisterBody = (req, res, next) => {
  const { name, email, password, expertise } = req.body;
  if (!name || !name.trim())
    return res.status(400).json({ error: 'Mentor name is required.' });
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return res.status(400).json({ error: 'A valid email address is required.' });
  if (!password || password.length < 8)
    return res.status(400).json({ error: 'Password must be at least 8 characters.' });
  if (!expertise || !Array.isArray(expertise) || expertise.length === 0)
    return res.status(400).json({ error: 'At least one expertise tag is required.' });
  next();
};

const validateAssignBody = (req, res, next) => {
  const { courseId, batchId } = req.body;
  if (!courseId || !String(courseId).trim())
    return res.status(400).json({ error: 'courseId is required.' });
  if (!batchId || !String(batchId).trim())
    return res.status(400).json({ error: 'batchId is required.' });
  next();
};


const validateReplaceBody = (req, res, next) => {
  const { newMentorId, batchId, reason } = req.body;
  if (!newMentorId)
    return res.status(400).json({ error: 'newMentorId is required.' });
  if (!batchId || !String(batchId).trim())
    return res.status(400).json({ error: 'batchId is required.' });
  if (!reason || reason.trim().length < 5)
    return res.status(400).json({ error: 'A replacement reason (min 5 characters) is required.' });
  next();
};

export { validateRegisterBody, validateAssignBody, validateReplaceBody };