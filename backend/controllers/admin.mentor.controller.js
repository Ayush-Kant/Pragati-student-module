import * as service from '../services/admin.mentor.service.js';

export const listMentors = async (req, res) => {
  try {
    const { search, expertise, ratingMin, active, page, limit } = req.query;
    const result = await service.listMentors({ search, expertise, ratingMin, active, page, limit });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMentorById = async (req, res) => {
  try {
    const mentor = await service.getMentorById(req.params.id);
    if (!mentor) {
      return res.status(404).json({ error: 'Mentor not found.' });
    }
    res.status(200).json(mentor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMentorPerformance = async (req, res) => {
  try {
    const data = await service.getMentorPerf(req.params.id);
    if (!data) {
      return res.status(404).json({ error: 'Mentor not found.' });
    }
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const registerMentor = async (req, res) => {
  try {
    const { name, email, password, expertise, bio, phone } = req.body;
    const mentor = await service.registerMentor({ name, email, password, expertise, bio, phone });
    res.status(201).json({
      success: true,
      message: 'Mentor registered successfully.',
      mentor
    });
  } catch (err) {
    if (err.code === 409) {
      return res.status(409).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

export const assignMentor = async (req, res) => {
  try {
    const { courseId, batchId, driveId, title } = req.body;
    const assignment = await service.assignMentor(req.params.id, { courseId, batchId, driveId, title });
    res.status(200).json({
      success: true,
      message: 'Mentor assigned to batch successfully.',
      assignment
    });
  } catch (err) {
    if (err.code === 404) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

export const replaceMentor = async (req, res) => {
  try {
    const { newMentorId, batchId, reason } = req.body;
    const assignment = await service.replaceMentor(req.params.id, { newMentorId, batchId, reason });
    res.status(200).json({
      success: true,
      message: 'Mentor replaced successfully.',
      assignment
    });
  } catch (err) {
    if (err.code === 400) {
      return res.status(400).json({ error: err.message });
    }
    if (err.code === 404) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

export const removeMentor = async (req, res) => {
  try {
    const result = await service.removeMentor(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    if (err.code === 404) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};