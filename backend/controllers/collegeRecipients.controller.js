import * as service from "../services/collegeRecipients.service.js";

/**
 * Location:
 * backend/controllers/collegeRecipients.controller.js
 */

export const getRecipients = async (req, res) => {
  try {
    const recipients = await service.getRecipients(req.params.id);

    res.status(200).json(recipients);
  } catch (err) {
    res.status(err.statusCode || 500).json({
      error: err.message,
    });
  }
};

export const assignRecipients = async (req, res) => {
  try {
    const recipient = await service.assignRecipients(
      req.params.id,
      req.body
    );

    res.status(201).json({
      message: "Recipient assigned successfully.",
      recipient,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      error: err.message,
    });
  }
};

export const removeRecipients = async (req, res) => {
  try {
    const result = await service.removeRecipients(
      req.params.id,
      req.params.recipientId
    );

    res.status(200).json(result);
  } catch (err) {
    res.status(err.statusCode || 500).json({
      error: err.message,
    });
  }
};

export const getRecipientStatus = async (req, res) => {
  try {
    const status = await service.getRecipientStatus(
      req.params.id,
      req.params.recipientId
    );

    res.status(200).json(status);
  } catch (err) {
    res.status(err.statusCode || 500).json({
      error: err.message,
    });
  }
};

export default {
  getRecipients,
  assignRecipients,
  removeRecipients,
  getRecipientStatus,
};