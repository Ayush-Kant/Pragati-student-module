import React from "react";
import { Award, Plus, X, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function RubricBuilder({
  register,
  errors,
  rubricsFields,
  appendRubric,
  removeRubric,
  totalRubricWeight,
  isRubricWeightValid,
}) {
  const handleAdd = () => {
    appendRubric({
      id: `rub-${Date.now()}`,
      title: "",
      description: "",
      weight: 10,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Evaluation Rubrics</h3>
            <p className="text-xs text-gray-500">Define criteria weights. Sum of weights must equal exactly 100%.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-blue-200 text-blue-600 bg-blue-50 text-xs font-semibold rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Criterion
        </button>
      </div>

      {/* Criteria Rows */}
      {rubricsFields.length > 0 ? (
        <div className="space-y-4">
          {rubricsFields.map((field, index) => (
            <div
              key={field.id}
              className="p-4 bg-gray-50 border border-gray-200 rounded-xl relative space-y-3 group"
            >
              {/* Row inputs */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                {/* Title */}
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-semibold text-gray-500 mb-1 uppercase">Criterion Name</label>
                  <input
                    type="text"
                    {...register(`rubrics.${index}.title`)}
                    placeholder="e.g., Code Quality, UX Design..."
                    className={`w-full px-3 py-2 rounded-lg border ${
                      errors?.rubrics?.[index]?.title ? "border-red-500" : "border-gray-200"
                    } bg-white outline-none focus:border-blue-500 transition-all text-xs font-semibold text-gray-800`}
                  />
                  {errors?.rubrics?.[index]?.title && (
                    <p className="text-[10px] text-red-500 font-medium mt-1">
                      {errors.rubrics[index].title.message}
                    </p>
                  )}
                </div>

                {/* Weight */}
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 mb-1 uppercase">Weight (%)</label>
                  <input
                    type="number"
                    {...register(`rubrics.${index}.weight`, { valueAsNumber: true })}
                    placeholder="e.g., 25"
                    className={`w-full px-3 py-2 rounded-lg border ${
                      errors?.rubrics?.[index]?.weight ? "border-red-500" : "border-gray-200"
                    } bg-white outline-none focus:border-blue-500 transition-all text-xs font-semibold text-gray-800`}
                    min={1}
                    max={100}
                  />
                  {errors?.rubrics?.[index]?.weight && (
                    <p className="text-[10px] text-red-500 font-medium mt-1">
                      {errors.rubrics[index].weight.message}
                    </p>
                  )}
                </div>

                {/* Delete button wrapper (aligns vertically with fields on desktop) */}
                <div className="flex justify-end md:justify-center md:pt-6">
                  <button
                    type="button"
                    onClick={() => removeRubric(index)}
                    className="flex items-center gap-1 px-3 py-1.5 border border-red-150 text-red-600 bg-red-50/50 hover:bg-red-50 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1 uppercase">Description</label>
                <input
                  type="text"
                  {...register(`rubrics.${index}.description`)}
                  placeholder="Describe the rubric expectations for the students..."
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white outline-none focus:border-blue-500 transition-all text-xs text-gray-700"
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
          <p className="text-xs text-gray-400 font-medium">No evaluation criteria added. Click 'Add Criterion'.</p>
        </div>
      )}

      {/* Validation Banner and Total Footer */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 border rounded-xl bg-gray-50">
        <div className="flex items-center gap-2.5">
          {isRubricWeightValid ? (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span className="text-xs font-bold">Rubric weight distribution is valid (Exactly 100%)</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-amber-600">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 animate-pulse" />
              <span className="text-xs font-bold">
                Total weight must equal 100% (Current: {totalRubricWeight}%)
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 border-gray-200 pt-3 sm:pt-0">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Total Weight:</span>
          <span
            className={`text-lg font-extrabold ${
              isRubricWeightValid ? "text-green-600" : "text-amber-600"
            }`}
          >
            {totalRubricWeight}%
          </span>
        </div>
      </div>
      
      {errors.rubrics && !Array.isArray(errors.rubrics) && (
        <p className="text-xs text-red-500 font-medium mt-1">{errors.rubrics.message}</p>
      )}
    </div>
  );
}
