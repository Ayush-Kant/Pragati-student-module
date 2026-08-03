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
    <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
    {subtitle && (
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
    )}
  </div>
);

const FieldDisplay = ({ label, value, icon: Icon }) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest flex items-center gap-1">
      {Icon && <Icon className="h-3.5 w-3.5" />}
      {label}
    </span>
    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
      {value || <span className="text-gray-300 italic font-normal">Not provided</span>}
    </span>
  </div>
);

const FieldInput = ({ label, name, value, onChange, error, type = 'text', required, icon: Icon }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
      {Icon && <Icon className="h-4 w-4 text-gray-400" />}
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value || ''}
      onChange={onChange}
      className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-colors bg-white dark:bg-gray-700 dark:text-white ${
        error ? 'border-red-400 focus:ring-red-200' : 'border-gray-300 focus:ring-orange-500'
      }`}
    />
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

/**
 * A component for displaying and editing address information.
 * Supports view and edit modes with validation.
 * @param {Object} props - The component props
 * @param {Object} [props.profile={}] - The student profile data object
 * @param {boolean} [props.isEditing=false] - Whether the component is in edit mode
 * @param {Function} [props.onUpdate] - Callback when address is updated with form data
 * @param {Object} [props.validationErrors={}] - Validation errors object
 * @returns {JSX.Element} The address information component
 */
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
      onUpdate(form);
    }
  };

  const errors = { ...localErrors, ...validationErrors };

  if (!isEditing) {
    const formattedAddress = formatAddress(address);

    return (
      <div className="rounded-2xl border border-gray-200 bg-white/80 p-6 shadow-sm backdrop-blur-xl dark:border-gray-700 dark:bg-gray-800/80">
        <SectionHeader
          title="Address Information"
          subtitle="Your location details"
        />
        {formattedAddress ? (
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-orange-500 mt-0.5 shrink-0" />
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              {formattedAddress}
            </p>
          </div>
        ) : (
          <p className="text-sm text-gray-400 italic">No address provided</p>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white/80 p-6 shadow-sm backdrop-blur-xl dark:border-gray-700 dark:bg-gray-800/80">
      <SectionHeader
        title="Address Information"
        subtitle="Update your location details"
      />
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <FieldInput
              label="Street Address"
              name="street"
              value={form.street}
              onChange={handleChange}
              error={errors.street}
              required
              icon={MapPin}
            />
          </div>
          <FieldInput
            label="City"
            name="city"
            value={form.city}
            onChange={handleChange}
            error={errors.city}
            required
          />
          <FieldInput
            label="State"
            name="state"
            value={form.state}
            onChange={handleChange}
            error={errors.state}
            required
          />
          <FieldInput
            label="Country"
            name="country"
            value={form.country}
            onChange={handleChange}
            error={errors.country}
            required
          />
          <FieldInput
            label="Pincode"
            name="pincode"
            value={form.pincode}
            onChange={handleChange}
            error={errors.pincode}
            required
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => onUpdate && onUpdate(null)}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddressInformation;
