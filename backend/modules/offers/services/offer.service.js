import * as offerRepository from "../repositories/offer.repository.js";

export const createOffer = async (payload) => {
  return await offerRepository.createOffer(payload);
};

export const getOffers = async () => {
  return await offerRepository.getAllOffers();
};

export const getOfferById = async (id) => {
  return await offerRepository.getOfferById(id);
};

export const updateOfferStatus = async (id, status) => {
  return await offerRepository.updateOfferStatus(id, status);
};

export const deleteOffer = async (id) => {
  return await offerRepository.deleteOffer(id);
};
