import { useState, useRef } from 'react';
import { Award, Plus, X, Calendar, FileText, Eye, Trash2 } from 'lucide-react';

const validateCertifications = (certifications) => {
  const errors = {};
  if (!Array.isArray(certifications)) {
    errors.certifications = 'Certifications must be an array';
    return errors;
  }
  certifications.forEach((cert, index) => {
    if (!cert.name || cert.name.trim() === '') {
      errors[`cert_${index}_name`] = `Certification ${index + 1}: name is required`;
    }
    if (!cert.issuer || cert.issuer.trim() === '') {
      errors[`cert_${index}_issuer`] = `Certification ${index + 1}: issuer is required`;
    }
    if (cert.year === undefined || cert.year === null || isNaN(Number(cert.year))) {
      errors[`cert_${index}_year`] = `Certification ${index + 1}: valid year is required`;
    } else {
      const year = Number(cert.year);
      if (year < 1990 || year > 2030) {
        errors[`cert_${index}_year`] = `Certification ${index + 1}: year must be between 1990 and 2030`;
      }
    }
  });
  return errors;
};

const SectionHeader = ({ title, subtitle }) => (
  <div className="mb-4">
    <h2 className="text-lg font-semibold text-white">{title}</h2>
    {subtitle && <p className="mt-1 text-sm text-gray-400">{subtitle}</p>}
  </div>
);

