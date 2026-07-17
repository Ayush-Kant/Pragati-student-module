import { pool } from '../../../config/db.js';
import { resolveUserIntId } from '../../../utils/userResolver.js';
import * as offerService from "../services/offer.service.js";

const getCompanyId = async (req) => {
  const userId = req.user.userId;
  const intUserId = await resolveUserIntId(userId);
  if (!intUserId) return null;
  const result = await pool.query('SELECT id FROM companies WHERE user_id = $1', [intUserId]);
  return result.rows[0]?.id || null;
};

export const createOffer = async (req, res, next) => {
  try {
    const companyId = await getCompanyId(req);
    if (!companyId) {
      return res.status(403).json({ success: false, error: 'Company profile not found' });
    }

    const offer = await offerService.createOffer(companyId, req.body);
    return res.status(201).json({
      success: true,
      message: "Offer generated successfully",
      data: offer,
    });
  } catch (error) {
    next(error);
  }
};

export const getOffers = async (req, res, next) => {
  try {
    const companyId = await getCompanyId(req);
    if (!companyId) {
      return res.status(403).json({ success: false, error: 'Company profile not found' });
    }

    const offers = await offerService.getOffers(companyId);
    return res.status(200).json({
      success: true,
      data: offers,
    });
  } catch (error) {
    next(error);
  }
};

export const getOfferById = async (req, res, next) => {
  try {
    const companyId = await getCompanyId(req);
    if (!companyId) {
      return res.status(403).json({ success: false, error: 'Company profile not found' });
    }

    const offer = await offerService.getOfferById(req.params.id, companyId);
    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: offer,
    });
  } catch (error) {
    next(error);
  }
};

export const updateOfferStatus = async (req, res, next) => {
  try {
    const companyId = await getCompanyId(req);
    if (!companyId) {
      return res.status(403).json({ success: false, error: 'Company profile not found' });
    }

    const offer = await offerService.updateOfferStatus(
      req.params.id,
      req.body.status || req.body.offer_status,
      companyId
    );

    if (!offer) {
      return res.status(404).json({ success: false, error: 'Offer not found or unauthorized' });
    }

    return res.status(200).json({
      success: true,
      message: "Offer status updated successfully",
      data: offer,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteOffer = async (req, res, next) => {
  try {
    const companyId = await getCompanyId(req);
    if (!companyId) {
      return res.status(403).json({ success: false, error: 'Company profile not found' });
    }

    const deleted = await offerService.deleteOffer(req.params.id, companyId);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Offer not found or unauthorized' });
    }

    return res.status(200).json({
      success: true,
      message: "Offer deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
