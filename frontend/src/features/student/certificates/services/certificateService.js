import api from '../../../../services/api';

const unwrap = (response) => response?.data?.data ?? response?.data;

const normalize = (certificate) => {
  if (!certificate) return null;
  return {
    ...certificate,
    id: String(certificate.id),
    title: certificate.title || certificate.driveTitle || 'Certificate of Completion',
    issueDate: certificate.issuedAt,
    status: certificate.status || (certificate.revoked ? 'Revoked' : 'Issued'),
    verificationStatus: certificate.revoked ? 'Revoked' : 'Verified',
  };
};

export const getCertificates = async () => {
  const response = await api.get('/student/certificates');
  const data = unwrap(response);
  const certificates = Array.isArray(data) ? data : data?.certificates || [];
  return { success: true, certificates: certificates.map(normalize) };
};

export const getCertificateById = async (certificateId) => {
  const response = await api.get(`/student/certificates/${certificateId}`);
  return { success: true, certificate: normalize(unwrap(response)) };
};

export const getCertificateEligibility = async () => {
  const response = await api.get('/student/certificates/eligibility');
  return { success: true, eligibility: unwrap(response) };
};

export const verifyCertificate = async (verifyUuid) => {
  const response = await api.get(`/v1/certificates/verify/${encodeURIComponent(verifyUuid)}`);
  return response.data;
};

export const downloadCertificate = async (certificateId) => {
  const response = await api.get(`/student/certificates/${certificateId}`);
  const certificate = normalize(unwrap(response));
  if (!certificate?.certificateUrl) {
    throw new Error('Certificate download is not available.');
  }

  const downloadResponse = await fetch(certificate.certificateUrl, {
    credentials: 'include',
  });
  if (!downloadResponse.ok) {
    throw new Error('Unable to download certificate.');
  }

  const blob = await downloadResponse.blob();
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${certificate.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase() || 'certificate'}.pdf`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);

  return { success: true, certificateId: certificate.id };
};

export const getCertificateHistory = async () => {
  const result = await getCertificates();
  return {
    success: result.success,
    history: result.certificates.map((certificate) => ({
      id: `HISTORY-${certificate.id}`,
      certificateId: certificate.id,
      title: certificate.title,
      issueDate: certificate.issueDate,
      status: certificate.status,
      verificationStatus: certificate.verificationStatus,
    })),
  };
};

export const getDownloadHistory = async () => ({ success: true, history: [] });

export default {
  getCertificates,
  getCertificateById,
  getCertificateEligibility,
  verifyCertificate,
  downloadCertificate,
  getCertificateHistory,
  getDownloadHistory,
};
