import React from 'react';

const RubricBuilder = () => {
  return (
    <div className="p-4 border border-dashed rounded-md border-gray-300">
        <h3 className="font-semibold text-gray-700">Rubric Builder</h3>
        <div className="mt-4 space-y-4">
            {/* Placeholder for a single criterion row */}
            <div className="flex items-center gap-4">
                <input type="text" placeholder="Criterion" className="flex-grow border-gray-300 rounded-md shadow-sm" />
                <input type="number" placeholder="Weight %" className="w-24 border-gray-300 rounded-md shadow-sm" />
                <button type="button" className="text-gray-500 hover:text-red-600">&times;</button>
            </div>
        </div>
        <button type="button" className="mt-4 px-3 py-1 text-sm text-indigo-600 bg-indigo-100 rounded-md hover:bg-indigo-200">
            + Add Criterion
        </button>
    </div>
  );
};

export default RubricBuilder;
