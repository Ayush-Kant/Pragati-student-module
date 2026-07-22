import * as service from '../services/companyDrives.service.js';

const getCompanyId = (req) => req.user?.companyId || null;

export const listDrives = async (req, res, next) => {
  try {
    const companyId = getCompanyId(req);
    if (!companyId) {
      return res.status(403).json({ success: false, error: 'Company profile not found' });
    }

    const data = await service.listCompanyDrives(companyId);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const createDrive = async (req, res, next) => {
  try {
    const companyId = getCompanyId(req);
    if (!companyId) {
      return res.status(403).json({ success: false, error: 'Company profile not found' });
    }

    const data = await service.createCompanyDrive(companyId, req.body);
    return res.status(201).json({
      success: true,
      message: 'Drive created successfully',
      data
    });
  } catch (error) {
    next(error);
  }
};

export const getDriveById = async (req, res, next) => {
  try {
    const companyId = getCompanyId(req);
    if (!companyId) {
      return res.status(403).json({ success: false, error: 'Company profile not found' });
    }

    const data = await service.getCompanyDriveById(companyId, req.params.id);
    if (!data) {
      return res.status(404).json({ success: false, error: 'Drive not found' });
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const updateDrive = async (req, res, next) => {
  try {
    const companyId = getCompanyId(req);
    if (!companyId) {
      return res.status(403).json({ success: false, error: 'Company profile not found' });
    }

    const success = await service.updateCompanyDrive(companyId, req.params.id, req.body);
    if (!success) {
      return res.status(404).json({ success: false, error: 'Drive not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Drive updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const closeDrive = async (req, res, next) => {
  try {
    const companyId = getCompanyId(req);
    if (!companyId) {
      return res.status(403).json({ success: false, error: 'Company profile not found' });
    }

    const success = await service.closeCompanyDrive(companyId, req.params.id);
    if (!success) {
      return res.status(404).json({ success: false, error: 'Drive not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Drive closed successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const pauseDrive = async (req, res, next) => {
  try {
    const companyId = getCompanyId(req);
    if (!companyId) {
      return res.status(403).json({ success: false, error: 'Company profile not found' });
    }

    const success = await service.pauseCompanyDrive(companyId, req.params.id);
    if (!success) {
      return res.status(404).json({ success: false, error: 'Drive not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Drive paused successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const listCandidates = async (req, res, next) => {
  try {
    const companyId = getCompanyId(req);
    if (!companyId) {
      return res.status(403).json({ success: false, error: 'Company profile not found' });
    }

    const data = await service.listCompanyDriveCandidates(companyId, req.params.id);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
