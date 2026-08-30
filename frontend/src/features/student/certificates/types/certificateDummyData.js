export const certificates = [
  {
    id: "CERT-001",
    title: "Full Stack Web Development",
    issueDate: "2026-08-01",
    status: "Issued",
    verificationStatus: "Verified"
  }
];

export const certificateEligibility = {
  courseCompletion: 100,
  assessmentCompletion: 100,
  projectCompletion: 100,
  eligible: true
};

export const certificateApiResponse = {
  success: true,
  certificates,
  eligibility: certificateEligibility
};