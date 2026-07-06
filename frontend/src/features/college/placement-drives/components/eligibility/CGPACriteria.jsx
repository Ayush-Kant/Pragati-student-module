import React from "react";

const CGPACriteria = ({ cgpa, onChange, isEditable = true, error }) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-semibold text-gray-700">
          Minimum CGPA <span className="text-red-500">*</span>
        </label>
        {isEditable && (
          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            {cgpa || "0.0"} / 10.0
          </span>
        )}
      </div>
      {isEditable ? (
        <div className="space-y-1">
          <input
            type="number"
            step="0.1"
            min="0"
            max="10"
            value={cgpa === null || cgpa === undefined ? "" : cgpa}
            onChange={(e) => {
              const val = e.target.value;
              onChange(val === "" ? "" : parseFloat(val));
            }}
            placeholder="e.g. 7.5"
            className={`w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition focus:ring-2 ${
              error
                ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                : "border-gray-300 focus:border-[#ff7a00] focus:ring-[#ff7a00]/20"
            }`}
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
      ) : (
        <div className="text-sm font-medium text-gray-800 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
          {cgpa || "0.0"} or above
        </div>
      )}
    </div>
  );
};

export default CGPACriteria;
