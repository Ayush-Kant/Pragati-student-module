import * as repository from '../repositories/companyProfile.repository.js';

export const getCompanyProfileService = async (companyId) => {
    if (!companyId) {
        return null;
    }

    return await repository.getCompanyByIdRepo(companyId);
};

export const updateCompanyProfileService = async (companyId, data) => {
    if (!companyId) {
        throw new Error('Company ID is required');
    }

    if (!data || typeof data !== 'object') {
        throw new Error('Company profile data is required');
    }

    return await repository.updateCompanyRepo(companyId, data);
};

export const getCompanyTeamService = async (companyId) => {
    if (!companyId) {
        return [];
    }

    return await repository.getTeamMembersRepo(companyId);
};

export const createCompanyTeamMemberService = async (data) => {
    if (!data || typeof data !== 'object') {
        throw new Error('Team member data is required');
    }

    return await repository.createTeamMemberRepo(data);
};

export const updateCompanyTeamMemberService = async (id, data) => {
    if (!id) {
        throw new Error('Team member ID is required');
    }

    if (!data || typeof data !== 'object') {
        throw new Error('Team member data is required');
    }

    return await repository.updateTeamMemberRepo(id, data);
};

export const deleteCompanyTeamMemberService = async (id) => {
    if (!id) {
        throw new Error('Team member ID is required');
    }

    return await repository.deleteTeamMemberRepo(id);
};
