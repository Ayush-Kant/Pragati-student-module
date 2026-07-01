import * as repository from "../repositories/companyProfile.repository.js";

export const getCompanyProfileService = async (companyId) => {
  return await repository.getCompanyByIdRepo(companyId);
};

export const updateCompanyProfileService = async (companyId, body) => {
  return await repository.updateCompanyRepo(companyId, body);
};

export const getCompanyTeamService = async (companyId) => {
  return await repository.getTeamMembersRepo(companyId);
};

export const createCompanyTeamMemberService = async (body) => {
  return await repository.createTeamMemberRepo(body);
};

export const updateCompanyTeamMemberService = async (id, body) => {
  return await repository.updateTeamMemberRepo(id, body);
};

export const deleteCompanyTeamMemberService = async (id) => {
  return await repository.deleteTeamMemberRepo(id);
};
