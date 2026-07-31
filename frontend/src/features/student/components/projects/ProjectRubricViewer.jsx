import React from 'react';

/**
 * Presentational component to display project grading rubric.
 * Renders weighted criteria with matching progress indicators and verifies total weight sums to 100%.
 */
export const ProjectRubricViewer = ({ rubric = [] }) => {
  const totalWeight = rubric.reduce((sum, item) => sum + item.weight, 0);

  return (
    <div className="bg-pragati-surface border border-pragati-border rounded-xl p-6 shadow-xl transition-all duration-300 hover:shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg md:text-xl font-bold text-pragati-text tracking-wide">
            Grading Rubric
          </h3>
          <p className="text-xs md:text-sm text-pragati-muted mt-1">
            Weighted assessment criteria for final evaluation
          </p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs text-pragati-muted uppercase tracking-wider">Total Weight</span>
          <span className="text-xl font-extrabold text-pragati-accent">
            {totalWeight}%
          </span>
        </div>
      </div>

      <div className="space-y-5">
        {rubric.map((item, idx) => (
          <div key={idx} className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-pragati-text/90">
                {item.criterion}
              </span>
              <span className="font-bold text-pragati-accent">
                {item.weight}%
              </span>
            </div>
            
            {/* Custom styled progress bar */}
            <div className="w-full h-2 bg-pragati-bg rounded-full overflow-hidden border border-pragati-border">
              <div 
                className="h-full bg-gradient-to-r from-pragati-accent/70 to-pragati-accent rounded-full transition-all duration-500 ease-out"
                style={{ width: `${item.weight}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {totalWeight !== 100 && (
        <div className="mt-4 p-3 bg-pragati-danger/10 border border-pragati-danger/20 rounded-lg text-xs text-pragati-danger flex items-center gap-2">
          <span>⚠️ Warning: Rubric criteria do not sum to 100% (currently {totalWeight}%).</span>
        </div>
      )}
    </div>
  );
};

export default ProjectRubricViewer;
