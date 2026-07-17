import * as offerRepository from "../repositories/companyOffer.repository.js";

export const createOffer = async (companyId, payload) => {
  return await offerRepository.createOffer(companyId, payload);
};

export const getOffers = async (companyId) => {
  return await offerRepository.getAllOffers(companyId);
};

export const getOfferById = async (id, companyId) => {
  return await offerRepository.getOfferById(id, companyId);
};

export const updateOfferStatus = async (id, status, companyId) => {
  return await offerRepository.updateOfferStatus(id, status, companyId);
};

export const deleteOffer = async (id, companyId) => {
  return await offerRepository.deleteOffer(id, companyId);
};
