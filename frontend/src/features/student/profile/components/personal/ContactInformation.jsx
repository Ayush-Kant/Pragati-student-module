import { useState } from 'react';
import { Mail, Phone } from 'lucide-react';

const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

const isValidPhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  const digits = phone.replace(/\D/g, '');
  return (digits.length === 10) || (digits.length === 12 && digits.startsWith('91'));
};

const validateContactInfo = (data) => {
  const errors = {};
  if (!data.email || !isValidEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }
  if (!data.phone || !isValidPhone(data.phone)) {
    errors.phone = 'Please enter a valid phone number';
  }
  return errors;
};

const SectionHeader = ({ title, subtitle }) => (
  <div className="mb-4">
    <h2 className="text-lg font-semibold text-white">{title}</h2>
    {subtitle && <p className="mt-1 text-sm text-gray-400">{subtitle}</p>}
  </div>
);

const FieldDisplay = ({ label, value, icon: Icon }) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs font-medium text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
      {Icon && <Icon className="h-3.5 w-3.5 text-orange-500" />}
      {label}
    </span>
    <span className="text-sm font-medium text-white">
      {value || <span className="text-gray-500 italic font-normal">Not provided</span>}
    </span>
  </div>
);

const FieldInput = ({ label, name, value, onChange, error, type = 'text', required, icon: Icon }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-300 flex items-center gap-1.5">
      {Icon && <Icon className="h-4 w-4 text-orange-500" />}
      {label}
      {required && <span className="text-red-400">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value || ''}
      onChange={onChange}
      className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-colors bg-white/5 text-white ${
        error ? 'border-red-400 focus:ring-red-200' : 'border-gray-700 focus:ring-orange-500'
      }`}
    />
    {error && <p className="text-xs text-red-400">{error}</p>}
  </div>
);

const ContactInformation = ({ profile = {}, isEditing = false, onUpdate, validationErrors = {} }) => {
  const [form, setForm] = useState({
    email: profile.email || '',
    phone: profile.phone || ''
  });
  const [localErrors, setLocalErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (localErrors[name]) {
      setLocalErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateContactInfo(form);
    setLocalErrors(errors);
    if (Object.keys(errors).length === 0 && onUpdate) {
      onUpdate(form);
    }
  };

  const errors = { ...localErrors, ...validationErrors };

  if (!isEditing) {
    return (
      <div className="rounded-2xl border border-gray-700/50 bg-gray-800/40 p-6 shadow-2xl shadow-orange-500/5 backdrop-blur-sm">
        <SectionHeader title="Contact Information" subtitle="How to reach you" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FieldDisplay label="Email" value={profile.email} icon={Mail} />
          <FieldDisplay label="Phone" value={profile.phone} icon={Phone} />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-700/50 bg-gray-800/40 p-6 shadow-2xl shadow-orange-500/5 backdrop-blur-sm">
      <SectionHeader title="Contact Information" subtitle="Update your contact details" />
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FieldInput label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} required icon={Mail} />
          <FieldInput label="Phone" name="phone" type="tel" value={form.phone} onChange={handleChange} error={errors.phone} required icon={Phone} />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={() => onUpdate && onUpdate(null)} className="px-5 py-2.5 text-sm font-medium text-gray-300 bg-white/5 border border-gray-700 rounded-xl hover:bg-white/10 transition-colors">
            Cancel
          </button>
          <button type="submit" className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-[#050505]">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactInformation;
