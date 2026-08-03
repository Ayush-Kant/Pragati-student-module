import { useState } from 'react';
import { Award, Plus, X, Calendar } from 'lucide-react';

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
    <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
    {subtitle && (
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
    )}
  </div>
);

/**
 * A component for displaying and managing certifications.
 * Shows a list of certifications with name, issuer, and year.
 * @param {Object} props - The component props
 * @param {Object[]} [props.certifications=[]] - Array of certification objects
 * @param {boolean} [props.isEditing=false] - Whether the component is in edit mode
 * @param {Function} [props.onAdd] - Callback when a certification is added
 * @param {Function} [props.onRemove] - Callback when a certification is removed
 * @param {Object} [props.validationErrors={}] - Validation errors object
 * @returns {JSX.Element} The certifications component
 */
const Certifications = ({ certifications = [], isEditing = false, onAdd, onRemove, validationErrors = {} }) => {
  const [newCert, setNewCert] = useState({ name: '', issuer: '', year: '' });
  const [localErrors, setLocalErrors] = useState({});

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
      year: parseInt(newCert.year, 10)
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

  const errors = { ...localErrors, ...validationErrors };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white/80 p-6 shadow-sm backdrop-blur-xl dark:border-gray-700 dark:bg-gray-800/80">
      <SectionHeader
        title="Certifications"
        subtitle="Your professional certifications and achievements"
      />

      {!isEditing ? (
        <div className="space-y-3">
          {certifications.length === 0 ? (
            <p className="text-sm text-gray-400 italic">No certifications added yet</p>
          ) : (
            certifications.map((cert, index) => (
              <div
                key={cert.id || index}
                className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/50 p-4 dark:border-gray-700 dark:bg-gray-700/50"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-400">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{cert.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{cert.issuer}</p>
                  </div>
                </div>
                <span className="flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400">
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
              <div
                key={cert.id || index}
                className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/50 p-4 dark:border-gray-700 dark:bg-gray-700/50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-400">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{cert.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {cert.issuer} • {cert.year}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onRemove && onRemove(cert.id || index)}
                  className="rounded-full p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
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
              className={`px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-colors bg-white dark:bg-gray-700 dark:text-white ${
                errors.name ? 'border-red-400 focus:ring-red-200' : 'border-gray-300 focus:ring-orange-500'
              }`}
            />
            <input
              type="text"
              name="issuer"
              value={newCert.issuer}
              onChange={handleChange}
              placeholder="Issuing organization"
              className={`px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-colors bg-white dark:bg-gray-700 dark:text-white ${
                errors.issuer ? 'border-red-400 focus:ring-red-200' : 'border-gray-300 focus:ring-orange-500'
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
                className={`px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-colors bg-white dark:bg-gray-700 dark:text-white ${
                  errors.year ? 'border-red-400 focus:ring-red-200' : 'border-gray-300 focus:ring-orange-500'
                }`}
              />
              <button
                type="button"
                onClick={handleAdd}
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:from-orange-600 hover:to-orange-700 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {(Object.keys(errors).length > 0) && (
            <div className="space-y-1">
              {Object.values(errors).map((error, index) => (
                <p key={index} className="text-xs text-red-500">{error}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Certifications;
