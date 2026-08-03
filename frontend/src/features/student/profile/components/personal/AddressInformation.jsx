import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { formatAddress } from '../../utils/studentProfileHelpers';

const validateAddress = (data) => {
  const errors = {};
  if (!data.street || data.street.trim().length < 5) {
    errors.street = 'Street address is required (min 5 characters)';
  }
  if (!data.city || data.city.trim().length < 2) {
    errors.city = 'City is required (min 2 characters)';
  }
  if (!data.state || data.state.trim().length < 2) {
    errors.state = 'State is required (min 2 characters)';
  }
  if (!data.country || data.country.trim().length < 2) {
    errors.country = 'Country is required (min 2 characters)';
  }
  if (!data.pincode || !/^\d{6}$/.test(data.pincode.trim())) {
    errors.pincode = 'Valid 6-digit pincode is required';
  }
  return errors;
};

const SectionHeader = ({ title, subtitle }) => (
  <div className="mb-4">
    <h2 className="text-lg font-semibold text-white">{title}</h2>
    {subtitle && <p className="mt-1 text-sm text-gray-400">{subtitle}</p>}
  </div>
);

const FieldInput = ({ label, name, value, onChange, error, type = 'text', required }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-300 flex items-center gap-1.5">
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

const AddressInformation = ({ profile = {}, isEditing = false, onUpdate, validationErrors = {} }) => {
  const address = profile.address || {};
  const [form, setForm] = useState({
    street: address.street || '',
    city: address.city || '',
    state: address.state || '',
    country: address.country || '',
    pincode: address.pincode || ''
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
    const errors = validateAddress(form);
    setLocalErrors(errors);
    if (Object.keys(errors).length === 0 && onUpdate) {
      onUpdate({ address: form });
    }
  };

  const errors = { ...localErrors, ...validationErrors };

  if (!isEditing) {
    const formattedAddress = formatAddress(address);
    return (
      <div className="rounded-2xl border border-gray-700/50 bg-gray-800/40 p-6 shadow-2xl shadow-orange-500/5 backdrop-blur-sm">
        <SectionHeader title="Address Information" subtitle="Your location details" />
        {formattedAddress ? (
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-orange-500 mt-0.5 shrink-0" />
            <p className="text-sm font-medium text-white">{formattedAddress}</p>
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">No address provided</p>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-700/50 bg-gray-800/40 p-6 shadow-2xl shadow-orange-500/5 backdrop-blur-sm">
      <SectionHeader title="Address Information" subtitle="Update your location details" />
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <FieldInput label="Street Address" name="street" value={form.street} onChange={handleChange} error={errors.street} required icon={MapPin} />
          </div>
          <FieldInput label="City" name="city" value={form.city} onChange={handleChange} error={errors.city} required />
          <FieldInput label="State" name="state" value={form.state} onChange={handleChange} error={errors.state} required />
          <FieldInput label="Country" name="country" value={form.country} onChange={handleChange} error={errors.country} required />
          <FieldInput label="Pincode" name="pincode" value={form.pincode} onChange={handleChange} error={errors.pincode} required />
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

export default AddressInformation;
