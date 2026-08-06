import React from "react";

const BrandColorPicker = ({ register, watch, setValue, errors }) => {
  const primaryColor = watch("primaryColor") || "#2563eb";
  const secondaryColor = watch("secondaryColor") || "#1e293b";

  const ColorField = ({ label, name, value, error }) => (
    <div>
      <label className="mb-2 block text-[11px] font-medium text-gray-600 capitalize">
        {label}
      </label>
      <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2">
        <div
          className="h-5 w-5 rounded border border-gray-200"
          style={{ backgroundColor: value }}
        >
          <input
            type="color"
            value={value}
            onChange={(e) => setValue(name, e.target.value)}
            className="h-full w-full cursor-pointer opacity-0"
          />
        </div>
        <input
          type="text"
          {...register(name)}
          value={value}
          onChange={(e) => setValue(name, e.target.value)}
          className="w-full bg-transparent text-sm font-medium text-gray-700 outline-none"
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error.message}</p>}
    </div>
  );

  return (
    <div className="grid grid-cols-2 gap-4">
      <ColorField label="Primary Color" name="primaryColor" value={primaryColor} error={errors?.primaryColor} />
      <ColorField label="Secondary Color" name="secondaryColor" value={secondaryColor} error={errors?.secondaryColor} />
    </div>
  );
};

export default BrandColorPicker;