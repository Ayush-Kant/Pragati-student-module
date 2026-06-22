import React from 'react';

const QuizConfigFields = () => {
  return (
    <div className="p-4 border border-dashed rounded-md border-gray-300">
        <h3 className="font-semibold text-gray-700">Quiz Settings</h3>
        <div className="grid grid-cols-1 gap-6 mt-4 md:grid-cols-2">
            <div>
                <label htmlFor="timeLimit" className="block text-sm font-medium text-gray-700">Time Limit (seconds)</label>
                <input type="number" name="timeLimit" id="timeLimit" className="block w-full mt-1 border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
                <label htmlFor="maxAttempts" className="block text-sm font-medium text-gray-700">Max Attempts</label>
                <input type="number" name="maxAttempts" id="maxAttempts" className="block w-full mt-1 border-gray-300 rounded-md shadow-sm" />
            </div>
        </div>
        <div className="flex items-center mt-4">
            <input id="randomizeOrder" name="randomizeOrder" type="checkbox" className="w-4 h-4 text-indigo-600 border-gray-300 rounded" />
            <label htmlFor="randomizeOrder" className="ml-2 block text-sm text-gray-900">Randomise Order</label>
        </div>
    </div>
  );
};

export default QuizConfigFields;
