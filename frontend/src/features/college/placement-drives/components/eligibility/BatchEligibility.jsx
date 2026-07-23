import React from "react";
import { BATCHES } from "../../constants/placementDriveConstants";

const BatchEligibility = ({ selectedBatches = [], onChange, isEditable = true }) => {
  const handleToggle = (batch) => {
    if (!isEditable) return;
    if (selectedBatches.includes(batch)) {
      onChange(selectedBatches.filter((b) => b !== batch));
    } else {
      onChange([...selectedBatches, batch]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        Eligible Batches <span className="text-red-500">*</span>
      </label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {BATCHES.map((batch) => {
          const isChecked = selectedBatches.includes(batch);
          return (
            <label
              key={batch}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border text-sm cursor-pointer transition-all ${
                isChecked
                  ? "border-[#ff7a00] bg-[#fff4ec] text-[#ff7a00] font-medium"
                  : "border-gray-200 hover:bg-gray-50 text-gray-600"
              } ${!isEditable ? "opacity-80 cursor-default" : ""}`}
            >
              <input
                type="checkbox"
                checked={isChecked}
                disabled={!isEditable}
                onChange={() => handleToggle(batch)}
                className="rounded text-[#ff7a00] focus:ring-[#ff7a00] h-4 w-4 border-gray-300"
              />
              <span>{batch}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default BatchEligibility;
