import * as offerService from "../services/offer.service.js";

export const createOffer = async (req, res, next) => {
  try {
    const offer = await offerService.createOffer(req.body);

    return res.status(201).json({
      success: true,
      data: offer,
    });
  } catch (error) {
    next(error);
  }
};

export const getOffers = async (req, res, next) => {
  try {
    const offers = await offerService.getOffers();

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
    const offer = await offerService.getOfferById(req.params.id);

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
    const offer = await offerService.updateOfferStatus(
      req.params.id,
      req.body.offer_status,
    );

    return res.status(200).json({
      success: true,
      data: offer,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteOffer = async (req, res, next) => {
  try {
    await offerService.deleteOffer(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Offer deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