const Certifications = ({ certifications = [], isEditing = false, onAdd, onRemove, validationErrors = {} }) => {
  const [newCert, setNewCert] = useState({ name: '', issuer: '', year: '' });
  const [localErrors, setLocalErrors] = useState({});
  const [editingCertId, setEditingCertId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCert((prev) => ({ ...prev, [name]: value }));
    if (localErrors[name]) {
      setLocalErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleAdd = () => {
    if (!newCert.name.trim() || !newCert.issuer.trim() || !newCert.year) return;
    const certToAdd = {
      id: `cert-${Date.now()}`,
      name: newCert.name.trim(),
      issuer: newCert.issuer.trim(),
      year: parseInt(newCert.year, 10),
      document: null
    };
    const testCerts = [...certifications, certToAdd];
    const errors = validateCertifications(testCerts);
    if (Object.keys(errors).length > 0) {
      setLocalErrors(errors);
      return;
    }
    setLocalErrors({});
    onAdd && onAdd(certToAdd);
    setNewCert({ name: '', issuer: '', year: '' });
  };

  const startEdit = (cert) => {
    setEditingCertId(cert.id);
    setEditForm({ ...cert });
  };

  const saveEdit = () => {
    if (!editForm.name.trim() || !editForm.issuer.trim() || !editForm.year) return;
    onAdd && onRemove(editingCertId);
    onAdd && onAdd({ ...editForm, id: editingCertId });
    setEditingCertId(null);
    setEditForm({});
  };

  const cancelEdit = () => {
    setEditingCertId(null);
    setEditForm({});
  };

  const handleDocumentUpload = async (certId, file) => {
    setUploadingDoc(true);
    const document = {
      id: `doc-${Date.now()}`,
      name: file.name,
      url: URL.createObjectURL(file),
      size: file.size,
      type: file.type
    };
    const cert = certifications.find(c => c.id === certId);
    if (cert) {
      onAdd && onRemove(certId);
      onAdd && onAdd({ ...cert, document });
    }
    setUploadingDoc(false);
  };

  const errors = { ...localErrors, ...validationErrors };

  return (
    <div className="rounded-2xl border border-gray-700/50 bg-gray-800/40 p-6 shadow-2xl shadow-orange-500/5 backdrop-blur-sm hover:shadow-orange-500/10 transition-all duration-300">
      <SectionHeader title="Certifications" subtitle="Your professional certifications and achievements" />
      {!isEditing ? (
        <div className="space-y-3">
          {certifications.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No certifications added yet</p>
          ) : (
            certifications.map((cert, index) => (
              <div key={cert.id || index} className="flex items-center justify-between rounded-xl border border-gray-700/50 bg-white/5 p-4 hover:border-orange-500/30 transition-all duration-200">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{cert.name}</p>
                    <p className="text-xs text-gray-400">{cert.issuer}</p>
                    {cert.document && (
                      <a href={cert.document.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-orange-400 hover:text-orange-300 mt-1 transition-colors">
                        <FileText className="h-3 w-3" />
                        View Certificate
                      </a>
                    )}
                  </div>
                </div>
                <span className="flex items-center gap-1 text-xs font-medium text-gray-400">
                  <Calendar className="h-3.5 w-3.5" />
                  {cert.year}
                </span>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-3">
            {certifications.map((cert, index) => (
              <div key={cert.id || index} className="rounded-xl border border-gray-700/50 bg-white/5 p-4 hover:border-orange-500/30 transition-all duration-200">
                {editingCertId === cert.id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editForm.name || ''}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Certification name"
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors bg-white/5 text-white"
                    />
                    <input
                      type="text"
                      value={editForm.issuer || ''}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, issuer: e.target.value }))}
                      placeholder="Issuing organization"
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors bg-white/5 text-white"
                    />
                    <input
                      type="number"
                      value={editForm.year || ''}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, year: e.target.value }))}
                      placeholder="Year"
                      min="1990"
                      max="2030"
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors bg-white/5 text-white"
                    />
                    <div className="flex gap-2">
                      <button type="button" onClick={saveEdit} className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-colors">
                        Save
                      </button>
                      <button type="button" onClick={cancelEdit} className="px-4 py-2 text-xs font-medium text-gray-300 bg-white/5 border border-gray-700 rounded-lg hover:bg-white/10 transition-colors">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
                          <Award className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{cert.name}</p>
                          <p className="text-xs text-gray-400">{cert.issuer} • {cert.year}</p>
                          {cert.document && (
                            <a href={cert.document.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-orange-400 hover:text-orange-300 mt-1 transition-colors">
                              <Eye className="h-3 w-3" />
                              View Document
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button type="button" onClick={() => startEdit(cert)} className="rounded-lg p-1.5 text-gray-400 hover:text-orange-400 hover:bg-orange-500/10 transition-colors" title="Edit">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button type="button" onClick={() => onRemove && onRemove(cert.id || index)} className="rounded-lg p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors" title="Delete">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-3">
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleDocumentUpload(cert.id || index, file);
                          e.target.value = '';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingDoc}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-300 bg-white/5 border border-gray-700 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        {uploadingDoc ? 'Uploading...' : cert.document ? 'Replace Document' : 'Upload Document'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              name="name"
              value={newCert.name}
              onChange={handleChange}
              placeholder="Certification name"
              className={`px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-colors bg-white/5 text-white ${
                errors.name ? 'border-red-400 focus:ring-red-200' : 'border-gray-700 focus:ring-orange-500'
              }`}
            />
            <input
              type="text"
              name="issuer"
              value={newCert.issuer}
              onChange={handleChange}
              placeholder="Issuing organization"
              className={`px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-colors bg-white/5 text-white ${
                errors.issuer ? 'border-red-400 focus:ring-red-200' : 'border-gray-700 focus:ring-orange-500'
              }`}
            />
            <div className="flex gap-2">
              <input
                type="number"
                name="year"
                value={newCert.year}
                onChange={handleChange}
                placeholder="Year"
                min="1990"
                max="2030"
                className={`px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-colors bg-white/5 text-white ${
                  errors.year ? 'border-red-400 focus:ring-red-200' : 'border-gray-700 focus:ring-orange-500'
                }`}
              />
              <button
                type="button"
                onClick={handleAdd}
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:from-orange-600 hover:to-orange-700 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-[#050505]"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
          {(Object.keys(errors).length > 0) && (
            <div className="space-y-1">
              {Object.values(errors).map((error, index) => (
                <p key={index} className="text-xs text-red-400">{error}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Certifications;
