import api from '../../../../services/api';

const unwrap = (response) => response?.data?.data ?? response?.data;

const normalize = (certificate) => {
  if (!certificate) return null;
  return {
    ...certificate,
    id: String(certificate.id ?? certificate.certificateId),
    certificateId: certificate.certificateId ?? certificate.id,
    title: certificate.title || certificate.driveTitle || certificate.driveName || 'Certificate of Completion',
    issueDate: certificate.issuedAt,
    status: certificate.status || (certificate.revoked ? 'Revoked' : 'Issued'),
    verificationStatus: certificate.revoked ? 'Revoked' : 'Verified',
    verificationCode: certificate.verificationCode || certificate.verifyUuid,
    verificationUrl: certificate.verificationUrl || certificate.verifyUrl,
  };
};

export const getCertificates = async () => {
  try {
    const response = await api.get('/student/certificates');
    const data = unwrap(response);
    const certificates = Array.isArray(data) ? data : data?.certificates || [];
    return { success: true, certificates: certificates.map(normalize) };
  } catch (error) {
    if (error?.response?.status === 404) return { success: true, certificates: [] };
    throw error;
  }
};

export const getCertificateById = async (certificateId) => {
  const response = await api.get(`/student/certificates/${certificateId}`);
  return { success: true, certificate: normalize(unwrap(response)) };
};

export const getCertificateEligibility = async (driveId = null) => {
  const path = driveId
    ? `/student/certificates/eligibility?driveId=${encodeURIComponent(driveId)}`
    : '/student/certificates/eligibility';
  const response = await api.get(path);
  return { success: true, eligibility: unwrap(response) };
};

export const verifyCertificate = async (verificationCode) => {
  const code = encodeURIComponent(String(verificationCode || '').trim());
  if (!code) throw new Error('Verification code is required.');
  const response = await api.get(`/verify/${code}`);
  return response.data;
};

export const downloadCertificate = async (certificateId) => {
  const response = await api.get(`/student/certificates/${certificateId}/download`, {
    responseType: 'blob',
  });
  const contentType = String(response.headers?.['content-type'] || '').toLowerCase();

  let blob = response.data;
  if (contentType.includes('application/json')) {
    const text = await response.data.text();
    let payload;
    try {
      payload = JSON.parse(text);
    } catch {
      throw new Error('Certificate download response was invalid.');
    }
    if (!payload?.success || !payload?.downloadUrl) {
      throw new Error(payload?.message || 'Certificate download is not available.');
    }
    const signedResponse = await fetch(payload.downloadUrl);
    if (!signedResponse.ok) {
      throw new Error('Unable to download certificate.');
    }
    blob = await signedResponse.blob();
  }

  if (!(blob instanceof Blob) || blob.size === 0) {
    throw new Error('Certificate download returned an empty file.');
  }

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `certificate-${String(certificateId)}.pdf`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);

  return { success: true, certificateId: String(certificateId) };
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
