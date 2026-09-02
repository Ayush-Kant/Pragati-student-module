import api from "../../../services/api";

const studentProfileService = {
  async getMyProfile() {
    const { data } = await api.get("/student/profile");
    return data;
  },

  async updateProfile(profile) {
    const { data } = await api.put("/student/profile", profile);
    return data;
  },

  async getCompleteness() {
    const { data } = await api.get("/student/profile/completeness");
    return data;
  },

  async updatePersonal(personal) {
    const { data } = await api.patch("/student/profile/personal", personal);
    return data;
  },

  async updateContact(contact) {
    const { data } = await api.patch("/student/profile/contact", contact);
    return data;
  },

  async updateAcademic(academic) {
    const { data } = await api.patch("/student/profile/academic", academic);
    return data;
  },

  async updateSkills(skills) {
    const { data } = await api.put("/student/profile/skills", skills);
    return data;
  },

  async updateCertifications(certifications) {
    const { data } = await api.put("/student/profile/certifications", certifications);
    return data;
  },

  async updateSocial(social) {
    const { data } = await api.patch("/student/profile/social", social);
    return data;
  },

  async updateResume(resume) {
    const { data } = await api.put("/student/profile/resume", resume);
    return data;
  },

  async deleteResume() {
    const { data } = await api.delete("/student/profile/resume");
    return data;
  },

  async updateDocuments(documents) {
    const { data } = await api.put("/student/profile/documents", documents);
    return data;
  },
};

export default studentProfileService;
