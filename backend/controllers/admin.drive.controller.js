// admin.drive.controller.js

import * as service from '../services/admin.drive.service.js';

export const listDrives = async (req, res) => {
  try {
    const { search, company, status, stage, page, limit } = req.query;
    const result = await service.listDrives({
      search, company, status, stage,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
    });

    res.status(200).json({
      drives: result.drives,
      total: result.total,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createDrive = async (req, res) => {
  try {
    const { title, companyId, criteria, applicationDeadline } = req.body;
    const drive = await service.createDrive({
      title, companyId, criteria, applicationDeadline,
      createdBy: req.user.userId,
    });

    res.status(201).json({
      message: 'Recruitment drive created successfully.',
      drive,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getDriveById = async (req, res) => {
  try {
    const drive = await service.getDriveById(req.params.id);
    if (!drive) {
      return res.status(404).json({ message: 'Drive not found' });
    }
    res.status(200).json(drive);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateDrive = async (req, res) => {
  try {
    const drive = await service.updateDrive(req.params.id, req.body);
    if (!drive) {
      return res.status(404).json({ message: 'Drive not found' });
    }
    res.status(200).json({ message: 'Drive updated successfully.', drive });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const advanceDrive = async (req, res) => {
  try {
    const result = await service.advanceDrive(req.params.id, req.user.userId);

    if (result.error === 'NOT_FOUND') {
      return res.status(404).json({ message: 'Drive not found' });
    }
    if (result.error === 'FROZEN') {
      return res.status(400).json({ error: 'Pipeline is frozen.' });
    }
    if (result.error === 'FINAL_STAGE') {
      return res.status(400).json({ error: 'Drive is already at the final stage.' });
    }

    res.status(200).json({
      message: 'Drive advanced to next stage.',
      drive: { id: `drive_${req.params.id}`, ...result },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const freezeDrive = async (req, res) => {
  try {
    const result = await service.freezeDrive(req.params.id, req.user.userId);

    if (result.error === 'NOT_FOUND') {
      return res.status(404).json({ message: 'Drive not found' });
    }
    if (result.error === 'ALREADY_FROZEN') {
      return res.status(400).json({ error: 'Drive is already frozen.' });
    }

    res.status(200).json({
      message: 'Pipeline frozen. No further changes allowed until unfrozen.',
      drive: { id: `drive_${req.params.id}`, ...result },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const unfreezeDrive = async (req, res) => {
  try {
    const result = await service.unfreezeDrive(req.params.id);

    if (result.error === 'NOT_FOUND') {
      return res.status(404).json({ message: 'Drive not found' });
    }
    if (result.error === 'NOT_FROZEN') {
      return res.status(400).json({ error: 'Drive is not currently frozen.' });
    }

    res.status(200).json({
      message: 'Pipeline unfrozen. Changes are now permitted.',
      drive: { id: `drive_${req.params.id}`, ...result },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCandidates = async (req, res) => {
  try {
    const { stage, page, limit } = req.query;
    const result = await service.getCandidates(req.params.id, {
      stage,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
    });

    res.status(200).json({
      driveId: `drive_${req.params.id}`,
      candidates: result.candidates,
      total: result.total,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const moveCandidate = async (req, res) => {
  try {
    const { studentId, stage } = req.body;
    const result = await service.moveCandidate(req.params.id, studentId, stage);

    if (result.error === 'DRIVE_NOT_FOUND') {
      return res.status(404).json({ message: 'Drive not found' });
    }
    if (result.error === 'STUDENT_NOT_FOUND') {
      return res.status(404).json({ message: 'Student is not enrolled in this drive' });
    }
    if (result.error === 'FROZEN') {
      return res.status(400).json({ error: 'Pipeline is frozen.' });
    }

    res.status(200).json({
      message: `Candidate moved to ${stage} stage.`,
      studentId,
      driveId: `drive_${req.params.id}`,
      previousStage: result.previousStage,
      currentStage: result.currentStage,
      movedAt: result.movedAt,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const shortlistCandidates = async (req, res) => {
  try {
    const { criteria } = req.body;
    const result = await service.shortlistCandidates(req.params.id, criteria);

    if (result.error === 'NOT_FOUND') {
      return res.status(404).json({ message: 'Drive not found' });
    }
    if (result.error === 'FROZEN') {
      return res.status(400).json({ error: 'Pipeline is frozen.' });
    }

    res.status(200).json({
      message: `Shortlisting criteria applied. ${result.shortlisted} candidates shortlisted.`,
      shortlisted: result.shortlisted,
      totalEvaluated: result.totalEvaluated,
      driveId: `drive_${req.params.id}`,
      stage: 'shortlist',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const assignTest = async (req, res) => {
  try {
    const { assessmentId } = req.body;
    const result = await service.assignTest(req.params.id, assessmentId);

    if (result.error === 'ASSESSMENT_NOT_FOUND') {
      return res.status(400).json({ error: 'Assessment does not exist.' });
    }
    if (result.error === 'DRIVE_NOT_FOUND') {
      return res.status(404).json({ message: 'Drive not found' });
    }

    res.status(200).json({
      message: 'Assessment linked to drive. Will activate at Screening stage.',
      driveId: `drive_${req.params.id}`,
      assessmentId,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const assignCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const result = await service.assignCourse(req.params.id, courseId);

    if (result.error === 'COURSE_NOT_FOUND') {
      return res.status(400).json({ error: 'Course does not exist.' });
    }
    if (result.error === 'DRIVE_NOT_FOUND') {
      return res.status(404).json({ message: 'Drive not found' });
    }

    res.status(200).json({
      message: 'Training program linked to drive. Activates at Training stage.',
      driveId: `drive_${req.params.id}`,
      courseId,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
