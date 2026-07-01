export const validateSendNotification = (req, res, next) => {
  const { channel, subject, message } = req.body;

  if (!channel || !Array.isArray(channel) || channel.length === 0)
    return res.status(400).json({ error: 'At least one channel is required.' });

  if (!subject)
    return res.status(400).json({ error: 'Subject is required.' });

  if (!message)
    return res.status(400).json({ error: 'Message is required.' });

  const valid = ['email', 'in-app'];
  const invalid = channel.filter((c) => !valid.includes(c));
  if (invalid.length > 0)
    return res.status(400).json({ error: `Invalid channel(s): ${invalid.join(', ')}` });

  next();
};

export const validateScheduleNotification = (req, res, next) => {
  const { channel, subject, message, scheduledAt } = req.body;

  if (!channel || !Array.isArray(channel) || channel.length === 0)
    return res.status(400).json({ error: 'At least one channel is required.' });

  if (!subject)
    return res.status(400).json({ error: 'Subject is required.' });

  if (!message)
    return res.status(400).json({ error: 'Message is required.' });

  if (!scheduledAt)
    return res.status(400).json({ error: 'scheduledAt is required.' });

  if (new Date(scheduledAt) <= new Date())
    return res.status(400).json({ error: 'scheduledAt must be a future date.' });

  next();
};

export const validateTemplate = (req, res, next) => {
  const { name, subject, body } = req.body;

  if (!name || !subject || !body)
    return res.status(400).json({ error: 'name, subject and body are required.' });

  next();
};
