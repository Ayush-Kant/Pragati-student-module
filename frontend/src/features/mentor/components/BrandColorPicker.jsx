import React from "react";

const BrandColorPicker = ({
  register,
  watch,
  setValue,
  errors,
}) => {
  const primaryColor = watch("primaryColor") || "#2563eb";
  const secondaryColor = watch("secondaryColor") || "#1e293b";

  const ColorField = ({
    label,
    name,
    value,
    error,
  }) => (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 mb-2">
        {label}
      </label>

      <div className="flex items-center gap-2 border rounded-lg px-2 py-2 bg-white">
        <input
          type="color"
          value={value}
          onChange={(e) => setValue(name, e.target.value)}
          className="w-10 h-10 border rounded cursor-pointer"
        />

        <input
          type="text"
          {...register(name)}
          value={value}
          onChange={(e) => setValue(name, e.target.value)}
          className="w-full outline-none text-sm font-medium bg-transparent"
        />
      </div>

      {error && (
        <p className="text-red-500 text-xs mt-1">
          {error.message}
        </p>
      )}
    </div>
  );

  return (
   
  
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <ColorField
        label="Primary Color"
        name="primaryColor"
        value={primaryColor}
        error={errors?.primaryColor}
      />

      <ColorField
        label="Secondary Color"
        name="secondaryColor"
        value={secondaryColor}
        error={errors?.secondaryColor}
      />
    </div>
  </div>
);
};

export default BrandColorPicker;