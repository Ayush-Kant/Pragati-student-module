import React from 'react';

export default function ProfileTextarea({
  label,
  name,
  value,
  placeholder,
  onChange,
  rows = 4,
  required = false,
}) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-400">
          {label}
        </span>
      )}
      <textarea
        name={name}
        value={value}
        rows={rows}
        required={required}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full resize-y rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold leading-6 text-gray-700 outline-none transition focus:border-[#ff7a00] focus:ring-2 focus:ring-orange-100"
      />
    </label>
  );
}
