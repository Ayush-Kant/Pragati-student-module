import {
  listNotifications,
  sendNotification,
  scheduleNotification,
  listTemplates,
  createTemplate,
  getNotificationById,
} from '../services/admin.notification.service.js';

export const listNotificationsController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const data = await listNotifications({ page, limit });
    return res.status(200).json(data);
  } catch (err) {
    console.error('listNotifications error:', err.message);
    return res.status(500).json({ error: 'Something went wrong.' });
  }
};

export const sendNotificationController = async (req, res) => {
  try {
    const { to, channel, subject, message } = req.body;
    const data = await sendNotification({ to, channel, subject, message });
    return res.status(200).json(data);
  } catch (err) {
    console.error('sendNotification error:', err.message);
    return res.status(500).json({ error: 'Failed to send notification.' });
  }
};

export const scheduleNotificationController = async (req, res) => {
  try {
    const { to, channel, subject, message, scheduledAt } = req.body;
    const data = await scheduleNotification({ to, channel, subject, message, scheduledAt });
    return res.status(200).json(data);
  } catch (err) {
    console.error('scheduleNotification error:', err.message);
    return res.status(500).json({ error: 'Failed to schedule notification.' });
  }
};

// junior handles these
export const listTemplatesController = async (req, res) => {
  try {
    const data = await listTemplates();
    return res.status(200).json(data);
  } catch (err) {
    console.error('listTemplates error:', err.message);
    return res.status(500).json({ error: 'Something went wrong.' });
  }
};


export const createTemplateController = async (req, res) => {
  try {
    const { name, subject, body } = req.body;
    if (!name || !subject || !body) {
      return res.status(400).json({ error: 'All fields (name, subject, body) are required.' });
    }
    const data = await createTemplate({ name, subject, body });
    return res.status(201).json(data);
  } catch (err) {
    console.error('createTemplate error:', err.message);
    return res.status(500).json({ error: 'Failed to create template.' });
  }
};


export const getNotificationByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await getNotificationById(id);
    if (!data) return res.status(404).json({ error: 'Notification not found.' });
    return res.status(200).json(data);
  } catch (err) {
    console.error('getNotificationById error:', err.message);
    return res.status(500).json({ error: 'Something went wrong.' });
  }
};
