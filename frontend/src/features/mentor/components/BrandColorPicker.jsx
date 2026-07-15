import React from "react";

const BrandColorPicker = ({
  register,
  watch,
  setValue,
  errors,
}) => {
  const primaryColor = watch("primaryColor") || "#2563EB";
  const secondaryColor = watch("secondaryColor") || "#9333EA";

  return (
    <div className="space-y-6">

      {/* Primary Color */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Primary Color
        </label>

        <div className="flex items-center gap-3">

          <input
            type="color"
            value={primaryColor}
            onChange={(e) =>
              setValue("primaryColor", e.target.value)
            }
            className="w-12 h-12 rounded-lg border cursor-pointer"
          />

          <input
            type="text"
            {...register("primaryColor")}
            value={primaryColor}
            onChange={(e) =>
              setValue("primaryColor", e.target.value)
            }
            className="flex-1 border rounded-lg px-3 py-2"
          />
        </div>

        {errors?.primaryColor && (
          <p className="text-red-500 text-xs mt-2">
            {errors.primaryColor.message}
          </p>
        )}
      </div>

      {/* Secondary Color */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Secondary Color
        </label>

        <div className="flex items-center gap-3">

          <input
            type="color"
            value={secondaryColor}
            onChange={(e) =>
              setValue("secondaryColor", e.target.value)
            }
            className="w-12 h-12 rounded-lg border cursor-pointer"
          />

          <input
            type="text"
            {...register("secondaryColor")}
            value={secondaryColor}
            onChange={(e) =>
              setValue("secondaryColor", e.target.value)
            }
            className="flex-1 border rounded-lg px-3 py-2"
          />
        </div>

        {errors?.secondaryColor && (
          <p className="text-red-500 text-xs mt-2">
            {errors.secondaryColor.message}
          </p>
        )}
      </div>

    </div>
  );
};

export default BrandColorPicker;