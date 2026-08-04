import React from 'react';
import PropTypes from 'prop-types';

export default function EmptyState({ message = "No data available" }) {
  return (
    <div className="text-center py-6 px-4 bg-gray-50 border border-dashed border-gray-200 rounded-xl">
      <p className="text-sm text-gray-400 italic">{message}</p>
    </div>
  );
}

EmptyState.propTypes = { message: PropTypes.string };