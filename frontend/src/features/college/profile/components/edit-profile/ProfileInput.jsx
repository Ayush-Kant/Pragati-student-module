import React from 'react';

export default function ProfileInput({
  label,
  name,
  value,
  placeholder,
  type = "text",
  onChange,
  required = false,
}) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-400">
          {label}
        </span>
      )}
      <input
        name={name}
        value={value}
        type={type}
        required={required}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 outline-none transition focus:border-[#ff7a00] focus:ring-2 focus:ring-orange-100"
      />
    </label>
  );
}
