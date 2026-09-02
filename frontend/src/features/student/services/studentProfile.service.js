import api from "../../../services/api";

const unwrap = (response) => response?.data?.data ?? response?.data ?? null;

const studentProfileService = {
  async getMyProfile() {
    return unwrap(await api.get("/student/profile"));
  },

  async updateProfile(profile) {
    return unwrap(await api.put("/student/profile", profile));
  },

  async getCompleteness() {
    return unwrap(await api.get("/student/profile/completeness"));
  },

  async updatePersonal(personal) {
    return unwrap(await api.patch("/student/profile/personal", personal));
  },

  async updateContact(contact) {
    return unwrap(await api.patch("/student/profile/contact", contact));
  },

  async updateAcademic(academic) {
    return unwrap(await api.patch("/student/profile/academic", academic));
  },

  async updateSkills(skills) {
    return unwrap(await api.put("/student/profile/skills", skills));
  },

  async updateCertifications(certifications) {
    return unwrap(await api.put("/student/profile/certifications", certifications));
  },

  async updateSocial(social) {
    return unwrap(await api.patch("/student/profile/social", social));
  },

  async updateResume(resume) {
    return unwrap(await api.put("/student/profile/resume", resume));
  },

  async deleteResume() {
    return unwrap(await api.delete("/student/profile/resume"));
  },

  async updateDocuments(documents) {
    return unwrap(await api.put("/student/profile/documents", documents));
  },
};

export default studentProfileService;
