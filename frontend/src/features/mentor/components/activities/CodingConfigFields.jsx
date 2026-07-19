import React from 'react';

const CodingConfigFields = () => {
  return (
    <div className="p-4 border border-dashed rounded-md border-gray-300">
        <h3 className="font-semibold text-gray-700">Coding Settings</h3>
        <div className="mt-4">
            <label htmlFor="allowedLanguages" className="block text-sm font-medium text-gray-700">Allowed Languages</label>
            <select multiple id="allowedLanguages" name="allowedLanguages" className="block w-full mt-1 border-gray-300 rounded-md shadow-sm">
                <option>JavaScript</option>
                <option>Python</option>
                <option>Java</option>
                <option>C++</option>
            </select>
        </div>
        <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-700">Test Cases</h4>
            <button type="button" className="mt-2 px-3 py-1 text-sm text-indigo-600 bg-indigo-100 rounded-md hover:bg-indigo-200">
                + Add Test Case
            </button>
        </div>
    </div>
  );
};

export default CodingConfigFields;
